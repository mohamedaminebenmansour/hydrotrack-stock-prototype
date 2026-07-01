import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subcontractor-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">💳 Paiements</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Suivi des paiements</p>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">Payé ce mois</p>
          <p class="text-3xl font-bold mt-2">3 450 TND</p>
        </div>
        <div class="bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl p-6 text-white shadow-lg">
          <p class="text-sm opacity-90">En attente</p>
          <p class="text-3xl font-bold mt-2">1 250 TND</p>
        </div>
      </div>

      <!-- Payment History -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Historique des Paiements</h2>
        <div class="space-y-3">
          @for (payment of payments; track payment.id) {
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center {{ payment.status === 'payé' ? 'bg-success-100 dark:bg-success-900' : 'bg-warning-100 dark:bg-warning-900' }}">
                <svg class="w-6 h-6 {{ payment.status === 'payé' ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ payment.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ payment.date }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900 dark:text-white">{{ payment.amount }}</p>
              <span class="px-2 py-1 text-xs font-bold rounded-full {{ payment.status === 'payé' ? 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100' : 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100' }}">
                {{ payment.status }}
              </span>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Generate Report -->
      <button (click)="generateReport()"
        class="w-full px-8 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
        📄 Générer Rapport de Paiement
      </button>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class SubcontractorPaymentsComponent {
  payments = [
    { id: 1, description: 'Installation tuyauterie Kairouan - Phase 1', amount: '1 200 TND', date: '15/06/2024', status: 'payé' },
    { id: 2, description: 'Réparation pompe Sfax', amount: '850 TND', date: '10/06/2024', status: 'payé' },
    { id: 3, description: 'Fourniture raccords Site Tunis', amount: '1 400 TND', date: '05/06/2024', status: 'payé' },
    { id: 4, description: 'Maintenance préventive Sousse', amount: '750 TND', date: '20/06/2024', status: 'en attente' },
    { id: 5, description: 'Installation flexible Bizerte', amount: '500 TND', date: '25/06/2024', status: 'en attente' },
  ];

  generateReport(): void {
    alert('📄 Génération du rapport en cours...\n\nLe rapport sera envoyé à votre email.');
  }
}
