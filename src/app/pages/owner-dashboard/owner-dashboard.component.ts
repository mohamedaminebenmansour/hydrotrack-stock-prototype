import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Project, Transaction, MaterialRequest, MaterialConsumption, MaterialReturn, Subcontractor } from '../../services/data.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.scss'
})
export class OwnerDashboardComponent implements OnInit {
  totalProjects = signal(0);
  totalStockValue = signal(0);
  lowStockCount = signal(0);
  criticalStockCount = signal(0);
  pendingPayments = signal(0);
  recentActivity = signal<Transaction[]>([]);
  projects = signal<Project[]>([]);
  pendingRequests = signal<MaterialRequest[]>([]);
  allRequests = signal<MaterialRequest[]>([]);
  allConsumptions = signal<MaterialConsumption[]>([]);
  allReturns = signal<MaterialReturn[]>([]);
  subcontractors = signal<Subcontractor[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.projects.set(projects);
      this.totalProjects.set(projects.length);
    });

    this.dataService.getProducts().subscribe(products => {
      const totalValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.unitPrice), 0);
      this.totalStockValue.set(totalValue);
      const lowStock = products.filter(p => p.stockQuantity <= p.minStock && p.stockQuantity > 0).length;
      this.lowStockCount.set(lowStock);
      const criticalStock = products.filter(p => p.stockQuantity === 0).length;
      this.criticalStockCount.set(criticalStock);
    });

    this.dataService.getPurchaseOrders().subscribe(pos => {
      const pending = pos
        .filter(po => po.status === 'draft' || po.status === 'approved')
        .reduce((sum, po) => sum + po.totalAmount, 0);
      this.pendingPayments.set(pending);
    });

    this.dataService.getTransactions().subscribe(transactions => {
      this.recentActivity.set(transactions.slice(0, 8));
    });

    this.dataService.getMaterialRequests().subscribe(requests => {
      this.allRequests.set(requests);
      this.pendingRequests.set(requests.filter(r => r.status === 'pending'));
    });

    this.dataService.getMaterialConsumptions().subscribe(consumptions => {
      this.allConsumptions.set(consumptions);
    });

    this.dataService.getMaterialReturns().subscribe(returns => {
      this.allReturns.set(returns);
    });

    this.dataService.getSubcontractors().subscribe(subs => {
      this.subcontractors.set(subs);
    });
  }

  get totalConsumed(): number {
    return this.allConsumptions().reduce((s, c) => s + c.quantity, 0);
  }

  get totalReturned(): number {
    return this.allReturns().reduce((s, r) => s + r.quantity, 0);
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

  getProjectStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100';
      case 'planning': return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100';
      case 'urgent': return 'bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getProjectStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'planning': return 'Planification';
      case 'urgent': return 'Urgent';
      case 'completed': return 'Terminé';
      default: return status;
    }
  }
}
