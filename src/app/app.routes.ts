import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { StockComponent } from './pages/stock/stock.component';
import { PurchaseOrdersComponent } from './pages/purchase-orders/purchase-orders.component';
import { StockByProjectComponent } from './pages/stock-by-project/stock-by-project.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'stock', component: StockComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent },
      { path: 'stock-by-project', component: StockByProjectComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
