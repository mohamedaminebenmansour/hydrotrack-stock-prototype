import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-subcontractors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">👷 Sous-traitants</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gestion des sous-traitants</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (sub of subcontractors; track sub.name) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-500 transition-all">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ sub.name.charAt(0) }}
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ sub.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ sub.specialty }}</p>
              <div class="flex items-center gap-1 mt-2">
                @for (star of [1,2,3,4,5]; track star) {
                <svg class="w-5 h-5 {{ star <= sub.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                }
              </div>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 text-sm font-bold rounded-full {{ sub.status === 'Actif' ? 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100' }}">
                {{ sub.status }}
              </span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ sub.projects }}</p>
              <p class="text-gray-500 dark:text-gray-400">Projets</p>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ sub.completed }}</p>
              <p class="text-gray-500 dark:text-gray-400">Terminés</p>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(sub.totalPaid) }}</p>
              <p class="text-gray-500 dark:text-gray-400">Payé</p>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OwnerSubcontractorsComponent {
  subcontractors = [
    { name: 'Ahmed Hydraulique', specialty: 'Installation tuyauterie haute pression', rating: 5, status: 'Actif', projects: 3, completed: 12, totalPaid: 45000 },
    { name: 'Karim Soudure', specialty: 'Soudure et fabrication métallique', rating: 4, status: 'Actif', projects: 2, completed: 8, totalPaid: 32000 },
    { name: 'Société Générale TP', specialty: 'Travaux publics et génie civil', rating: 4, status: 'Actif', projects: 1, completed: 5, totalPaid: 28000 },
    { name: 'Montages Industries', specialty: 'Montage de pompes et moteurs', rating: 3, status: 'Inactif', projects: 0, completed: 3, totalPaid: 12000 },
    { name: 'Sous-traitant Bizerte', specialty: 'Maintenance hydraulique mobile', rating: 5, status: 'Actif', projects: 2, completed: 6, totalPaid: 19000 },
    { name: 'Électro-Hydraulique TN', specialty: 'Systèmes électro-hydrauliques', rating: 4, status: 'Actif', projects: 1, completed: 4, totalPaid: 22000 }
  ];

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(value);
  }
}
