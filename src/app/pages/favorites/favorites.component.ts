import { Component, inject } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

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
  // 1. 最初は閉じているので false
  isModalOpen = false;

  // 1. カテゴリーのリストを定義
  readonly CATEGORIES = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];
  // モーダル用（'すべて'は選択肢にいらないので除外したリスト）
  get modalCategoryOptions() {
    return this.CATEGORIES.filter((c) => c !== 'すべて');
  }
  // モーダル入力用のオブジェクト
  newBrand = {
    name: '',
    itemName: '',
    url: '',
    price: null as number | null,
    memo: '',
  };
  openAddModal() {
    this.newBrand = {
      name: '',
      itemName: '',
      url: '',
      price: null as number | null,
      memo: '',
    };
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }
  // 1. 配列ではなく Observable に変更
  private firestore: Firestore = inject(Firestore);
  private brandsCollection = collection(this.firestore, 'brands');
  // 商品リスト表示用
  brands$: Observable<any[]>;
  // セレクトボックスの選択肢用
  existingBrandNames$: Observable<string[]>;

  constructor() {
    const q = query(this.brandsCollection, orderBy('createdAt', 'desc'));
    this.brands$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;

    // DBから流れてくるデータから、ブランド名だけのユニークなリストを作る
    this.existingBrandNames$ = this.brands$.pipe(
      map((brands) => {
        const names = brands.map((b) => b.name).filter((name) => !!name);
        return [...new Set(names)].sort(); // 重複を削除してアルファベット順に
      })
    );
  }

  // 4. 保存処理を Firebase 仕様に
  async saveBrand() {
    if (this.newBrand.name.trim()) {
      try {
        await addDoc(this.brandsCollection, {
          name: this.newBrand.name,
          itemName: this.newBrand.itemName,
          url: this.newBrand.url,
          price: this.newBrand.price,
          memo: this.newBrand.memo,
          createdAt: new Date(), // 並び替え用に作成日時を入れる
        });

        this.newBrand = {
          name: '',
          itemName: 'ファッション',
          url: '',
          price: null as number | null,
          memo: '',
        };
        this.isModalOpen = false;
      } catch (error) {
        console.error('保存エラー:', error);
      }
    }
  }
}
