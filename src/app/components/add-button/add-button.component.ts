import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-button',
  imports: [],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css',
})
export class AddButtonComponent {
  @Input() label: string = '追加'; // デフォルト値
  @Output() btnClick = new EventEmitter<void>();
  onClick() {
    this.btnClick.emit();
  }
}
