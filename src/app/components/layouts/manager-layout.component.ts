import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Top Bar -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">HydroTrack</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Stock Manager</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <app-notification-bell></app-notification-bell>
          <button (click)="logout()"
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Changer rôle
          </button>
        </div>
      </div>

      <!-- Page Content -->
      <div class="pb-24">
        <div class="px-4 py-6">
          <router-outlet></router-outlet>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div class="grid grid-cols-5 gap-1 px-2 py-2">
          @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="text-success-600 dark:text-success-400"
            class="flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon" />
            </svg>
            <span class="truncate">{{ item.label }}</span>
          </a>
          }
        </div>
      </nav>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ManagerLayoutComponent {
  navItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/manager/products', label: 'Produits', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/manager/sites', label: 'Sites', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { path: '/manager/stock-by-project', label: 'Projets', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/manager/transactions', label: 'Mouvements', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
  ];

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  logout(): void {
    this.roleService.clearRole();
    this.router.navigate(['/']);
  }
}
