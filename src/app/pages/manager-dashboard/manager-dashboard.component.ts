import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, MaterialRequest } from '../../services/data.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📊 Dashboard Stock</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble du stock et demandes</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Total Produits</p>
          <p class="text-3xl font-bold mt-2">{{ totalProducts() }}</p>
        </div>
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Valeur Stock</p>
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

      <!-- Pending Requests Section -->
      @if (pendingRequests().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-warning-200 dark:border-warning-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">📥 Demandes en Attente</h2>
          <span class="px-3 py-1 bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300 rounded-full text-sm font-bold">
            {{ pendingRequests().length }} demande(s)
          </span>
        </div>
        <div class="space-y-3">
          @for (req of pendingRequests(); track req.id) {
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-warning-200 dark:border-warning-700">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ req.productName }}</h3>
                  <span class="px-2 py-0.5 bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300 rounded-full text-xs font-bold">
                    En attente
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ req.quantity }} {{ req.unit }} • {{ req.siteName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  👤 {{ req.subcontractorName }} • {{ req.notes }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button (click)="approveRequest(req.id)"
                class="flex-1 px-4 py-2 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700 transition-all shadow-md text-sm">
                ✅ Approuver
              </button>
              <button (click)="rejectRequest(req.id)"
                class="flex-1 px-4 py-2 bg-danger-600 text-white rounded-xl font-bold hover:bg-danger-700 transition-all shadow-md text-sm">
                ❌ Refuser
              </button>
            </div>
          </div>
          }
        </div>
      </div>
      }

      <!-- Low Stock Alerts -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">⚠️ Articles à Surveiller</h2>
        <div class="space-y-3">
          @if (lowStockProducts().length > 0) {
            @for (item of lowStockProducts(); track item.id) {
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.location }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold" [class]="getStockColor(item)">{{ item.stockQuantity }} / {{ item.minStock }} {{ item.unit }}</p>
                <div class="mt-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-24 ml-auto">
                  <div class="h-2 rounded-full" [class]="getBarColor(item)" [style.width.%]="(item.stockQuantity / item.minStock) * 100"></div>
                </div>
              </div>
            </div>
            }
          } @else {
          <p class="text-center text-gray-500 dark:text-gray-400 py-8">Tous les articles sont en stock suffisant ✅</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ManagerDashboardComponent implements OnInit {
  totalProducts = signal(0);
  totalValue = signal(0);
  lowStockCount = signal(0);
  criticalStockCount = signal(0);
  lowStockProducts = signal<any[]>([]);
  pendingRequests = signal<MaterialRequest[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataService.getProducts().subscribe(products => {
      this.totalProducts.set(products.length);
      this.totalValue.set(products.reduce((s, p) => s + (p.stockQuantity * p.unitPrice), 0));
      this.lowStockCount.set(products.filter(p => p.stockQuantity <= p.minStock && p.stockQuantity > 0).length);
      this.criticalStockCount.set(products.filter(p => p.stockQuantity === 0).length);
      this.lowStockProducts.set(products.filter(p => p.stockQuantity <= p.minStock).slice(0, 10));
    });
    this.dataService.getMaterialRequests().subscribe(requests => {
      this.pendingRequests.set(requests.filter(r => r.status === 'pending'));
    });
  }

  approveRequest(requestId: string): void {
    this.dataService.approveRequest(requestId).subscribe(() => {
      alert('✅ Demande approuvée! Le sous-traitant peut maintenant utiliser le matériel.');
      this.loadData();
    });
  }

  rejectRequest(requestId: string): void {
    this.dataService.rejectRequest(requestId).subscribe(() => {
      alert('❌ Demande refusée.');
      this.loadData();
    });
  }

  getStockColor(product: any): string {
    if (product.stockQuantity === 0) return 'text-danger-600 dark:text-danger-400';
    if (product.stockQuantity <= product.minStock) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  }

  getBarColor(product: any): string {
    if (product.stockQuantity === 0) return 'bg-danger-500';
    if (product.stockQuantity <= product.minStock) return 'bg-warning-500';
    return 'bg-success-500';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(value);
  }
}
