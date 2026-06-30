import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Order } from '../../services/data.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  private dataService = inject(DataService);

  orders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  selectedStatus = signal('all');

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.dataService.getOrders().subscribe(orders => {
      this.orders.set(orders);
      this.filterOrders();
    });
  }

  filterOrders(): void {
    let filtered = this.orders();
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(o => o.status === this.selectedStatus());
    }
    this.filteredOrders.set(filtered);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
    this.filterOrders();
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
        return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'in-progress':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
