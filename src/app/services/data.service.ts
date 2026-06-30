import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  sku: string;
  currentVersion: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStock: number;
  location: string;
  expiryDate: string | null;
  image: string;
  description: string;
  specifications: Record<string, string>;
  versions: ProductVersion[];
}

export interface ProductVersion {
  version: string;
  releaseDate: string;
  changes: string;
  active: boolean;
}

export interface BOM {
  id: string;
  productId: string;
  productName: string;
  version: string;
  name: string;
  description: string;
  totalCost: number;
  items: BOMItem[];
}

export interface BOMItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  level: number;
}

export interface Routing {
  id: string;
  productId: string;
  productName: string;
  version: string;
  name: string;
  description: string;
  estimatedTime: number;
  steps: RoutingStep[];
}

export interface RoutingStep {
  id: string;
  order: number;
  name: string;
  description: string;
  duration: number;
  status: 'pending' | 'in-progress' | 'done';
  workCenter: string;
  operator: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  projectId: string;
  projectName: string;
  productId: string;
  productName: string;
  version: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  dueDate: string;
  assignedTo: string;
  notes: string;
  bomId: string;
  progress: number;
  completedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierContact: string;
  status: 'draft' | 'approved' | 'ordered' | 'received' | 'cancelled';
  createdAt: string;
  expectedDelivery: string;
  actualDelivery?: string;
  items: POItem[];
  totalAmount: number;
  notes: string;
  createdBy: string;
  approvedBy: string | null;
  tracking: POTracking[];
}

export interface POItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface POTracking {
  status: string;
  date: string;
  user: string;
  notes: string;
  photo?: string;
}

export interface Transaction {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  reference: string;
  date: string;
  operator: string;
  location: string;
  notes: string;
  photo: string | null;
  batchNumber: string | null;
}

export interface Project {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  location: string;
  status: 'planning' | 'active' | 'urgent' | 'completed';
  startDate: string;
  endDate: string;
  manager: string;
  budget: number;
  spent: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  sites?: Site[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  criticalStockItems: number;
  recentTransactions: number;
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEYS = {
    products: 'hydrotrack_products',
    boms: 'hydrotrack_boms',
    routings: 'hydrotrack_routings',
    orders: 'hydrotrack_orders',
    purchaseOrders: 'hydrotrack_purchaseOrders',
    transactions: 'hydrotrack_transactions',
    projects: 'hydrotrack_projects'
  };

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private bomsSubject = new BehaviorSubject<BOM[]>([]);
  private routingsSubject = new BehaviorSubject<Routing[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private purchaseOrdersSubject = new BehaviorSubject<PurchaseOrder[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private projectsSubject = new BehaviorSubject<Project[]>([]);

  products$ = this.productsSubject.asObservable();
  boms$ = this.bomsSubject.asObservable();
  routings$ = this.routingsSubject.asObservable();
  orders$ = this.ordersSubject.asObservable();
  purchaseOrders$ = this.purchaseOrdersSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();
  projects$ = this.projectsSubject.asObservable();

  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {
    console.log('DataService constructor called');
  }

  private ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    if (!this.initPromise) {
      this.initPromise = this.loadAllData().then(() => {
        this.isInitialized = true;
        console.log('DataService initialized');
      }).catch(err => {
        console.error('DataService initialization error:', err);
        this.initPromise = null;
        return Promise.resolve();
      });
    }

    return this.initPromise;
  }

  private async loadAllData(): Promise<void> {
    const products = await this.loadFromStorageOrFetch<Product>(this.STORAGE_KEYS.products, 'assets/fake-data/products.json');
    const boms = await this.loadFromStorageOrFetch<BOM>(this.STORAGE_KEYS.boms, 'assets/fake-data/boms.json');
    const routings = await this.loadFromStorageOrFetch<Routing>(this.STORAGE_KEYS.routings, 'assets/fake-data/routings.json');
    const orders = await this.loadFromStorageOrFetch<Order>(this.STORAGE_KEYS.orders, 'assets/fake-data/orders.json');
    const purchaseOrders = await this.loadFromStorageOrFetch<PurchaseOrder>(this.STORAGE_KEYS.purchaseOrders, 'assets/fake-data/purchase-orders.json');
    const transactions = await this.loadFromStorageOrFetch<Transaction>(this.STORAGE_KEYS.transactions, 'assets/fake-data/transactions.json');
    const projects = await this.loadFromStorageOrFetch<Project>(this.STORAGE_KEYS.projects, 'assets/fake-data/projects.json');

    this.productsSubject.next(products);
    this.bomsSubject.next(boms);
    this.routingsSubject.next(routings);
    this.ordersSubject.next(orders);
    this.purchaseOrdersSubject.next(purchaseOrders);
    this.transactionsSubject.next(transactions);
    this.projectsSubject.next(projects);
  }

  private async loadFromStorageOrFetch<T>(storageKey: string, url: string): Promise<T[]> {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as T[];
    }

    try {
      const data = await this.http.get<T[]>(url).toPromise();
      if (data) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      return data || [];
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
      return [];
    }
  }

  private saveToStorage<T>(storageKey: string, data: T[]): void {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  // Products
  getProducts(): Observable<Product[]> {
    this.ensureInitialized();
    return of(this.productsSubject.value);
  }

  getProduct(id: string): Observable<Product | undefined> {
    this.ensureInitialized();
    return of(this.productsSubject.value.find(p => p.id === id));
  }

  getLowStockProducts(): Observable<Product[]> {
    this.ensureInitialized();
    return of(this.productsSubject.value.filter(p => p.stockQuantity <= p.minStock));
  }

  getExpiringProducts(days: number = 90): Observable<Product[]> {
    this.ensureInitialized();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);

    return of(this.productsSubject.value.filter(p => {
      if (!p.expiryDate) return false;
      const expiry = new Date(p.expiryDate);
      return expiry <= threshold;
    }));
  }

  updateProductStock(productId: string, quantity: number, type: 'in' | 'out'): Observable<Product | null> {
    this.ensureInitialized();
    const products = [...this.productsSubject.value];
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) return of(null);

    if (type === 'in') {
      products[index] = { ...products[index], stockQuantity: products[index].stockQuantity + quantity };
    } else {
      products[index] = { ...products[index], stockQuantity: Math.max(0, products[index].stockQuantity - quantity) };
    }

    this.productsSubject.next(products);
    this.saveToStorage(this.STORAGE_KEYS.products, products);
    return of(products[index]);
  }

