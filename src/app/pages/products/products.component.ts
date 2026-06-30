import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService, Product } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  searchQuery = signal('');
  selectedCategory = signal('all');
  categories = [
    { value: 'all', label: 'Tous', labelAr: 'الكل' },
    { value: 'hose', label: 'Tuyaux', labelAr: 'خراطيم' },
    { value: 'fitting', label: 'Raccords', labelAr: 'وصلات' },
    { value: 'pump', label: 'Pompes', labelAr: 'مضخات' },
    { value: 'seal', label: 'Joints', labelAr: 'حلقات' },
    { value: 'oil', label: 'Huiles', labelAr: 'زيوت' },
    { value: 'cylinder', label: 'Cylindres', labelAr: 'مكابس' },
    { value: 'valve', label: 'Vannes', labelAr: 'صمامات' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products.set(products);
      this.filterProducts();
    });
  }

  filterProducts(): void {
    let filtered = this.products();

    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.nameAr.includes(query)
      );
    }

    this.filteredProducts.set(filtered);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.filterProducts();
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
    this.filterProducts();
  }

  getStockStatus(product: Product): { label: string; color: string; percentage: number } {
    const percentage = (product.stockQuantity / product.minStock) * 100;

    if (product.stockQuantity === 0) {
      return { label: 'Rupture', color: 'danger', percentage: 0 };
    } else if (product.stockQuantity <= product.minStock) {
      return { label: 'Critique', color: 'danger', percentage };
    } else if (product.stockQuantity <= product.minStock * 1.5) {
      return { label: 'Faible', color: 'warning', percentage };
    } else {
      return { label: 'OK', color: 'success', percentage };
    }
  }

  getStockPercentage(product: Product): number {
    return Math.min((product.stockQuantity / product.minStock) * 100, 100);
  }

  getExpiryStatus(product: Product): string | null {
    if (!product.expiryDate) return null;

    const expiry = new Date(product.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return 'Expiré';
    } else if (daysUntilExpiry <= 90) {
      return `Expire dans ${daysUntilExpiry} jours`;
    }
    return null;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3
    }).format(value);
  }
}
