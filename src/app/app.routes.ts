import { Routes } from '@angular/router';
import { BrandsComponent } from './pages/brands/brands.component';
import { NewItemsComponent } from './pages/new-items/new-items.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
  { path: '', redirectTo: '/brands', pathMatch: 'full' },
  { path: 'brands', component: BrandsComponent },
  { path: 'new-items', component: NewItemsComponent },
  { path: 'favorites', component: FavoritesComponent },
];