  // BOMs
  getBOMs(): Observable<BOM[]> {
    this.ensureInitialized();
    return of(this.bomsSubject.value);
  }

  getBOMByProduct(productId: string, version?: string): Observable<BOM | undefined> {
    this.ensureInitialized();
    return of(this.bomsSubject.value.find(b => {
      if (version) {
        return b.productId === productId && b.version === version;
      }
      return b.productId === productId;
    }));
  }

  // Routings
  getRoutings(): Observable<Routing[]> {
    this.ensureInitialized();
    return of(this.routingsSubject.value);
  }

  getRoutingByProduct(productId: string, version?: string): Observable<Routing | undefined> {
    this.ensureInitialized();
    return of(this.routingsSubject.value.find(r => {
      if (version) {
        return r.productId === productId && r.version === version;
      }
      return r.productId === productId;
    }));
  }

  updateRoutingStepStatus(routingId: string, stepId: string, status: 'pending' | 'in-progress' | 'done'): Observable<Routing | null> {
    this.ensureInitialized();
    const routings = [...this.routingsSubject.value];
    const routingIndex = routings.findIndex(r => r.id === routingId);

    if (routingIndex === -1) return of(null);

    const steps = [...routings[routingIndex].steps];
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (stepIndex === -1) return of(null);

    steps[stepIndex] = { ...steps[stepIndex], status };
    routings[routingIndex] = { ...routings[routingIndex], steps };

    this.routingsSubject.next(routings);
    this.saveToStorage(this.STORAGE_KEYS.routings, routings);
    return of(routings[routingIndex]);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    this.ensureInitialized();
    return of(this.ordersSubject.value);
  }

  getOrder(id: string): Observable<Order | undefined> {
    this.ensureInitialized();
    return of(this.ordersSubject.value.find(o => o.id === id));
  }

