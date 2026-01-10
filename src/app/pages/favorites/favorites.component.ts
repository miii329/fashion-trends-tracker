import { Component, inject } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';

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
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private firestore: Firestore = inject(Firestore);

  // お気に入り商品用のコレクション（favoritesに変更）
  private favoritesCollection = collection(this.firestore, 'favorites');

  // ブランド選択肢用
  private brandsCollection = collection(this.firestore, 'brands');

  isModalOpen = false;

  // favorites$ に変更
  favorites$: Observable<any[]>;
  existingBrandNames$: Observable<string[]>;

  // newItem に変更（newBrandではなく）
  newItem = this.getEmptyItem() as FavoriteItem;

  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];

  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }

  constructor() {
    // favorites コレクションから取得
    const q = query(this.favoritesCollection, orderBy('createdAt', 'desc'));
    this.favorites$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;

    // ブランド選択肢
    this.existingBrandNames$ = collectionData(this.brandsCollection).pipe(
      map((brands) => brands.map((b: any) => b.name).sort())
    );
  }

  private getEmptyItem(): FavoriteItem {
    return {
      brandName: '',
      itemName: '',
      url: '',
      price: null,
      memo: '',
      category: '',
    };
  }

  openAddModal() {
    this.newItem = this.getEmptyItem();
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }

  // saveItem に変更
  async saveItem() {
    if (!this.newItem.brandName.trim() || !this.newItem.itemName.trim()) {
      alert('ブランド名と商品名は必須です');
      return;
    }

    try {
      // favorites コレクションに保存
      await addDoc(this.favoritesCollection, {
        brandName: this.newItem.brandName,
        itemName: this.newItem.itemName,
        url: this.newItem.url,
        price: Number(this.newItem.price) || 0,
        memo: this.newItem.memo,
        category: this.newItem.category || '',
        createdAt: serverTimestamp(),
      });

      this.isModalOpen = false;
      this.newItem = this.getEmptyItem();
    } catch (error) {
      console.error('Error saving favorite item:', error);
      alert('保存に失敗しました');
    }
  }
}
