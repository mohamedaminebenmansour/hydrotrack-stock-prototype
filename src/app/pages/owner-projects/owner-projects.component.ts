import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Project } from '../../services/data.service';

@Component({
  selector: 'app-owner-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📋 Tous les Projets</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de tous vos projets</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (project of projects(); track project.id) {
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 dark:border-gray-700">
          <!-- 3D Cube Effect -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl transform rotate-12 shadow-lg opacity-70"></div>
          <div class="absolute top-7 right-7 w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl transform rotate-12 shadow-md"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ project.name }}</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {{ project.location }}</p>
              </div>
              <span class="px-4 py-2 text-sm font-bold rounded-full {{ getStatusColor(project.status) }}">
                {{ getStatusLabel(project.status) }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p class="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(project.budget) }}</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <p class="text-xs text-gray-500 dark:text-gray-400">Dépensé</p>
                <p class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(project.spent) }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span>Progression</span>
              <span class="font-bold text-primary-600">{{ project.progress }}%</span>
            </div>
            <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
              <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all"
                [style.width.%]="project.progress"></div>
            </div>

            @if (project.sites && project.sites.length > 0) {
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sites ({{ project.sites.length }})</p>
              <div class="space-y-2">
                @for (site of project.sites.slice(0, 3); track site.id) {
                <div class="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-primary-500"></div>
                    <span class="text-gray-900 dark:text-white font-medium">{{ site.name }}</span>
                  </div>
                  <span class="text-gray-600 dark:text-gray-400">{{ site.location }}</span>
                </div>
                }
                @if (project.sites.length > 3) {
                <p class="text-xs text-center text-gray-500 dark:text-gray-400">+{{ project.sites.length - 3 }} autres sites</p>
                }
              </div>
            </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class OwnerProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'planning': return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'urgent': return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'planning': return 'Planification';
      case 'urgent': return 'Urgent';
      case 'completed': return 'Terminé';
      default: return status;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 3 }).format(value);
  }
}
