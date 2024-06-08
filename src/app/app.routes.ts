import { Routes } from '@angular/router';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { PaymentListComponent } from './components/payment/payment-list/payment-list.component';
import { PaymentCreateComponent } from './components/payment/payment-create/payment-create.component';
import { PaymentUpdateComponent } from './components/payment/payment-update/payment-update.component';
import { PaymentDeleteComponent } from './components/payment/payment-delete/payment-delete.component';
import { CategoryCreateComponent } from './components/category/category-create/category-create.component';
import { CategoryUpdateComponent } from './components/category/category-update/category-update.component';
import { CategoryDeleteComponent } from './components/category/category-delete/category-delete.component';

export const routes: Routes = [
  {path: '', component: PaymentListComponent},
  {path: 'pagamento', component: PaymentListComponent},
  {path: 'pagamento/create', component: PaymentCreateComponent},
  {path: 'pagamento/update/:id', component: PaymentUpdateComponent},
  {path: 'pagamento/delete/:id', component: PaymentDeleteComponent},

  {path: 'categoria', component: CategoryListComponent},
  {path: 'categoria/create', component: CategoryCreateComponent},
  {path: 'categoria/update/:id', component: CategoryUpdateComponent},
  {path: 'categoria/delete/:id', component: CategoryDeleteComponent},
];
