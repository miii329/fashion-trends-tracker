import { Component } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';
import { CardBaseComponent } from '@/components/card-base/card-base.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brands',
  imports: [
    FormsModule,
    AddButtonComponent,
    EditModalBaseComponent,
    CardBaseComponent,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  // 1. 最初は閉じているので false
  isModalOpen = false;

  // ブランド一覧の初期データ
  brands: any[] = [
    {
      name: 'Nike',
      category: 'スポーツ',
      description: 'スニーカーが有名',
      url: 'https://www.nike.com',
    },
  ];
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

  // 3. 保存処理
  saveBrand() {
    if (this.newBrand.name.trim()) {
      // 1. 配列に現在の入力内容をコピーして追加
      this.brands.unshift({ ...this.newBrand });

      // 2. 入力欄をすべてリセット
      this.newBrand = { name: '', category: '', description: '', url: '' };

      this.isModalOpen = false;
    }
  }
}