  updateOrderProgress(orderId: string, progress: number, completedQuantity: number): Observable<Order | null> {
    this.ensureInitialized();
    const orders = [...this.ordersSubject.value];
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) return of(null);

    orders[index] = {
      ...orders[index],
      progress,
      completedQuantity,
      status: progress === 100 ? 'done' : progress > 0 ? 'in-progress' : 'pending'
    };

    this.ordersSubject.next(orders);
    this.saveToStorage(this.STORAGE_KEYS.orders, orders);
    return of(orders[index]);
  }

  // Purchase Orders
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    this.ensureInitialized();
    return of(this.purchaseOrdersSubject.value);
  }

  getPurchaseOrder(id: string): Observable<PurchaseOrder | undefined> {
    this.ensureInitialized();
    return of(this.purchaseOrdersSubject.value.find(po => po.id === id));
  }

  updatePurchaseOrderStatus(poId: string, status: PurchaseOrder['status'], user: string, notes: string): Observable<PurchaseOrder | null> {
    this.ensureInitialized();
    const purchaseOrders = [...this.purchaseOrdersSubject.value];
    const index = purchaseOrders.findIndex(po => po.id === poId);

    if (index === -1) return of(null);

    const trackingEntry = {
      status,
      date: new Date().toISOString(),
      user,
      notes
    };

    purchaseOrders[index] = {
      ...purchaseOrders[index],
      status,
      tracking: [...purchaseOrders[index].tracking, trackingEntry],
      approvedBy: status === 'approved' ? user : purchaseOrders[index].approvedBy
    };

    this.purchaseOrdersSubject.next(purchaseOrders);
    this.saveToStorage(this.STORAGE_KEYS.purchaseOrders, purchaseOrders);
    return of(purchaseOrders[index]);
  }

  // Transactions
  getTransactions(): Observable<Transaction[]> {
    this.ensureInitialized();
    return of(this.transactionsSubject.value);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Observable<Transaction> {
    this.ensureInitialized();
    const transactions = [...this.transactionsSubject.value];
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans-${Date.now()}`,
      date: new Date().toISOString()
    };

    transactions.unshift(newTransaction);
    this.transactionsSubject.next(transactions);
    this.saveToStorage(this.STORAGE_KEYS.transactions, transactions);

    // Update product stock
    if (transaction.type === 'in') {
      this.updateProductStock(transaction.productId, transaction.quantity, 'in');
    } else if (transaction.type === 'out') {
      this.updateProductStock(transaction.productId, transaction.quantity, 'out');
    }

    return of(newTransaction);
  }

  // Projects
  getProjects(): Observable<Project[]> {
    this.ensureInitialized();
    return of(this.projectsSubject.value);
  }

  getProject(id: string): Observable<Project | undefined> {
    this.ensureInitialized();
    return of(this.projectsSubject.value.find(p => p.id === id));
  }

  // Dashboard Stats
  getDashboardStats(): Observable<{
    totalStockValue: number;
    lowStockItems: number;
    expiringItems: number;
    pendingPOs: number;
    activeOrders: number;
    recentTransactions: Transaction[];
  }> {
    this.ensureInitialized();
    const products = this.productsSubject.value;
    const lowStock = products.filter(p => p.stockQuantity <= p.minStock).length;
    const expiring = products.filter(p => {
      if (!p.expiryDate) return false;
      const expiry = new Date(p.expiryDate);
      const threshold = new Date();
      threshold.setDate(threshold.getDate() + 90);
      return expiry <= threshold;
    }).length;

    const totalValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.unitPrice), 0);
    const pendingPOs = this.purchaseOrdersSubject.value.filter(po => po.status === 'draft' || po.status === 'approved').length;
    const activeOrders = this.ordersSubject.value.filter(o => o.status === 'in-progress').length;
    const recentTransactions = this.transactionsSubject.value.slice(0, 10);

    return of({
      totalStockValue: totalValue,
      lowStockItems: lowStock,
      expiringItems: expiring,
      pendingPOs,
      activeOrders,
      recentTransactions
    });
  }

  // Reset data to initial state
  resetData(): Observable<void> {
    this.isInitialized = false;
    this.initPromise = null;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return from(this.loadAllData().then(() => undefined));
  }
}
