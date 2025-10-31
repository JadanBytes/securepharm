

export enum Role {
  // Platform Roles
  SUPER_ADMIN = 'Super Admin',
  PLATFORM_SUPPORT = 'Platform Support',
  PLATFORM_BILLING = 'Platform Billing',
  
  // Pharmacy Roles
  PHARMACY_ADMIN = 'Pharmacy Admin',
  SUB_ADMIN = 'Sub-Admin',
  MANAGER = 'Manager',
  CASHIER = 'Cashier',
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  pharmacyId?: string; // Only for pharmacy users
  branchName?: string;
  status: 'active' | 'suspended';
  pictureUrl?: string;
}

export enum SubscriptionPlan {
    BASIC = 'Basic',
    PRO = 'Pro',
    ENTERPRISE = 'Enterprise',
    TRIAL = 'Trial'
}

export interface SubscriptionPlanDetails {
  id: string;
  name: SubscriptionPlan;
  price: number;
  branchLimit: number;
  staffLimit: number;
  features: string[];
}

export interface SessionSettings {
  autoLogoutEnabled: boolean;
  autoLogoutMinutes: number;
}

export interface Pharmacy {
    id:string;
    parentId?: string;
    name: string;
    logo?: string;
    contact: string;
    address: string;
    country: string;
    currency: string;
    subscriptionPlan: SubscriptionPlan;
    trialExpiry: string; // ISO date string
    status: 'active' | 'suspended' | 'expired_trial';
    sessionSettings?: SessionSettings;
    pendingChanges?: Partial<Omit<Pharmacy, 'id'>>; // To store pending updates
    updateStatus?: 'pending_approval' | 'approved' | 'rejected'; // Status of the update request
    updateRequestedAt?: string; // ISO string when the last update was requested
    rejectionReason?: string; // Reason for update rejection
}

export interface Medicine {
    id: string;
    pharmacyId: string;
    branchName: string;
    name: string;
    supplierId?: string;
    description?: string;
    unit: string;
    category: string;
    type: string;
    stockQuantity: number;
    lowStockThreshold?: number;
    costPrice: number;
    sellingPrice: number;
    expiryDate: string; // ISO date string
    createdAt: string; // ISO date string
}

export interface SaleItem {
    medicineId: string;
    medicineName: string;
    medicineCategory: string;
    medicineUnit: string;
    medicineType: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
}

export enum SaleStatus {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    REFUNDED = 'Refunded',
    HELD = 'Held'
}

export enum PaymentMethod {
    CASH = 'Cash',
    TRANSFER = 'Transfer',
    CARD = 'Card',
    CREDIT = 'Credit',
    PRESCRIPTION = 'Prescription'
}

export interface Payment {
    method: PaymentMethod;
    amount: number;
}

export interface CreditPayment {
  id: string;
  date: string; // ISO string
  amount: number;
  method: PaymentMethod;
  staffId: string;
  staffName: string;
}

export interface Sale {
    id: string;
    pharmacyId: string;
    branchName: string;
    staffId: string;
    staffName: string;
    customerName: string;
    items: SaleItem[];
    totalAmount: number;
    payments: Payment[];
    creditPayments?: CreditPayment[];
    status: SaleStatus;
    createdAt: string; // ISO date string
}

export interface StockAdjustmentLog {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  medicineId: string;
  medicineName: string;
  staffId: string;
  staffName: string;
  type: 'Increase' | 'Decrease';
  quantity: number;
  reason: string;
  createdAt: string; // ISO date string
}

export enum PrescriptionStatus {
    ACTIVE = 'Active',
    DISPENSED = 'Dispensed', // Partially or fully dispensed but still has refills
    COMPLETED = 'Completed', // All refills used
    CANCELLED = 'Cancelled',
}

export interface PrescriptionItem {
    medicineId: string;
    medicineName: string;
    dosage: string;
    quantity: number;
}

export interface Prescription {
    id: string;
    pharmacyId: string;
    patientName: string;
    doctorName: string;
    prescriptionDate: string; // ISO date string
    items: PrescriptionItem[];
    refillsAllowed: number;
    refillsRemaining: number;
    status: PrescriptionStatus;
    notes?: string;
    createdAt: string; // ISO date string
}

