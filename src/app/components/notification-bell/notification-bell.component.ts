import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role.service';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Bell Button -->
      <button (click)="togglePanel()"
        class="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if (unreadCount() > 0) {
        <span
          class="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
          {{ unreadCount() > 9 ? '9+' : unreadCount() }}
        </span>
        }
      </button>

      <!-- Dropdown / Panel -->
      @if (isOpen()) {
      <!-- Overlay for mobile -->
      <div class="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden" (click)="closePanel()"></div>

      <div
        class="fixed md:absolute md:right-0 top-0 md:top-full md:mt-2 z-50 w-full md:w-96 h-full md:h-auto max-h-full md:max-h-[80vh] bg-white dark:bg-gray-800 shadow-2xl md:rounded-2xl md:border md:border-gray-200 dark:border-gray-700 flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
          <div class="flex items-center gap-3">
            @if (unreadCount() > 0) {
            <button (click)="markAllRead()"
              class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Tout lu
            </button>
            }
            <button (click)="closePanel()" class="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto">
          @if (notifications().length === 0) {
          <div class="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
            <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p class="text-sm font-medium">Aucune notification</p>
            <p class="text-xs mt-1">Vous êtes à jour!</p>
          </div>
          } @else {
          @for (notif of notifications(); track notif.id) {
          <div (click)="markRead(notif)"
            class="flex items-start gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            [class]="!notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''">

            <!-- Type Indicator -->
            <div class="flex-shrink-0 mt-1">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                [class]="getTypeBg(notif.type)">
                <span class="text-lg">{{ getTypeIcon(notif.type) }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                  [class]="!notif.read ? 'font-bold' : ''">
                  {{ notif.title }}
                </p>
                @if (!notif.read) {
                <span class="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5"></span>
                }
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ notif.message }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ getTimeAgo(notif.timestamp) }}</p>
            </div>
          </div>
          }
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationBellComponent {
  private roleService = inject(RoleService);
  private notificationService = inject(NotificationService);

  isOpen = signal(false);

  currentRole = this.roleService.currentRole;

  notifications = computed(() => {
    const role = this.currentRole();
    if (!role) return [];
    return this.notificationService.getNotificationsForRole(role);
  });

  unreadCount = computed(() => {
    const role = this.currentRole();
    if (!role) return 0;
    return this.notificationService.getUnreadCount(role);
  });

  togglePanel(): void {
    this.isOpen.update(v => !v);
  }

  closePanel(): void {
    this.isOpen.set(false);
  }

  markRead(notif: Notification): void {
    if (!notif.read) {
      this.notificationService.markAsRead(notif.id);
    }
  }

  markAllRead(): void {
    const role = this.currentRole();
    if (role) {
      this.notificationService.markAllAsRead(role);
    }
  }

  getTimeAgo(date: Date): string {
    return this.notificationService.getTimeAgo(date);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  }

  getTypeBg(type: string): string {
    switch (type) {
      case 'critical': return 'bg-danger-100 dark:bg-danger-900/30';
      case 'warning': return 'bg-warning-100 dark:bg-warning-900/30';
      case 'success': return 'bg-success-100 dark:bg-success-900/30';
      case 'info': return 'bg-primary-100 dark:bg-primary-900/30';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  }
}
