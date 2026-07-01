import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Project } from '../../services/data.service';

@Component({
  selector: 'app-manager-sites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📍 Sites</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gestion des sites par projet</p>
      </div>

      @for (project of projects(); track project.id) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ project.name }}</h2>
          <span class="px-3 py-1 text-sm font-bold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
            {{ project.sites?.length || 0 }} sites
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (site of project.sites; track site.id) {
          <div class="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-success-500 transition-all cursor-pointer">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ site.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">📍 {{ site.location }}</p>
              </div>
              <div class="w-3 h-3 rounded-full {{ getSiteIndicator(site) }}"></div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ site.totalItems }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Articles</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <p class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(site.totalValue) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Valeur</p>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="flex items-center gap-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg p-2">
                <div class="w-3 h-3 rounded-full bg-warning-500"></div>
                <div>
                  <p class="text-xs font-bold text-warning-700 dark:text-warning-300">{{ site.lowStockItems }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Faible</p>
                </div>
              </div>
              <div class="flex items-center gap-2 bg-danger-50 dark:bg-danger-900/20 rounded-lg p-2">
                <div class="w-3 h-3 rounded-full bg-danger-500"></div>
                <div>
                  <p class="text-xs font-bold text-danger-700 dark:text-danger-300">{{ site.criticalStockItems }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Critique</p>
                </div>
              </div>
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
export class ManagerSitesComponent implements OnInit {
  projects = signal<Project[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  getSiteIndicator(site: any): string {
    if (site.criticalStockItems > 0) return 'bg-danger-500';
    if (site.lowStockItems > 2) return 'bg-warning-500';
    return 'bg-success-500';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(value);
  }
}
