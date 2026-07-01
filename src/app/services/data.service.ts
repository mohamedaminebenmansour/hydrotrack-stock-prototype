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

// ========== NEW CROSS-ROLE MODELS ==========

export interface Subcontractor {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  rating: number;
  currentSite: string;
  status: 'available' | 'busy' | 'completed';
}

export interface MaterialRequest {
  id: string;
  subcontractorName: string;
  siteId: string;
  siteName: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  createdAt: string;
  resolvedAt?: string;
  notes: string;
}

export interface MaterialConsumption {
  id: string;
  requestId: string;
  subcontractorName: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  date: string;
  siteName: string;
  photoUrl: string;
  notes: string;
}

export interface MaterialReturn {
  id: string;
  subcontractorName: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  date: string;
  siteName: string;
  notes: string;
}

// ========== DEFAULT FAKE SUBCONTRACTORS ==========
const DEFAULT_SUBCONTRACTORS: Subcontractor[] = [
  { id: 'sub-001', name: 'Ahmed Hydraulique', phone: '+216 98 123 456', specialty: 'Installation tuyauterie haute pression et raccords', rating: 5, currentSite: 'Site Kairouan', status: 'busy' },
  { id: 'sub-002', name: 'Karim Soudure', phone: '+216 20 234 567', specialty: 'Soudure TIG/MIG et fabrication métallique', rating: 4, currentSite: 'Site Sfax', status: 'busy' },
  { id: 'sub-003', name: 'Mohamed Ben Ali', phone: '+216 22 345 678', specialty: 'Maintenance hydraulique et dépannage', rating: 4, currentSite: 'Site Tunis', status: 'busy' },
  { id: 'sub-004', name: 'Société Générale TP', phone: '+216 71 456 789', specialty: 'Travaux publics et génie civil', rating: 4, currentSite: 'Site Sousse', status: 'available' },
];

