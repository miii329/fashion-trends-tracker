import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-tabs',
  imports: [CommonModule],
  templateUrl: './category-tabs.component.html',
  styleUrl: './category-tabs.component.css',
})
export class CategoryTabsComponent {
  @Input() categories: string[] = [];
  @Input() activeCategory: string = '';
  @Output() categoryChanged = new EventEmitter<string>(); // クリックされたら親に通知する

  onCategoryClick(category: string) {
    this.categoryChanged.emit(category);
  }
}
