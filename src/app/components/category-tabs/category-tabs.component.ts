import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-tabs',
  imports: [CommonModule],
  templateUrl: './category-tabs.component.html',
  styleUrl: './category-tabs.component.css',
})
export class CategoryTabsComponent {
  // --- 親から受け取るデータ ---
  @Input() selectedCategory: string = 'すべて';

  // --- 親へ送るイベント ---
  @Output() categoryChange = new EventEmitter<string>();

  // カテゴリーのリスト
  categories = [
    'すべて',
    'ファッション',
    'メイク',
    'アクセサリー',
    'カラコン',
    'その他',
  ];

  // --- クリック時に実行される処理 ---
  selectCategory(category: string) {
    // 親コンポーネントに「このカテゴリーが選ばれたよ！」と伝える
    this.categoryChange.emit(category);
  }
}
