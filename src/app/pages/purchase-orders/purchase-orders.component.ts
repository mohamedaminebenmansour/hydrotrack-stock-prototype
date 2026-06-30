import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, PurchaseOrder } from '../../services/data.service';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './purchase-orders.component.html',
  styleUrl: './purchase-orders.component.scss'
})
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders = signal<PurchaseOrder[]>([]);
  filteredPOs = signal<PurchaseOrder[]>([]);
  selectedStatus = signal('all');

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  private loadPurchaseOrders(): void {
    this.dataService.getPurchaseOrders().subscribe(pos => {
      this.purchaseOrders.set(pos);
      this.filterPOs();
    });
  }

  filterPOs(): void {
    if (this.selectedStatus() === 'all') {
      this.filteredPOs.set(this.purchaseOrders());
      return;
    }

    const filtered = this.purchaseOrders().filter(po => po.status === this.selectedStatus());
    this.filteredPOs.set(filtered);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
    this.filterPOs();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'received':
      case 'approved':
        return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'ordered':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'draft':
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(value);
  }
}
