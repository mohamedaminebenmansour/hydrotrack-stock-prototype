import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Project, Order, Transaction } from '../../services/data.service';

@Component({
  selector: 'app-subcontractor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subcontractor.component.html',
  styleUrl: './subcontractor.component.scss'
})
export class SubcontractorComponent implements OnInit {
  subcontractorName = signal('Mohamed Ben Ali');
  subcontractorScore = signal(87);
  currentSites = signal<any[]>([]);
  pendingPayments = signal(1250);
  workProgress = signal<Order[]>([]);
  recentActivity = signal<Transaction[]>([]);
  usefulContacts = signal<any[]>([
    { name: 'Ahmed Ben Ali', role: 'Chef de Projet', phone: '+216 71 234 567', email: 'ahmed@hydrotrack.tn' },
    { name: 'Ali Bouzid', role: 'Responsable Stock', phone: '+216 72 345 678', email: 'ali@hydrotrack.tn' },
    { name: 'Service Achats', role: 'Commandes', phone: '+216 71 456 789', email: 'achats@hydrotrack.tn' }
  ]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadSubcontractorData();
  }

  private loadSubcontractorData(): void {
    this.dataService.getProjects().subscribe(projects => {
      const sites = projects.flatMap(p =>
        (p.sites || []).map(site => ({
          ...site,
          projectName: p.name,
          projectId: p.id
        }))
      ).slice(0, 3);
      this.currentSites.set(sites);
    });

    this.dataService.getOrders().subscribe(orders => {
      const activeOrders = orders
        .filter(o => o.status === 'in-progress')
        .slice(0, 5);
      this.workProgress.set(activeOrders);
    });

    this.dataService.getTransactions().subscribe(transactions => {
      this.recentActivity.set(transactions.slice(0, 6));
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-TN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  }

  getScoreBgColor(score: number): string {
    if (score >= 80) return 'bg-success-100 dark:bg-success-900';
    if (score >= 60) return 'bg-warning-100 dark:bg-warning-900';
    return 'bg-danger-100 dark:bg-danger-900';
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'in':
        return 'M7 11l5-5m0 0l5 5m-5-5v12';
      case 'out':
        return 'M17 13l-5 5m0 0l-5-5m5 5V6';
      default:
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'in':
        return 'text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900';
      case 'out':
        return 'text-danger-600 dark:text-danger-400 bg-danger-100 dark:bg-danger-900';
      default:
        return 'text-warning-600 dark:text-warning-400 bg-warning-100 dark:bg-warning-900';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'high':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100';
      case 'medium':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'low':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Élevé';
      case 'medium':
        return 'Moyen';
      case 'low':
        return 'Bas';
      default:
        return priority;
    }
  }

  generateReport(): void {
    alert('Génération du rapport en cours...\n\nLe rapport sera envoyé à: mohamed.benali@email.tn');
  }

  requestMaterial(): void {
    alert('Formulaire de demande de matériel\n\nCette fonctionnalité sera disponible prochainement.');
  }
}
