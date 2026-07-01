import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Order, Product } from '../../services/data.service';

@Component({
  selector: 'app-subcontractor-work',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📋 Mon Travail</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Tâches et signalement de consommation</p>
      </div>

      <div class="space-y-4">
        @for (order of orders(); track order.id) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ order.orderNumber }}</h3>
                <span class="px-3 py-1 text-xs font-bold rounded-full {{ getPriorityColor(order.priority) }}">
                  {{ getPriorityLabel(order.priority) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.productName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Quantité: {{ order.quantity }} {{ order.unit }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ order.progress }}%</p>
            </div>
          </div>

          <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all"
              [style.width.%]="order.progress"></div>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>📅 {{ formatDate(order.dueDate) }}</span>
            <span>👤 {{ order.assignedTo }}</span>
          </div>

          <!-- Report Consumption Button -->
          <button (click)="openConsumptionForm(order)"
            class="mt-4 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md">
            📸 Signaler Consommation
          </button>
        </div>
        } @empty {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="text-5xl mb-4">✅</div>
          <p class="text-lg">Aucune tâche en cours</p>
        </div>
        }
      </div>

      <!-- Consumption Form Modal -->
      @if (showConsumptionForm && selectedOrder) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">📸 Signaler Consommation</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ selectedOrder.productName }} - {{ selectedOrder.orderNumber }}
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité consommée</label>
              <input type="number" [(ngModel)]="consumptionQuantity" min="1" max="{{selectedOrder.quantity}}"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo (simulation)</label>
              <div class="flex gap-2">
                @for (photo of samplePhotos; track photo) {
                <button (click)="selectedPhoto = photo"
                  class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  [class]="selectedPhoto === photo ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'">
                  {{ photo }}
                </button>
                }
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea [(ngModel)]="consumptionNotes" rows="2"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Décrivez le travail effectué..."></textarea>
            </div>
            <div class="flex gap-3">
              <button (click)="submitConsumption()"
                class="px-6 py-3 bg-success-600 text-white rounded-xl font-bold hover:bg-success-700 transition-all shadow-lg flex-1">
                ✅ Confirmer
              </button>
              <button (click)="closeConsumptionForm()"
                class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- My Consumptions History -->
      @if (myConsumptions().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📜 Historique Consommations</h2>
        <div class="space-y-3">
          @for (cons of myConsumptions(); track cons.id) {
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 dark:text-white">{{ cons.productName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ cons.quantity }} {{ cons.unit }} • {{ cons.siteName }} • {{ cons.notes }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-danger-600 dark:text-danger-400">-{{ cons.quantity }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(cons.date) }}</p>
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
export class SubcontractorWorkComponent implements OnInit {
  orders = signal<Order[]>([]);
  myConsumptions = signal<any[]>([]);
  products = signal<Product[]>([]);

  showConsumptionForm = false;
  selectedOrder: Order | null = null;
  consumptionQuantity = 1;
  consumptionNotes = '';
  selectedPhoto = '📷 Sans photo';
  samplePhotos = ['📷 Sans photo', '📸 Travail terminé', '🔧 Installation', '✅ Avant/Après'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getOrders().subscribe(orders => {
      this.orders.set(orders.filter(o => o.status === 'in-progress' || o.status === 'pending'));
    });
    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
    });
    this.dataService.getMaterialConsumptions().subscribe(consumptions => {
      this.myConsumptions.set(consumptions.filter(c => c.subcontractorName === 'Mohamed Ben Ali'));
    });
  }

  openConsumptionForm(order: Order): void {
    this.selectedOrder = order;
    this.consumptionQuantity = Math.min(10, order.quantity);
    this.consumptionNotes = '';
    this.selectedPhoto = '📷 Sans photo';
    this.showConsumptionForm = true;
  }

  closeConsumptionForm(): void {
    this.showConsumptionForm = false;
    this.selectedOrder = null;
  }

  submitConsumption(): void {
    if (!this.selectedOrder || this.consumptionQuantity < 1) return;

    const product = this.products().find(p => p.id === this.selectedOrder!.productId);
    if (!product) return;

    this.dataService.reportConsumption({
      requestId: this.selectedOrder.id,
      subcontractorName: 'Mohamed Ben Ali',
      productId: product.id,
      productName: product.name,
      quantity: this.consumptionQuantity,
      unit: product.unit,
      siteName: this.selectedOrder.projectName,
      photoUrl: this.selectedPhoto,
      notes: this.consumptionNotes || 'Consommation signalée'
    }).subscribe(() => {
      alert(`✅ Consommation signalée!\n\n${product.name}: ${this.consumptionQuantity} ${product.unit}\nLe stock a été mis à jour.`);
      this.closeConsumptionForm();
      // Refresh
      this.dataService.getMaterialConsumptions().subscribe(consumptions => {
        this.myConsumptions.set(consumptions.filter(c => c.subcontractorName === 'Mohamed Ben Ali'));
      });
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'high': return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      case 'medium': return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevé';
      case 'medium': return 'Moyen';
      case 'low': return 'Bas';
      default: return priority;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
