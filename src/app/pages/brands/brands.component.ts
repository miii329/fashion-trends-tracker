import {
  Component,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
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

@Component({
  selector: 'app-brands',
  imports: [
    FormsModule,
    AddButtonComponent,
    EditModalBaseComponent,
    CommonModule,
    AsyncPipe,
    CategoryTabsComponent,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  private auth: Auth = inject(Auth);
  // ログインユーザーの状態を監視
  user$ = user(this.auth);

  //  配列ではなく Observable に変更
  private firestore: Firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector); // 警告解消のために必要

  // Firestoreコレクション参照
  private brandsCollection = collection(this.firestore, 'brands');

  //  最初は閉じているので false
  isModalOpen = false;
  //  カテゴリーのリストを定義
  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];
  // 選択中のカテゴリーを保持するSubject（初期値：すべて）
  private selectedCategory$ = new BehaviorSubject<string>('すべて');
  // モーダル入力用のオブジェクト
  newBrand = {
    name: '',
    category: '',
    description: '',
    url: '',
  };
  // --- データ取得ロジック ---
  // Firestoreからの生データ（最新順）
  private rawBrands$: Observable<any[]>;
  // 2. 表示用にフィルタリングされたデータ
  // brands$ と selectedCategory$ の両方が変わるたびに自動で再計算される
  filteredBrands$: Observable<any[]>;
  constructor() {
    // 1. ログインユーザーが切り替わったら、自動的にクエリを作り直す
    this.rawBrands$ = this.user$.pipe(
      switchMap((currentUser) => {
        if (currentUser) {
          // 非同期コールバック内でのFirebase API呼び出しをAngularのコンテキストで実行
          return runInInjectionContext(this.injector, () => {
            const q = query(
              this.brandsCollection,
              where('uid', '==', currentUser.uid),
              orderBy('createdAt', 'desc')
            );
            // idFieldを指定してドキュメントIDを取得可能にする
            return collectionData(q, { idField: 'id' }) as Observable<any[]>;
          });
        } else {
          // 未ログインの場合：空のリストを返す
          return of([]);
        }
      })
    ) as Observable<any[]>;
    // フィルタリングロジックの合体
    this.filteredBrands$ = combineLatest([
      this.rawBrands$,
      this.selectedCategory$,
    ]).pipe(
      map(([brands, selectedCategory]) => {
        if (selectedCategory === 'すべて') return brands;
        return brands.filter((brand) => brand.category === selectedCategory);
      })
    );
  }
  // --- メソッド ---
  // 現在の選択カテゴリーを取得（テンプレートでのバインド用）
  get currentCategory(): string {
    return this.selectedCategory$.value;
  }

  // 子コンポーネント(タブ)から呼ばれる関数
  onCategoryChanged(category: string) {
    this.selectedCategory$.next(category);
  }

  openAddModal() {
    this.newBrand = {
      name: '',
      category: '',
      description: '',
      url: '',
    };
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }
  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }

  // 4. 保存処理を Firebase 仕様に
  async saveBrand() {
    // ① 現在のログインユーザー情報を取得
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      alert('ログインが必要です');
      return;
    }
    if (this.newBrand.name.trim()) {
      try {
        await addDoc(this.brandsCollection, {
          name: this.newBrand.name,
          category: this.newBrand.category,
          description: this.newBrand.description,
          url: this.newBrand.url,
          uid: currentUser.uid, // ユーザーIDも保存
          createdAt: serverTimestamp(), // Firebaseサーバー時刻を使用するのがベスト
        });

        this.isModalOpen = false;
        // フォームをリセット
        this.newBrand = {
          name: '',
          category: 'ファッション',
          description: '',
          url: '',
        };
      } catch (error) {
        console.error('保存エラー:', error);
      }
    }
  }
}
