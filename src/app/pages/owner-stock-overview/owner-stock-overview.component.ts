import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Product } from '../../services/data.service';

@Component({
  selector: 'app-owner-stock-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📦 Aperçu du Stock</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de tous les articles</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Total Articles</p>
          <p class="text-3xl font-bold mt-2">{{ totalItems() }}</p>
        </div>
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Valeur Totale</p>
          <p class="text-2xl font-bold mt-2">{{ formatCurrency(totalValue()) }}</p>
        </div>
        <div class="bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Stock Faible</p>
          <p class="text-3xl font-bold mt-2">{{ lowStockCount() }}</p>
        </div>
        <div class="bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Stock Critique</p>
          <p class="text-3xl font-bold mt-2">{{ criticalStockCount() }}</p>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Répartition par Catégorie</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (cat of categoryBreakdown(); track cat.name) {
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ cat.count }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ cat.name }}</p>
            <p class="text-xs text-primary-600 dark:text-primary-400 mt-1">{{ formatCurrency(cat.value) }}</p>
          </div>
          }
        </div>
      </div>

      <!-- All Products -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tous les Articles</h2>
        <div class="space-y-3">
          @for (product of products(); track product.id) {
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ product.sku }} • {{ product.location }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" [class]="getStockColor(product)">{{ product.stockQuantity }} {{ product.unit }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatCurrency(product.stockQuantity * product.unitPrice) }}</p>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OwnerStockOverviewComponent implements OnInit {
  products = signal<Product[]>([]);
  totalItems = signal(0);
  totalValue = signal(0);
  lowStockCount = signal(0);
  criticalStockCount = signal(0);
  categoryBreakdown = signal<any[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
      this.totalItems.set(products.reduce((s, p) => s + p.stockQuantity, 0));
      this.totalValue.set(products.reduce((s, p) => s + (p.stockQuantity * p.unitPrice), 0));
      this.lowStockCount.set(products.filter(p => p.stockQuantity <= p.minStock && p.stockQuantity > 0).length);
      this.criticalStockCount.set(products.filter(p => p.stockQuantity === 0).length);

      const cats: any = {};
      products.forEach(p => {
        if (!cats[p.category]) cats[p.category] = { name: this.getCategoryName(p.category), count: 0, value: 0 };
        cats[p.category].count += p.stockQuantity;
        cats[p.category].value += p.stockQuantity * p.unitPrice;
      });
      this.categoryBreakdown.set(Object.values(cats));
    });
  }

  getCategoryName(cat: string): string {
    const names: any = { hose: 'Tuyaux', fitting: 'Raccords', pump: 'Pompes', seal: 'Joints', oil: 'Huiles', cylinder: 'Cylindres', valve: 'Vannes' };
    return names[cat] || cat;
  }

  getStockColor(product: Product): string {
    if (product.stockQuantity === 0) return 'text-danger-600 dark:text-danger-400';
    if (product.stockQuantity <= product.minStock) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(value);
  }
}
