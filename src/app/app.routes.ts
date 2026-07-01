import { Routes } from '@angular/router';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';
import { OwnerLayoutComponent } from './components/layouts/owner-layout.component';
import { ManagerLayoutComponent } from './components/layouts/manager-layout.component';
import { SubcontractorLayoutComponent } from './components/layouts/subcontractor-layout.component';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { OwnerProjectsComponent } from './pages/owner-projects/owner-projects.component';
import { OwnerStockOverviewComponent } from './pages/owner-stock-overview/owner-stock-overview.component';
import { OwnerSubcontractorsComponent } from './pages/owner-subcontractors/owner-subcontractors.component';
import { OwnerReportsComponent } from './pages/owner-reports/owner-reports.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ProductsComponent } from './pages/products/products.component';
import { ManagerSitesComponent } from './pages/manager-sites/manager-sites.component';
import { StockByProjectComponent } from './pages/stock-by-project/stock-by-project.component';
import { StockComponent } from './pages/stock/stock.component';
import { SubcontractorHomeComponent } from './pages/subcontractor-home/subcontractor-home.component';
import { SubcontractorWorkComponent } from './pages/subcontractor-work/subcontractor-work.component';
import { SubcontractorStockComponent } from './pages/subcontractor-stock/subcontractor-stock.component';
import { SubcontractorContactsComponent } from './pages/subcontractor-contacts/subcontractor-contacts.component';
import { SubcontractorPaymentsComponent } from './pages/subcontractor-payments/subcontractor-payments.component';

export const routes: Routes = [
  { path: '', component: RoleSelectionComponent, pathMatch: 'full' },

  // Owner Routes
  {
    path: 'owner',
    component: OwnerLayoutComponent,
    children: [
      { path: 'dashboard', component: OwnerDashboardComponent },
      { path: 'projects', component: OwnerProjectsComponent },
      { path: 'stock-overview', component: OwnerStockOverviewComponent },
      { path: 'subcontractors', component: OwnerSubcontractorsComponent },
      { path: 'reports', component: OwnerReportsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Manager Routes
  {
    path: 'manager',
    component: ManagerLayoutComponent,
    children: [
      { path: 'dashboard', component: ManagerDashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'sites', component: ManagerSitesComponent },
      { path: 'stock-by-project', component: StockByProjectComponent },
      { path: 'transactions', component: StockComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Subcontractor Routes
  {
    path: 'subcontractor',
    component: SubcontractorLayoutComponent,
    children: [
      { path: 'home', component: SubcontractorHomeComponent },
      { path: 'my-work', component: SubcontractorWorkComponent },
      { path: 'my-stock', component: SubcontractorStockComponent },
      { path: 'contacts', component: SubcontractorContactsComponent },
      { path: 'payments', component: SubcontractorPaymentsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
