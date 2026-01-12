import {
  Component,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { CategoryTabsComponent } from '@/components/category-tabs/category-tabs.component';
import { Auth, user } from '@angular/fire/auth';

interface FavoriteItem {
  brandName: string;
  itemName: string;
  url: string;
  price: number | null;
  memo: string;
  category?: string;
}

@Component({
  selector: 'app-favorites',
  imports: [
    AddButtonComponent,
    EditModalBaseComponent,
    CardBaseComponent,
    FormsModule,
    CommonModule,
    AsyncPipe,
    CategoryTabsComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth); // 現在のログインユーザーを監視

  private firestore: Firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector); // 警告解消のために必要

  // お気に入り商品用のコレクション（favoritesに変更）
  private favoritesCollection = collection(this.firestore, 'favorites');
  // ブランド選択肢用
  private brandsCollection = collection(this.firestore, 'brands');

  // HTML側 [selectedCategory]="currentCategory" で使う窓口
  get currentCategory(): string {
    return this.selectedCategorySubject.value;
  }
  //  最初は閉じているので false
  isModalOpen = false;
  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];
  // BehaviorSubject で選択中のカテゴリーを管理（これが「箱」）
  private selectedCategorySubject = new BehaviorSubject<string>('すべて');

  newItem = this.getEmptyItem() as FavoriteItem;

  // --- データストリーム ---
  private favorites$: Observable<any[]>;
  existingBrandNames$: Observable<string[]>;

  // これをHTMLの @for で使います
  filteredFavorites$: Observable<any[]>;

  constructor() {
    // 1. ログインユーザーが切り替わったら、自動的にクエリを作り直す
    this.favorites$ = this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          // 非同期コールバック内でのFirebase API呼び出しをAngularのコンテキストで実行
          return runInInjectionContext(this.injector, () => {
            const q = query(
              this.favoritesCollection,
              where('uid', '==', currentUser.uid),
              orderBy('createdAt', 'desc')
            );
            // idFieldを指定してドキュメントIDを取得可能にする
            return collectionData(q, { idField: 'id' }) as Observable<any[]>;
          });
        } else {
          // 未ログインなら空配列を返す
          return of([]);
        }
      })
    ) as Observable<any[]>;

    // フィルタリングロジックの合体（Firestoreデータかタブが変わるたびに自動実行）
    this.filteredFavorites$ = combineLatest([
      this.favorites$,
      this.selectedCategorySubject,
    ]).pipe(
      map(([items, category]) => {
        if (category === 'すべて') return items;
        return items.filter((item) => item.category === category);
      })
    );

    // ブランド名の選択肢用（ログインユーザーのブランドのみ）
    this.existingBrandNames$ = this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          return runInInjectionContext(this.injector, () => {
            const q = query(
              this.brandsCollection,
              where('uid', '==', currentUser.uid),
              orderBy('name')
            );
            return collectionData(q).pipe(
              map((brands) => brands.map((b: any) => b.name))
            );
          });
        } else {
          return of([]);
        }
      })
    );

    // === 最後にsubscribeでデバッグ ===
    console.log('📝 About to subscribe to observables...');

    this.user$.subscribe((user) => {
      console.log('🔐 User subscription fired:', user?.uid);
    });

    this.favorites$.subscribe({
      next: (items) => console.log('📦 favorites$ emitted:', items),
      error: (err) => console.error('❌ favorites$ error:', err),
    });

    this.filteredFavorites$.subscribe({
      next: (items) => console.log('✨ filteredFavorites$ emitted:', items),
      error: (err) => console.error('❌ filteredFavorites$ error:', err),
    });

    this.existingBrandNames$.subscribe({
      next: (brands) => console.log('🏷️ brandNames$ emitted:', brands),
      error: (err) => console.error('❌ brandNames$ error:', err),
    });

    console.log('✅ All subscriptions set up');
  }

  // 子コンポーネント(タブ)からの通知を受け取る関数
  onCategoryChanged(category: string) {
    this.selectedCategorySubject.next(category);
  }

  // --- 以下、メソッド類 ---

  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }

  private getEmptyItem(): FavoriteItem {
    return {
      brandName: '',
      itemName: '',
      url: '',
      price: null,
      memo: '',
      category: 'ファッション', // 保存用初期値
    };
  }

  openAddModal() {
    this.newItem = this.getEmptyItem();
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }

  async saveItem() {
    const currentUser = await this.auth.currentUser; // 現在のユーザーを取得
    if (!currentUser) return; // ログインしてなければ保存させない
    if (!this.newItem.brandName.trim() || !this.newItem.itemName.trim()) {
      alert('ブランド名と商品名は必須です');
      return;
    }

    try {
      await addDoc(this.favoritesCollection, {
        brandName: this.newItem.brandName,
        itemName: this.newItem.itemName,
        url: this.newItem.url,
        price: Number(this.newItem.price) || 0,
        memo: this.newItem.memo,
        category: this.newItem.category || 'その他',
        createdAt: serverTimestamp(),
        uid: currentUser.uid, // ユーザーIDを保存！
      });
      console.log('✅ Item saved successfully!');
      this.isModalOpen = false;
      this.newItem = this.getEmptyItem();
    } catch (error) {
      console.error('Error saving favorite item:', error);
      alert('保存に失敗しました');
    }
  }
}
