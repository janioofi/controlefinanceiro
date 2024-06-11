import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/home/category/category.component';

export const routes: Routes = [
  {path: 'categoria', component: CategoryComponent},
  {path: '', component: CategoryComponent},
];
