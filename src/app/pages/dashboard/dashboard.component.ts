import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Product, Transaction, Order, PurchaseOrder } from '../../services/data.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = signal({
    totalStockValue: 0,
    lowStockItems: 0,
    expiringItems: 0,
    pendingPOs: 0,
    activeOrders: 0
  });

  recentTransactions = signal<Transaction[]>([]);
  lowStockProducts = signal<Product[]>([]);
  activeOrders = signal<Order[]>([]);
  pendingPOs = signal<PurchaseOrder[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  resetData(): void {
    this.dataService.resetData().subscribe(() => {
      this.loadDashboardData();
    });
  }

  private loadDashboardData(): void {
    this.dataService.getDashboardStats().subscribe(stats => {
      this.stats.set(stats);
      this.recentTransactions.set(stats.recentTransactions);
    });

    this.dataService.getLowStockProducts().subscribe(products => {
      this.lowStockProducts.set(products.slice(0, 5));
    });

    this.dataService.getOrders().subscribe(orders => {
      this.activeOrders.set(orders.filter(o => o.status === 'in-progress').slice(0, 5));
    });

    this.dataService.getPurchaseOrders().subscribe(pos => {
      this.pendingPOs.set(pos.filter(po => po.status === 'draft' || po.status === 'approved').slice(0, 5));
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'in':
        return 'M7 11l5-5m0 0l5 5m-5-5v12';
      case 'out':
        return 'M17 13l-5 5m0 0l-5-5m5 5V6';
      default:
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'in':
        return 'text-success-600 dark:text-success-400';
      case 'out':
        return 'text-danger-600 dark:text-danger-400';
      default:
        return 'text-warning-600 dark:text-warning-400';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'high':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      case 'medium':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'done':
      case 'received':
      case 'approved':
        return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'in-progress':
      case 'ordered':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'pending':
      case 'draft':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }
}
