import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📊 Rapports</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Génération de rapports d'activité</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all text-left group">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rapport Financier</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Dépenses, revenus et budget par projet</p>
            </div>
          </div>
        </button>

        <button class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all text-left group">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rapport Stock</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Inventaire, mouvements et alertes</p>
            </div>
          </div>
        </button>

        <button class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all text-left group">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-warning-400 to-warning-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rapport Production</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Ordres de fabrication et productivité</p>
            </div>
          </div>
        </button>

        <button class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all text-left group">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-danger-400 to-danger-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rapport Alertes</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Stock critique, retards et problèmes</p>
            </div>
          </div>
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 Résumé Mensuel</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span class="text-gray-700 dark:text-gray-300">Mouvements de stock (ce mois)</span>
            <span class="font-bold text-gray-900 dark:text-white">156 entrées • 89 sorties</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span class="text-gray-700 dark:text-gray-300">Nouveaux ordres de fabrication</span>
            <span class="font-bold text-gray-900 dark:text-white">12 ce mois</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span class="text-gray-700 dark:text-gray-300">Commandes d'achat générées</span>
            <span class="font-bold text-gray-900 dark:text-white">8 (total: 12 450 TND)</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span class="text-gray-700 dark:text-gray-300">Alertes stock critique résolues</span>
            <span class="font-bold text-green-600">2 résolues • 1 en attente</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OwnerReportsComponent {}
