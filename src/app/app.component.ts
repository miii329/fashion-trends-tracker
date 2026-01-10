import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryTabsComponent } from './components/category-tabs/category-tabs.component';
import { AsyncPipe, CommonModule } from '@angular/common';
// Firebase Auth 関連のインポート
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, // <router-outlet> を使うために必要
    RouterLink, // [routerLink] を使うために必要
    RouterLinkActive, // [routerLinkActive] を使うために必要
    CategoryTabsComponent,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private auth: Auth = inject(Auth);
  // タイトル
  title = 'fashion-trends-tracker';
  // カテゴリー管理用（初期値は 'すべて'）
  selectedCategory: string = 'すべて';
  // ログインユーザーの状態を監視
  user$: Observable<User | null> = user(this.auth);
  // ログイン処理
  async login() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  }
  // ログアウト処理
  async logout() {
    if (confirm('ログアウトしますか？')) {
      await signOut(this.auth);
    }
  }
}
