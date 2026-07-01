import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

interface NavItem {
  path: string;
  label: string;
  labelAr: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.isDarkMode());
  navItems: NavItem[] = [
    {
      path: 'dashboard',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      path: 'owner-dashboard',
      label: 'Owner',
      labelAr: 'المالك',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      badge: 0
    },
    {
      path: 'subcontractor',
      label: 'Sous-traitant',
      labelAr: 'المقاول',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z',
      badge: 0
    },
    {
      path: 'products',
      label: 'Products',
      labelAr: 'المنتجات',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
      path: 'orders',
      label: 'Orders',
      labelAr: 'الأوامر',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      badge: 3
    },
    {
      path: 'stock',
      label: 'Stock',
      labelAr: 'المخزون',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
    },
    {
      path: 'purchase-orders',
      label: 'PO',
      labelAr: 'طلبات الشراء',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      badge: 2
    },
    {
      path: 'stock-by-project',
      label: 'Projects',
      labelAr: 'المشاريع',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    }
  ];




 toggleTheme() {
    this.themeService.toggleTheme();
  }

  getNavItemLabel(item: NavItem): string {
    return this.isDarkMode() ? item.labelAr : item.label;
  }
}