export interface MedicineUnit {
    id: string;
    pharmacyId: string;
    name: string;
}

export interface MedicineCategory {
    id: string;
    pharmacyId: string;
    name: string;
}

export interface MedicineType {
    id: string;
    pharmacyId: string;
    name: string;
}

export interface Supplier {
    id: string;
    pharmacyId: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export enum ExpenseCategory {
    SUPPLIER_PAYMENT = 'Supplier Payment',
    SALARIES = 'Salaries',
    RENT = 'Rent',
    UTILITIES = 'Utilities',
    MARKETING = 'Marketing',
    OTHER = 'Other'
}

export interface Expense {
    id: string;
    pharmacyId: string;
    date: string; // ISO string
    category: ExpenseCategory;
    description: string;
    amount: number;
    paidTo?: string; // e.g., Supplier name
    staffId: string;
    staffName: string;
}

export enum PaymentStatus {
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    FAILED = 'Failed',
}

export interface PaymentTransaction {
    id: string;
    pharmacyId: string;
    pharmacyName: string;
    amount: number;
    currency: string;
    plan: SubscriptionPlan;
    transactionDate: string; // ISO string
    paymentMethod: string; // e.g., 'Paystack', 'Bank Transfer'
    status: PaymentStatus;
}

// --- Return Types ---
export interface ReturnItem {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number; // Price at the time of return
    total: number;
}

export interface Return {
    id: string;
    pharmacyId: string;
    staffId: string;
    staffName: string;
    originalSaleId?: string;
    customerName: string;
    items: ReturnItem[];
    reason: string;
    totalAmount: number;
    createdAt: string; // ISO date string
}


// --- Report Types ---
export interface SalesSummaryReport {
    profitData: { name: string; value: number }[];
    salesByStaff: { name: string; value: number }[];
    salesByPaymentMethod: { name: string; value: number }[];
}

export interface MedicineSalesReportItem {
    medicineId: string;
    medicineName: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
}

export interface InventoryLevelReportItem {
    id: string;
    name: string;
    stockQuantity: number;
    costPrice: number;
    sellingPrice: number;
    inventoryValue: number;
}

export interface DetailedSaleReportItem {
    saleId: string;
    pharmacyName: string;
    branchName: string;
    customerName: string;
    medicineName: string;
    medicineCategory: string;
    medicineUnit: string;
    medicineType: string;
    quantity: number;
    remainingQuantity: number;
    unitCostPrice: number;
    unitSalePrice: number;
    totalCostPrice: number;
    totalSalePrice: number;
    discount: number;
    profit: number;
    cashierName: string;
    paymentMethods: string;
    dateTime: string;
}

export interface StockHistoryReportItem {
    medicineId: string;
    medicineName: string;
    openingStock: number;
    stockIn: number;
    stockOut: number;
    returned: number;
    closingStock: number;
}

export interface StockReportItem {
    medicineId: string;
    medicineName: string;
    medicineCategory: string;
    medicineType: string;
    medicineUnit: string;
    stockQuantity: number;
    costPrice: number;
    sellingPrice: number;
    totalCostPrice: number;
    totalSellingPrice: number;
    dateAdded: string;
    branchName: string;
}

export interface PlatformGrowthReportItem {
    month: string;
    newPharmacies: number;
}

// Fix: Add an index signature to satisfy Recharts' data prop type requirement.
export interface SubscriptionRevenueReportItem {
    [key: string]: string | number;
    plan: SubscriptionPlan;
    revenue: number;
}

// --- System Health Types ---
export enum ServiceStatus {
    OPERATIONAL = 'Operational',
    DEGRADED = 'Degraded Performance',
    MAINTENANCE = 'Under Maintenance',
    OUTAGE = 'Service Outage',
}

export interface ServiceHealth {
    name: string;
    status: ServiceStatus;
    details: string;
}

export interface HealthChartDataPoint {
    time: string;
    value: number;
}

export interface SystemHealthStats {
    apiStatus: 'Operational' | 'Degraded';
    avgResponseTime: number;
    dbConnections: number;
    cpuUsage: number;
    responseTimeData: HealthChartDataPoint[];
    cpuUsageData: HealthChartDataPoint[];
    services: ServiceHealth[];
}

export interface SystemHealthAlert {
    id: string;
    serviceName: string;
    status: ServiceStatus;
    details: string;
    timestamp: Date;
}


// --- Platform Settings Types ---
export interface BankAccount {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}

export interface PlatformBranding {
    name: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
}

export interface PlatformMaintenance {
    isEnabled: boolean;
    message: string;
}

export interface PlatformWorkflow {
    requireApprovalForBankTransfer: boolean;
    autoSuspendOnFailedPayment: boolean;
}

export interface BlockedIP {
  id: string;
  ipAddress: string;
  reason?: string;
  createdAt: string; // ISO string
}

export enum IpApiProvider {
    NONE = 'None',
    IPINFO = 'IPinfo',
    ABSTRACT = 'Abstract API',
}

export interface IpApiSettings {
    provider: IpApiProvider;
    apiKey: string;
}

export interface PlatformSettings {
    branding: PlatformBranding;
    maintenance: PlatformMaintenance;
    workflow: PlatformWorkflow;
    manualBankAccounts: BankAccount[];
    ipBlacklist: BlockedIP[];
    ipApi: IpApiSettings;
}

// --- Pharmacy Finance Types ---
export interface PharmacyFinanceSummary {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    monthlyData: { month: string; revenue: number; expenses: number }[];
}


// --- Support Ticket Types ---
export enum SupportTicketStatus {
    OPEN = 'Open',
    IN_PROGRESS = 'In Progress',
    CLOSED = 'Closed',
}

export enum SupportTicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export interface TicketReply {
    id: string;
    ticketId: string;
    userId: string;
    userName: string;
    userRole: Role;
    message: string;
    createdAt: string; // ISO string
}

export interface SupportTicket {
    id: string;
    pharmacyId: string;
    pharmacyName: string;
    subject: string;
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    assignedStaffId?: string;
    assignedStaffName?: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    replies: TicketReply[];
}

// --- Notification Type ---
export interface Notification {
  id: string;
  type: 'low_stock' | 'near_expiry' | 'expired' | 'task_due' | 'task_overdue';
  message: string;
  medicineName?: string;
  taskId?: string;
  createdAt: string;
}

// --- Communication Types ---
export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // html
}

