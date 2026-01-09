import { Component } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditModalBaseComponent } from '@/components/edit-modal-base/edit-modal-base.component';

@Component({
  selector: 'app-favorites',
  imports: [AddButtonComponent, EditModalBaseComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  // 1. 最初は閉じているので false
  isModalOpen = false;

  // 1. ブランド一覧のデータ
  brands = [{ name: 'Nike' }, { name: 'Adidas' }];

  // 2. 入力フォーム用の変数
  newBrandName = '';

  openAddModal() {
    this.newBrandName = ''; // 開くときに入力欄をクリア
    this.isModalOpen = true;
  }

  handleClose() {
    this.isModalOpen = false;
  }

  // 3. 保存処理
  saveBrand() {
    if (this.newBrandName.trim()) {
      // 配列の先頭に追加
      this.brands.unshift({ name: this.newBrandName });

      // モーダルを閉じる
      this.handleClose();

      // 入力欄をリセット
      this.newBrandName = '';
    }
  }
}
