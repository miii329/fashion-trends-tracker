import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-brand-modal',
  imports: [],
  templateUrl: './edit-brand-modal.component.html',
  styleUrl: './edit-brand-modal.component.css',
})
export class EditBrandModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    // 親に「閉じて！」と通知する
    this.close.emit();
  }

  save() {
    console.log('保存処理');
    this.closeModal(); // 保存後も閉じる
  }
}