const DEFAULT_CONTACTS = [
  // Drivers (Chauffeurs)
  { name: 'Hassen Hamdi', role: 'Chauffeur Poids Lourd', category: 'Chauffeurs', rating: 5, phone: '+216 50 123 456', distance: '5 km du site Kairouan' },
  { name: 'Montassar Gharbi', role: 'Chauffeur Livraison', category: 'Chauffeurs', rating: 4, phone: '+216 52 234 567', distance: '8 km du site Sfax' },
  { name: 'Wassim Ben Ammar', role: 'Chauffeur Benne', category: 'Chauffeurs', rating: 4, phone: '+216 54 345 678', distance: '3 km du site Tunis' },
  // Welders (Soudeurs)
  { name: 'Karim Soudure', role: 'Soudeur Industriel', category: 'Soudeurs', rating: 5, phone: '+216 98 456 789', distance: '2 km du site Kairouan' },
  { name: 'Houssem Dridi', role: 'Soudeur TIG/MIG', category: 'Soudeurs', rating: 4, phone: '+216 20 567 890', distance: '10 km du site Sfax' },
  { name: 'Kamel Mechergui', role: 'Soudeur Haute Pression', category: 'Soudeurs', rating: 5, phone: '+216 22 678 901', distance: '6 km du site Tunis' },
  // Mechanics
  { name: 'Mehdi Trabelsi', role: 'Mécanicien Hydraulique', category: 'Mécaniciens', rating: 5, phone: '+216 23 789 012', distance: '4 km du site Kairouan' },
  { name: 'Youssef Kacem', role: 'Mécanicien Diesel', category: 'Mécaniciens', rating: 4, phone: '+216 25 890 123', distance: '7 km du site Sfax' },
  { name: 'Skander Belaid', role: 'Mécanicien Engins TP', category: 'Mécaniciens', rating: 4, phone: '+216 27 901 234', distance: '12 km du site Tunis' },
  // Suppliers
  { name: 'HydraParts Tunisie', role: 'Fournisseur Pièces Hydrauliques', category: 'Fournisseurs', rating: 4, phone: '+216 71 012 345', distance: '15 km du site Kairouan' },
  { name: 'Aciers & Métaux TN', role: 'Fournisseur Acier et Tôles', category: 'Fournisseurs', rating: 3, phone: '+216 72 123 456', distance: '20 km du site Sfax' },
  { name: 'Pompes & Moteurs Sfax', role: 'Fournisseur Pompes et Moteurs', category: 'Fournisseurs', rating: 5, phone: '+216 74 234 567', distance: '1 km du site Sfax' },
];


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
    projects: 'hydrotrack_projects',
    subcontractors: 'hydrotrack_subcontractors',
    materialRequests: 'hydrotrack_materialRequests',
    materialConsumptions: 'hydrotrack_materialConsumptions',
    materialReturns: 'hydrotrack_materialReturns'
  };

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private bomsSubject = new BehaviorSubject<BOM[]>([]);
  private routingsSubject = new BehaviorSubject<Routing[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private purchaseOrdersSubject = new BehaviorSubject<PurchaseOrder[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private subcontractorsSubject = new BehaviorSubject<Subcontractor[]>([]);
  private materialRequestsSubject = new BehaviorSubject<MaterialRequest[]>([]);
  private materialConsumptionsSubject = new BehaviorSubject<MaterialConsumption[]>([]);
  private materialReturnsSubject = new BehaviorSubject<MaterialReturn[]>([]);

  products$ = this.productsSubject.asObservable();
  boms$ = this.bomsSubject.asObservable();
  routings$ = this.routingsSubject.asObservable();
  orders$ = this.ordersSubject.asObservable();
  purchaseOrders$ = this.purchaseOrdersSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();
  projects$ = this.projectsSubject.asObservable();
  subcontractors$ = this.subcontractorsSubject.asObservable();
  materialRequests$ = this.materialRequestsSubject.asObservable();
  materialConsumptions$ = this.materialConsumptionsSubject.asObservable();
  materialReturns$ = this.materialReturnsSubject.asObservable();

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

    // Initialize cross-role data with defaults if not in localStorage
    this.subcontractorsSubject.next(await this.loadOrInit(this.STORAGE_KEYS.subcontractors, DEFAULT_SUBCONTRACTORS));
    this.materialRequestsSubject.next(await this.loadOrInit(this.STORAGE_KEYS.materialRequests, []));
    this.materialConsumptionsSubject.next(await this.loadOrInit(this.STORAGE_KEYS.materialConsumptions, []));
    this.materialReturnsSubject.next(await this.loadOrInit(this.STORAGE_KEYS.materialReturns, []));
  }

  private async loadOrInit<T>(key: string, defaultData: T[]): Promise<T[]> {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T[];
    }
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
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

  // ========== CROSS-ROLE METHODS ==========

  // Subcontractors
  getSubcontractors(): Observable<Subcontractor[]> {
    this.ensureInitialized();
    return of(this.subcontractorsSubject.value);
  }

  getSubcontractor(name: string): Subcontractor | undefined {
    return this.subcontractorsSubject.value.find(s => s.name === name);
  }

  // Material Requests
  getMaterialRequests(): Observable<MaterialRequest[]> {
    this.ensureInitialized();
    return of(this.materialRequestsSubject.value);
  }

  getPendingRequests(): MaterialRequest[] {
    return this.materialRequestsSubject.value.filter(r => r.status === 'pending');
  }

  addMaterialRequest(req: Omit<MaterialRequest, 'id' | 'createdAt' | 'status'>): Observable<MaterialRequest> {
    this.ensureInitialized();
    const requests = [...this.materialRequestsSubject.value];
    const newRequest: MaterialRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    requests.unshift(newRequest);
    this.materialRequestsSubject.next(requests);
    this.saveToStorage(this.STORAGE_KEYS.materialRequests, requests);

    // Log transaction
    this.addTransaction({
      type: 'out',
      productId: req.productId,
      productName: req.productName,
      quantity: req.quantity,
      unit: req.unit,
      reference: `REQ-${newRequest.id}`,
      operator: req.subcontractorName,
      location: req.siteName,
      notes: `Demande matériel - ${req.subcontractorName}`,
      photo: null,
      batchNumber: null
    });

    return of(newRequest);
  }

  approveRequest(requestId: string): Observable<MaterialRequest | null> {
    const requests = [...this.materialRequestsSubject.value];
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return of(null);

    requests[index] = { ...requests[index], status: 'approved', resolvedAt: new Date().toISOString() };
    this.materialRequestsSubject.next(requests);
    this.saveToStorage(this.STORAGE_KEYS.materialRequests, requests);
    return of(requests[index]);
  }

  rejectRequest(requestId: string): Observable<MaterialRequest | null> {
    const requests = [...this.materialRequestsSubject.value];
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return of(null);

    requests[index] = { ...requests[index], status: 'rejected', resolvedAt: new Date().toISOString() };
    this.materialRequestsSubject.next(requests);
    this.saveToStorage(this.STORAGE_KEYS.materialRequests, requests);
    return of(requests[index]);
  }

  // Material Consumptions
  getMaterialConsumptions(): Observable<MaterialConsumption[]> {
    this.ensureInitialized();
    return of(this.materialConsumptionsSubject.value);
  }

  getConsumptionsBySubcontractor(name: string): MaterialConsumption[] {
    return this.materialConsumptionsSubject.value.filter(c => c.subcontractorName === name);
  }

  reportConsumption(consumption: Omit<MaterialConsumption, 'id' | 'date'>): Observable<MaterialConsumption> {
    this.ensureInitialized();
    const consumptions = [...this.materialConsumptionsSubject.value];
    const newConsumption: MaterialConsumption = {
      ...consumption,
      id: `cons-${Date.now()}`,
      date: new Date().toISOString()
    };
    consumptions.unshift(newConsumption);
    this.materialConsumptionsSubject.next(consumptions);
    this.saveToStorage(this.STORAGE_KEYS.materialConsumptions, consumptions);

    // Update product stock - decrease
    this.updateProductStock(consumption.productId, consumption.quantity, 'out');

    // Log transaction
    this.addTransaction({
      type: 'out',
      productId: consumption.productId,
      productName: consumption.productName,
      quantity: consumption.quantity,
      unit: consumption.unit,
      reference: `CONS-${newConsumption.id}`,
      operator: consumption.subcontractorName,
      location: consumption.siteName,
      notes: `Consommation - ${consumption.subcontractorName}: ${consumption.notes}`,
      photo: consumption.photoUrl || null,
      batchNumber: null
    });

    return of(newConsumption);
  }

  // Material Returns
  getMaterialReturns(): Observable<MaterialReturn[]> {
    this.ensureInitialized();
    return of(this.materialReturnsSubject.value);
  }

  getReturnsBySubcontractor(name: string): MaterialReturn[] {
    return this.materialReturnsSubject.value.filter(r => r.subcontractorName === name);
  }

  returnMaterial(ret: Omit<MaterialReturn, 'id' | 'date'>): Observable<MaterialReturn> {
    this.ensureInitialized();
    const returns = [...this.materialReturnsSubject.value];
    const newReturn: MaterialReturn = {
      ...ret,
      id: `ret-${Date.now()}`,
      date: new Date().toISOString()
    };
    returns.unshift(newReturn);
    this.materialReturnsSubject.next(returns);
    this.saveToStorage(this.STORAGE_KEYS.materialReturns, returns);

    // Update product stock - increase
    this.updateProductStock(ret.productId, ret.quantity, 'in');

    // Log transaction
    this.addTransaction({
      type: 'in',
      productId: ret.productId,
      productName: ret.productName,
      quantity: ret.quantity,
      unit: ret.unit,
      reference: `RET-${newReturn.id}`,
      operator: ret.subcontractorName,
      location: ret.siteName,
      notes: `Retour matériel - ${ret.subcontractorName}: ${ret.notes}`,
      photo: null,
      batchNumber: null
    });

    return of(newReturn);
  }

  // Dashboard Stats (enhanced with cross-role data)
  getDashboardStats(): Observable<{
    totalStockValue: number;
    lowStockItems: number;
    expiringItems: number;
    pendingPOs: number;
    activeOrders: number;
    pendingRequests: number;
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
    const pendingRequests = this.materialRequestsSubject.value.filter(r => r.status === 'pending').length;
    const recentTransactions = this.transactionsSubject.value.slice(0, 10);

    return of({
      totalStockValue: totalValue,
      lowStockItems: lowStock,
      expiringItems: expiring,
      pendingPOs,
      activeOrders,
      pendingRequests,
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
