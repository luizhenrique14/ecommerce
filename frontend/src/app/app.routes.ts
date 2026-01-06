import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProductsComponent } from './components/products/products.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SuccessComponent } from './components/success/success.component';
import { AdminProductsListComponent } from './components/admin-products-list/admin-products-list.component';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AdminCategoryComponent } from './components/admin-category/admin-category.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'success', component: SuccessComponent, canActivate: [authGuard] },
  // Admin routes - protected by authGuard which checks for admin role
  { path: 'admin/products', component: AdminProductsListComponent, canActivate: [authGuard] },
  { path: 'admin/products/new', component: AdminProductComponent, canActivate: [authGuard] },
  { path: 'admin/categories/new', component: AdminCategoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
