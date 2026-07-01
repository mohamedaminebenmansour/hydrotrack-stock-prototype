import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Product, MaterialReturn } from '../../services/data.service';

@Component({
  selector: 'app-subcontractor-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📦 Mon Stock</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Matériel alloué et retours</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
          <p class="text-sm opacity-90">Articles Alloués</p>
          <p class="text-3xl font-bold mt-2">{{ allocatedItems() }}</p>
        </div>
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-5 text-white shadow-lg">
          <p class="text-sm opacity-90">Valeur Totale</p>
          <p class="text-xl font-bold mt-2">{{ formatCurrency(totalValue()) }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Matériel Disponible</h2>
        <div class="space-y-3">
          @for (product of products(); track product.id) {
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ product.location }}</p>
            </div>
            <div class="text-right flex items-center gap-3">
              <div>
                <p class="font-bold" [class]="getStockColor(product)">{{ product.stockQuantity }} {{ product.unit }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatCurrency(product.unitPrice) }}/unité</p>
              </div>
              <button (click)="openReturnForm(product)"
                class="px-3 py-2 bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300 rounded-xl text-sm font-bold hover:bg-warning-200 dark:hover:bg-warning-800 transition-all">
                Retourner
              </button>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Return Form Modal -->
      @if (showReturnForm && selectedProduct) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">🔄 Retourner du Matériel</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ selectedProduct.name }} - Stock actuel: {{ selectedProduct.stockQuantity }} {{ selectedProduct.unit }}
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité à retourner</label>
              <input type="number" [(ngModel)]="returnQuantity" min="1" max="{{selectedProduct.stockQuantity}}"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
              <select [(ngModel)]="returnSite"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Site Kairouan">Site Kairouan</option>
                <option value="Site Sfax">Site Sfax</option>
                <option value="Site Tunis">Site Tunis</option>
                <option value="Site Sousse">Site Sousse</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison du retour</label>
              <textarea [(ngModel)]="returnNotes" rows="2"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Pourquoi retournez-vous ce matériel?"></textarea>
            </div>
            <div class="flex gap-3">
              <button (click)="submitReturn()"
                class="px-6 py-3 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700 transition-all shadow-lg flex-1">
                ✅ Confirmer le Retour
              </button>
              <button (click)="closeReturnForm()"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- My Returns History -->
      @if (myReturns().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">🔄 Historique des Retours</h2>
        <div class="space-y-3">
          @for (ret of myReturns(); track ret.id) {
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 dark:text-white">{{ ret.productName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ ret.siteName }} • {{ ret.notes }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-success-600 dark:text-success-400">+{{ ret.quantity }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(ret.date) }}</p>
            </div>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class SubcontractorStockComponent implements OnInit {
  products = signal<Product[]>([]);
  allocatedItems = signal(0);
  totalValue = signal(0);
  myReturns = signal<MaterialReturn[]>([]);

  showReturnForm = false;
  selectedProduct: Product | null = null;
  returnQuantity = 1;
  returnSite = 'Site Kairouan';
  returnNotes = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
      this.allocatedItems.set(products.reduce((s, p) => s + p.stockQuantity, 0));
      this.totalValue.set(products.reduce((s, p) => s + (p.stockQuantity * p.unitPrice), 0));
    });
    this.dataService.getMaterialReturns().subscribe(returns => {
      this.myReturns.set(returns.filter(r => r.subcontractorName === 'Mohamed Ben Ali'));
    });
  }

  openReturnForm(product: Product): void {
    this.selectedProduct = product;
    this.returnQuantity = Math.min(5, product.stockQuantity);
    this.returnNotes = '';
    this.showReturnForm = true;
  }

  closeReturnForm(): void {
    this.showReturnForm = false;
    this.selectedProduct = null;
  }

  submitReturn(): void {
    if (!this.selectedProduct || this.returnQuantity < 1) return;

    this.dataService.returnMaterial({
      subcontractorName: 'Mohamed Ben Ali',
      productId: this.selectedProduct.id,
      productName: this.selectedProduct.name,
      quantity: this.returnQuantity,
      unit: this.selectedProduct.unit,
      siteName: this.returnSite,
      notes: this.returnNotes || 'Retour de matériel non utilisé'
    }).subscribe(() => {
      alert(`✅ Retour confirmé!\n\n${this.selectedProduct!.name}: ${this.returnQuantity} ${this.selectedProduct!.unit}\nLe stock a été mis à jour.`);
      this.closeReturnForm();
      // Refresh
      this.dataService.getProducts().subscribe(products => {
        this.products.set(products);
        this.allocatedItems.set(products.reduce((s, p) => s + p.stockQuantity, 0));
        this.totalValue.set(products.reduce((s, p) => s + (p.stockQuantity * p.unitPrice), 0));
      });
      this.dataService.getMaterialReturns().subscribe(returns => {
        this.myReturns.set(returns.filter(r => r.subcontractorName === 'Mohamed Ben Ali'));
      });
    });
  }

  getStockColor(product: Product): string {
    if (product.stockQuantity === 0) return 'text-danger-600 dark:text-danger-400';
    if (product.stockQuantity <= product.minStock) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
