import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Project } from '../../services/data.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-stock-by-project',
  standalone: true,
    imports: [CommonModule, RouterModule],


  templateUrl: './stock-by-project.component.html',
  styleUrl: './stock-by-project.component.scss'
})
export class StockByProjectComponent implements OnInit {
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  selectedSite = signal<any | null>(null);

  constructor(private dataService: DataService) {
    console.log('=== [Stock by Project Component] Loaded ===');
  }

  ngOnInit(): void {
    this.loadProjects();
  }

    private loadProjects(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  getTotalItems(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.totalItems || 0), 0) || 0;
  }

  getTotalValue(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.totalValue || 0), 0) || 0;
  }

  selectProject(project: Project): void {

    this.selectedProject.set(project);
    this.selectedSite.set(null);
  }

  selectSite(site: any): void {
    this.selectedSite.set(site);
  }

  backToProjects(): void {
    this.selectedProject.set(null);
    this.selectedSite.set(null);
  }

  backToSites(): void {
    this.selectedSite.set(null);
  }

  getStockStatus(project: Project): 'good' | 'warning' | 'critical' {
    const totalLow = project.sites?.reduce((sum, site) => sum + (site.lowStockItems || 0), 0) || 0;
    const totalCritical = project.sites?.reduce((sum, site) => sum + (site.criticalStockItems || 0), 0) || 0;

    if (totalCritical > 0) return 'critical';
    if (totalLow > 5) return 'warning';
    return 'good';
  }

  getSiteStockStatus(site: any): 'good' | 'warning' | 'critical' {
    if (site.criticalStockItems > 0) return 'critical';
    if (site.lowStockItems > 2) return 'warning';
    return 'good';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-danger-500';
      case 'warning':
        return 'bg-warning-500';
      case 'good':
        return 'bg-success-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-danger-100 dark:bg-danger-900 border-danger-300 dark:border-danger-700';
      case 'warning':
        return 'bg-warning-100 dark:bg-warning-900 border-warning-300 dark:border-warning-700';
      case 'good':
        return 'bg-success-100 dark:bg-success-900 border-success-300 dark:border-success-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-TN').format(value);
  }
}
