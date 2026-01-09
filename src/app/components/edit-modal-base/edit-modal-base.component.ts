import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-modal-base',
  imports: [],
  templateUrl: './edit-modal-base.component.html',
  styleUrl: './edit-modal-base.component.css',
})
export class EditModalBaseComponent {
  @Input() isOpen = false;
  @Input() title = '編集';
  @Input() submitLabel = '保存';
  @Input() inputLabel = 'ブランド名';
  @Input() isSubmitDisabled = false; // バリデーションエラー時にボタンを無効化できるように
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit();
  }
}
