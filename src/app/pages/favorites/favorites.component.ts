import { Component, inject } from '@angular/core';
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
  // お気に入り商品用のコレクション（favoritesに変更）
  private favoritesCollection = collection(this.firestore, 'favorites');
  // ブランド選択肢用
  private brandsCollection = collection(this.firestore, 'brands');
  // --- 状態管理 ---
  // BehaviorSubject で選択中のカテゴリーを管理（これが「箱」）
  private selectedCategorySubject = new BehaviorSubject<string>('すべて');

  // HTML側 [selectedCategory]="currentCategory" で使う窓口
  get currentCategory(): string {
    return this.selectedCategorySubject.value;
  }

  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];

  isModalOpen = false;
  newItem = this.getEmptyItem() as FavoriteItem;

  // --- データストリーム ---
  private favorites$: Observable<any[]>;
  existingBrandNames$: Observable<string[]>;

  // これをHTMLの @for で使います
  filteredFavorites$: Observable<any[]>;

  constructor() {
    this.favorites$ = this.user$.pipe(
      switchMap((user) => {
        if (user) {
          // ログイン中なら、その人のUIDで絞り込む
          const q = query(
            this.favoritesCollection,
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          return collectionData(q, { idField: 'id' });
        } else {
          // 未ログインなら空配列を返す
          return of([]);
        }
      })
    ) as Observable<any[]>;
    // 1. 全データの購読
    const q = query(this.favoritesCollection, orderBy('createdAt', 'desc'));
    this.favorites$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;

    // 2. フィルタリングロジックの合体（Firestoreデータかタブが変わるたびに自動実行）
    this.filteredFavorites$ = combineLatest([
      this.favorites$,
      this.selectedCategorySubject,
    ]).pipe(
      map(([items, category]) => {
        if (category === 'すべて') return items;
        return items.filter((item) => item.category === category);
      })
    );

    // ブランド名の選択肢用
    this.existingBrandNames$ = collectionData(this.brandsCollection).pipe(
      map((brands) => brands.map((b: any) => b.name).sort())
    );
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

      this.isModalOpen = false;
      this.newItem = this.getEmptyItem();
    } catch (error) {
      console.error('Error saving favorite item:', error);
      alert('保存に失敗しました');
    }
  }
}
