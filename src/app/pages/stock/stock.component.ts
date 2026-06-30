import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Transaction, Product } from '../../services/data.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  products = signal<Product[]>([]);
  selectedType = signal('all');

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.getTransactions().subscribe(transactions => {
      this.transactions.set(transactions);
      this.filterTransactions();
    });

    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  filterTransactions(): void {
    if (this.selectedType() === 'all') {
      return;
    }

    const filtered = this.transactions().filter(t => t.type === this.selectedType());
    this.transactions.set(filtered);
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
    this.filterTransactions();
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
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'out':
        return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900';
      default:
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'in':
        return 'Entrée';
      case 'out':
        return 'Sortie';
      default:
        return 'Ajustement';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
