import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
        <!-- Logo & Title -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl mb-6">
            <svg class="w-14 h-14 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">HydroTrack</h1>
          <p class="text-lg text-primary-200">Système de Gestion de Stock Hydraulique</p>
        </div>

        <!-- Role Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Owner -->
          <button (click)="selectRole('owner')"
            class="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Propriétaire</h2>
            <p class="text-sm text-gray-600">Vue d'ensemble de l'entreprise, projets et finances</p>
            <div class="mt-4 inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Accéder <span>→</span>
            </div>
          </button>

          <!-- Stock Manager -->
          <button (click)="selectRole('manager')"
            class="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Stock Manager</h2>
            <p class="text-sm text-gray-600">Gestion des stocks, sites et mouvements</p>
            <div class="mt-4 inline-flex items-center gap-2 text-success-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Accéder <span>→</span>
            </div>
          </button>

          <!-- Subcontractor -->
          <button (click)="selectRole('subcontractor')"
            class="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 18h.01M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Sous-traitant</h2>
            <p class="text-sm text-gray-600">Tâches, matériel et communications</p>
            <div class="mt-4 inline-flex items-center gap-2 text-warning-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Accéder <span>→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class RoleSelectionComponent {
  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  selectRole(role: 'owner' | 'manager' | 'subcontractor'): void {
    this.roleService.setRole(role);
    this.router.navigate([`/${role}`]);
  }
}
