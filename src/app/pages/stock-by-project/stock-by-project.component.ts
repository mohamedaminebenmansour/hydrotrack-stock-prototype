import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Project, Transaction, Product } from '../../services/data.service';

@Component({
  selector: 'app-stock-by-project',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stock-by-project.component.html',
  styleUrl: './stock-by-project.component.scss'
})
export class StockByProjectComponent implements OnInit {
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  selectedSite = signal<any | null>(null);
  allTransactions = signal<Transaction[]>([]);
  allProducts = signal<Product[]>([]);
  editingStock = signal<{ siteId: string; quantity: number } | null>(null);
  selectedDetailView = signal<string | null>(null);

  constructor(private dataService: DataService) {
    console.log('=== [Stock by Project Component] Loaded ===');
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadTransactions();
    this.loadProducts();
  }

  private loadProjects(): void {
    this.dataService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });
  }

  private loadTransactions(): void {
    this.dataService.getTransactions().subscribe(transactions => {
      this.allTransactions.set(transactions);
    });
  }

  private loadProducts(): void {
    this.dataService.getProducts().subscribe(products => {
      this.allProducts.set(products);
    });
  }

  getTotalItems(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.totalItems || 0), 0) || 0;
  }

  getTotalValue(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.totalValue || 0), 0) || 0;
  }

  getTotalLowStock(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.lowStockItems || 0), 0) || 0;
  }

  getTotalCriticalStock(project: Project): number {
    return project.sites?.reduce((sum, s) => sum + (s.criticalStockItems || 0), 0) || 0;
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
    const totalCritical = this.getTotalCriticalStock(project);
    const totalLow = this.getTotalLowStock(project);

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
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'good':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getStatusBgColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'good':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  getSiteTransactions(siteId: string): Transaction[] {
    return this.allTransactions()
      .filter(t => t.location.includes(this.getSiteName(siteId)) ||
                   t.notes.toLowerCase().includes(this.getSiteName(siteId).toLowerCase()))
      .slice(0, 10);
  }

  private getSiteName(siteId: string): string {
    const project = this.selectedProject();
    if (!project?.sites) return '';
    const site = project.sites.find(s => s.id === siteId);
    return site?.name || '';
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
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'out':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    }
  }

  getTransactionLabel(type: string): string {
    switch (type) {
      case 'in':
        return 'Entrée';
      case 'out':
        return 'Sortie';
      default:
        return 'Ajustement';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-TN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  startEditStock(site: any): void {
    this.editingStock.set({ siteId: site.id, quantity: site.totalItems });
  }

  saveStockEdit(): void {
    const edit = this.editingStock();
    if (!edit) return;

    const project = this.selectedProject();
    if (project?.sites) {
      const siteIndex = project.sites.findIndex(s => s.id === edit.siteId);
      if (siteIndex !== -1) {
        project.sites[siteIndex].totalItems = edit.quantity;
        this.selectedProject.set({ ...project });
        this.projects.set([...this.projects()]);
      }
    }
    this.editingStock.set(null);
  }

  cancelEditStock(): void {
    this.editingStock.set(null);
  }

  isEditingStock(siteId: string): boolean {
    return this.editingStock()?.siteId === siteId;
  }

  showDetailView(view: string): void {
    this.selectedDetailView.set(view);
  }

  hideDetailView(): void {
    this.selectedDetailView.set(null);
  }

  isDetailViewActive(view: string): boolean {
    return this.selectedDetailView() === view;
  }

  getProductsForSite(siteName: string): Product[] {
    return this.allProducts().filter(p =>
      p.location.toLowerCase().includes(siteName.toLowerCase()) ||
      siteName.toLowerCase().includes(p.location.toLowerCase())
    );
  }

  getLowStockProducts(siteName: string): Product[] {
    return this.getProductsForSite(siteName).filter(p =>
      p.stockQuantity <= p.minStock && p.stockQuantity > 0
    );
  }

  getCriticalStockProducts(siteName: string): Product[] {
    return this.getProductsForSite(siteName).filter(p =>
      p.stockQuantity === 0 || p.stockQuantity < p.minStock * 0.5
    );
  }

  getProductStatus(product: Product): 'good' | 'warning' | 'critical' {
    if (product.stockQuantity === 0) return 'critical';
    if (product.stockQuantity <= product.minStock) return 'warning';
    return 'good';
  }

  getProductStatusColor(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'good':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  }

  getProductStatusBadge(status: string): string {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  getProductStatusText(status: string): string {
    switch (status) {
      case 'critical':
        return 'Critique';
      case 'warning':
        return 'Faible';
      case 'good':
        return 'Bon';
      default:
        return 'Inconnu';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'hose':
        return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
      case 'fitting':
        return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
      case 'pump':
        return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
      case 'seal':
        return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
      case 'oil':
        return 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
      case 'cylinder':
        return 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z';
      case 'valve':
        return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
      default:
        return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
    }
  }

  getCategoryName(category: string): string {
    const categories: { [key: string]: string } = {
      'hose': 'Tuyaux',
      'fitting': 'Raccords',
      'pump': 'Pompes',
      'seal': 'Joints',
      'oil': 'Huiles',
      'cylinder': 'Cylindres',
      'valve': 'Vannes'
    };
    return categories[category] || category;
  }

  getCategoryBreakdown(siteName: string): any[] {
    const products = this.getProductsForSite(siteName);
    const categories: { [key: string]: { count: number; value: number; name: string } } = {};

    products.forEach(product => {
      const cat = product.category;
      if (!categories[cat]) {
        categories[cat] = { count: 0, value: 0, name: this.getCategoryName(cat) };
      }
      categories[cat].count += product.stockQuantity;
      categories[cat].value += product.stockQuantity * product.unitPrice;
    });

    return Object.values(categories);
  }
}
