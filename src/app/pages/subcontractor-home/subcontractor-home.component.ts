import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Order, Transaction, Project, MaterialRequest, Product } from '../../services/data.service';

@Component({
  selector: 'app-subcontractor-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">👷 Accueil</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Bienvenue, {{ subcontractorName() }}</p>
      </div>

      <!-- Score & Payments -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Mon Score</p>
              <p class="text-5xl font-bold mt-2">87</p>
              <p class="text-sm opacity-75 mt-1">sur 100 points</p>
            </div>
            <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
            <div class="bg-white h-full rounded-full" style="width: 87%"></div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Paiements en Attente</p>
              <p class="text-4xl font-bold mt-2">1 250 TND</p>
              <p class="text-sm opacity-75 mt-1">À recevoir ce mois</p>
            </div>
            <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-3">
        <a routerLink="/subcontractor/my-work" class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-warning-500 transition-all text-center">
          <div class="text-3xl mb-2">📋</div>
          <p class="font-bold text-gray-900 dark:text-white">Mes Tâches</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ activeTasks() }} en cours</p>
        </a>
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:border-warning-500 transition-all text-center" (click)="showRequestForm = !showRequestForm">
          <div class="text-3xl mb-2">📦</div>
          <p class="font-bold text-gray-900 dark:text-white">Demander Matériel</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ myRequests().length }} demandes</p>
        </div>
        <a routerLink="/subcontractor/contacts" class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-warning-500 transition-all text-center">
          <div class="text-3xl mb-2">📞</div>
          <p class="font-bold text-gray-900 dark:text-white">Contacts</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Équipe et fournisseurs</p>
        </a>
        <a routerLink="/subcontractor/payments" class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-warning-500 transition-all text-center">
          <div class="text-3xl mb-2">💳</div>
          <p class="font-bold text-gray-900 dark:text-white">Paiements</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Suivi des paiements</p>
        </a>
      </div>

      <!-- Material Request Form -->
      @if (showRequestForm) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-primary-200 dark:border-primary-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📦 Nouvelle Demande de Matériel</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produit</label>
            <select [(ngModel)]="selectedProductId"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">-- Choisir --</option>
              @for (product of products(); track product.id) {
              <option value="{{product.id}}">{{ product.name }} (Stock: {{ product.stockQuantity }} {{ product.unit }})</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité</label>
            <input type="number" [(ngModel)]="requestQuantity" min="1"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
            <select [(ngModel)]="selectedSiteId"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">-- Choisir --</option>
              @for (site of allSites(); track site.id) {
              <option value="{{site.id}}">{{ site.name }} - {{ site.location }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea [(ngModel)]="requestNotes" rows="2"
              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>
          <div class="flex gap-3">
            <button (click)="submitRequest()"
              class="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg flex-1">
              ✅ Envoyer la Demande
            </button>
            <button (click)="showRequestForm = false"
              class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all">
              Annuler
            </button>
          </div>
        </div>
      </div>
      }

      <!-- My Requests Status -->
      @if (myRequests().length > 0) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 Mes Demandes</h2>
        <div class="space-y-3">
          @for (req of myRequests(); track req.id) {
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex-1">
              <p class="font-semibold text-gray-900 dark:text-white">{{ req.productName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ req.quantity }} {{ req.unit }} • {{ req.siteName }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-bold rounded-full {{ getStatusBadge(req.status) }}">
              {{ getStatusText(req.status) }}
            </span>
          </div>
          }
        </div>
      </div>
      }

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Activité Récente</h2>
        <div class="space-y-3">
          @for (t of recentActivity(); track t.id) {
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center {{ getTransactionColor(t.type) }}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getTransactionIcon(t.type)" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t.productName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(t.date) }} • {{ t.notes }}</p>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class SubcontractorHomeComponent implements OnInit {
  subcontractorName = signal('Mohamed Ben Ali');
  activeTasks = signal(0);
  recentActivity = signal<Transaction[]>([]);
  products = signal<Product[]>([]);
  allSites = signal<any[]>([]);
  myRequests = signal<MaterialRequest[]>([]);

  showRequestForm = false;
  selectedProductId = '';
  requestQuantity = 1;
  selectedSiteId = '';
  requestNotes = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getOrders().subscribe(orders => {
      this.activeTasks.set(orders.filter(o => o.status === 'in-progress').length);
    });
    this.dataService.getTransactions().subscribe(transactions => {
      this.recentActivity.set(transactions.slice(0, 5));
    });
    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
    });
    this.dataService.getProjects().subscribe(projects => {
      const sites = projects.flatMap(p => (p.sites || []).map(s => ({ ...s, projectName: p.name })));
      this.allSites.set(sites);
    });
    this.dataService.getMaterialRequests().subscribe(requests => {
      this.myRequests.set(requests.filter(r => r.subcontractorName === this.subcontractorName()));
    });
  }

  submitRequest(): void {
    if (!this.selectedProductId || !this.selectedSiteId || this.requestQuantity < 1) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    const product = this.products().find(p => p.id === this.selectedProductId);
    const site = this.allSites().find(s => s.id === this.selectedSiteId);
    if (!product || !site) return;

    this.dataService.addMaterialRequest({
      subcontractorName: this.subcontractorName(),
      siteId: site.id,
      siteName: site.name,
      productId: product.id,
      productName: product.name,
      quantity: this.requestQuantity,
      unit: product.unit,
      notes: this.requestNotes
    }).subscribe(() => {
      alert(`✅ Demande envoyée!\n\n${product.name}: ${this.requestQuantity} ${product.unit}\nSite: ${site.name}\nVotre demande est en attente d'approbation.`);
      this.showRequestForm = false;
      this.selectedProductId = '';
      this.requestQuantity = 1;
      this.selectedSiteId = '';
      this.requestNotes = '';
      // Refresh
      this.dataService.getMaterialRequests().subscribe(requests => {
        this.myRequests.set(requests.filter(r => r.subcontractorName === this.subcontractorName()));
      });
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      case 'approved': return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'rejected': return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'delivered': return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      case 'delivered': return 'Livré';
      default: return status;
    }
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'in': return 'M7 11l5-5m0 0l5 5m-5-5v12';
      case 'out': return 'M17 13l-5 5m0 0l-5-5m5 5V6';
      default: return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'in': return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'out': return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900';
      default: return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