export interface SmsTemplate {
  id: string;
  name: string;
  body: string;
}

// --- Access Control Types ---
export enum Permission {
  // Pharmacy Permissions
  VIEW_DASHBOARD = 'View Dashboard',
  MANAGE_MEDICINES = 'Manage Medicines',
  MANAGE_PRESCRIPTIONS = 'Manage Prescriptions',
  PERFORM_SALES = 'Perform Sales (POS)',
  VIEW_REPORTS = 'View Reports',
  MANAGE_STAFF = 'Manage Staff',
  MANAGE_PHARMACY_SETTINGS = 'Manage Pharmacy Settings',
  MANAGE_BILLING = 'Manage Billing & Subscription',
  MANAGE_SUPPLIERS = 'Manage Suppliers',
  MANAGE_EXPENSES = 'Manage Expenses',
  VIEW_FINANCES = 'View Finances',
  MANAGE_BRANCHES = 'Manage Branches',
  
  // Platform Permissions
  VIEW_ALL_PHARMACIES = 'View All Pharmacies',
  MANAGE_PLATFORM_FINANCES = 'Manage Platform Finances',
  MANAGE_SUPPORT_TICKETS = 'Manage Support Tickets',
  VIEW_SYSTEM_HEALTH = 'View System Health',
  VIEW_USER_ACTIVITY = 'View User Activity',
  MANAGE_PLATFORM_STAFF = 'Manage Platform Staff',
  MANAGE_PLATFORM_SETTINGS = 'Manage Platform Settings',
}

export type RolePermissions = Record<Role, Permission[]>;

// --- User Activity & Geolocation ---
export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  ipAddress: string;
  timestamp: string; // ISO string
}

export interface IpGeolocationData {
  city: string;
  country: string;
  region: string;
}

// --- Task Management Types ---
export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    dueDate: string; // ISO string
    priority: TaskPriority;
    status: TaskStatus;
    createdAt: string; // ISO string
}

// --- Dashboard Activity Types ---
export interface RecentActivity {
    id: string;
    type: 'Sale' | 'Return';
    description: string;
    amount: number;
    createdAt: string; // ISO string
}
