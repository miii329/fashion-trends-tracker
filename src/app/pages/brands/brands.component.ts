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

@Component({
  selector: 'app-brands',
  imports: [
    FormsModule,
    AddButtonComponent,
    EditModalBaseComponent,
    CardBaseComponent,
    CommonModule,
    AsyncPipe,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
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
    category: '',
    description: '',
    url: '',
  };
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
  // 1. 配列ではなく Observable に変更
  private firestore: Firestore = inject(Firestore);
  brands$: Observable<any[]>;
  private brandsCollection = collection(this.firestore, 'brands');

  constructor() {
    // 2. 最新順(createdAt)に並べてデータを取得する設定
    const q = query(this.brandsCollection, orderBy('createdAt', 'desc'));
    // 3. リアルタイムにデータを購読する
    this.brands$ = collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  // 4. 保存処理を Firebase 仕様に
  async saveBrand() {
    if (this.newBrand.name.trim()) {
      try {
        await addDoc(this.brandsCollection, {
          name: this.newBrand.name,
          category: this.newBrand.category,
          description: this.newBrand.description,
          url: this.newBrand.url,
          createdAt: new Date(), // 並び替え用に作成日時を入れる
        });

        this.newBrand = {
          name: '',
          category: 'ファッション',
          description: '',
          url: '',
        };
        this.isModalOpen = false;
      } catch (error) {
        console.error('保存エラー:', error);
      }
    }
  }
}
