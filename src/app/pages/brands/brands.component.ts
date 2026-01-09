import { Component } from '@angular/core';
import { AddButtonComponent } from '@/components/add-button/add-button.component';
import { EditBrandModalComponent } from '@/components/edit-brand-modal/edit-brand-modal.component';

@Component({
  selector: 'app-brands',
  imports: [AddButtonComponent, EditBrandModalComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  // 1. 最初は閉じているので false
  isModalOpen = false;

  // 2. ボタンから呼ばれる関数
  openAddModal() {
    this.isModalOpen = true;
  }

  // 3. モーダルの (close) イベントから呼ばれる関数
  handleClose() {
    this.isModalOpen = false;
  }
}
