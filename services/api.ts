// Fix: Import ServiceHealth type to resolve 'Cannot find name' error.
// Fix: Import PlatformBranding, PlatformMaintenance, and PlatformWorkflow to resolve type errors.
import { User, Role, Pharmacy, SubscriptionPlan, Medicine, Sale, SaleStatus, PaymentMethod, SaleItem, StockAdjustmentLog, SalesSummaryReport, MedicineSalesReportItem, InventoryLevelReportItem, SubscriptionPlanDetails, Prescription, PrescriptionStatus, Payment, MedicineUnit, MedicineCategory, DetailedSaleReportItem, Supplier, Expense, ExpenseCategory, CreditPayment, MedicineType, PaymentTransaction, PaymentStatus, SystemHealthStats, ServiceStatus, ServiceHealth, PlatformSettings, PlatformBranding, PlatformMaintenance, PlatformWorkflow, BankAccount, SystemHealthAlert, SupportTicket, TicketReply, SupportTicketStatus, SupportTicketPriority, PharmacyFinanceSummary, Notification, Announcement, EmailTemplate, SmsTemplate, Return, StockHistoryReportItem, PlatformGrowthReportItem, SubscriptionRevenueReportItem, SessionSettings, ReturnItem, BlockedIP, Permission, RolePermissions, IpApiProvider, IpApiSettings, UserActivityLog, IpGeolocationData, StockReportItem, Task, TaskStatus, TaskPriority, RecentActivity } from '../types';

// --- MOCK DATABASE ---

// Internal type for mock DB to include password
interface UserWithPassword extends User {
    password?: string;
}

let platformSettings: PlatformSettings = {
    branding: {
        name: 'SecurePharm',
        logoUrl: 'https://img.logoipsum.com/289.svg',
        faviconUrl: 'https://img.logoipsum.com/289.svg',
        primaryColor: '#4f46e5', // Default Indigo
        contactEmail: 'support@securepharm.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Health St, Med City, NG',
    },
    maintenance: {
        isEnabled: false,
        message: 'The platform is currently down for scheduled maintenance. We should be back online shortly. Thank you for your patience.',
    },
    workflow: {
        requireApprovalForBankTransfer: true,
        autoSuspendOnFailedPayment: false,
    },
    manualBankAccounts: [
        { id: 'bank-1658410294812', bankName: 'GTBank PLC', accountName: 'SecurePharm Inc', accountNumber: '0123456789' },
        { id: 'bank-1658410310294', bankName: 'Access Bank', accountName: 'SecurePharm Inc', accountNumber: '9876543210' },
    ],
    ipBlacklist: [
        { id: 'ip-1', ipAddress: '198.51.100.14', reason: 'Suspicious activity detected', createdAt: new Date().toISOString() }
    ],
    ipApi: {
        provider: IpApiProvider.NONE,
        apiKey: ''
    },
};

let subscriptionPlans: SubscriptionPlanDetails[] = [
    { id: 'plan-trial', name: SubscriptionPlan.TRIAL, price: 0, branchLimit: 0, staffLimit: 2, features: ['7-day trial', 'Basic POS', 'Limited Reports'] },
    { id: 'plan-basic', name: SubscriptionPlan.BASIC, price: 49, branchLimit: 0, staffLimit: 5, features: ['Full POS', 'Basic Reports', 'Inventory Management'] },
    { id: 'plan-pro', name: SubscriptionPlan.PRO, price: 99, branchLimit: 5, staffLimit: 20, features: ['All Basic features', 'Up to 5 branches', 'Advanced Reports', 'Staff Management'] },
    { id: 'plan-enterprise', name: SubscriptionPlan.ENTERPRISE, price: 299, branchLimit: 100, staffLimit: 1000, features: ['All Pro features', 'Unlimited branches & staff', 'Dedicated Support'] },
];

let users: UserWithPassword[] = [
    // Super Admin
    { id: 'user-1', name: 'Super Admin', email: 'superadmin@securepharm.com', username: 'superadmin', password: '12345', role: Role.SUPER_ADMIN, status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=superadmin' },
    { id: 'user-7', name: 'Platform Support', email: 'support@securepharm.com', username: 'support', password: '12345', role: Role.PLATFORM_SUPPORT, status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=support' },
    // Pharmacy One Staff
    { id: 'user-2', name: 'Adulhafeez ADMIN', email: 'pharmacyadmin@pharmaone.com', username: 'jadan', password: '12345', role: Role.PHARMACY_ADMIN, pharmacyId: 'pharm-1', branchName: 'Main Branch', status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=adulhafeez' },
    { id: 'user-8', name: 'Sam Sub-Admin', email: 'subadmin@pharmaone.com', username: 'sam', password: '12345', role: Role.SUB_ADMIN, pharmacyId: 'pharm-1', branchName: 'Main Branch', status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=sam' },
    { id: 'user-3', name: 'Michael Manager', email: 'manager@pharmaone.com', username: 'michael', password: '12345', role: Role.MANAGER, pharmacyId: 'pharm-1', branchName: 'Main Branch', status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=michael' },
    { id: 'user-4', name: 'Cindy Cashier', email: 'cashier@pharmaone.com', username: 'cindy', password: '12345', role: Role.CASHIER, pharmacyId: 'pharm-1', branchName: 'Downtown Branch', status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=cindy' },
    { id: 'user-5', name: 'Suspended Staff', email: 'suspended@pharmaone.com', username: 'suspended', password: '12345', role: Role.CASHIER, pharmacyId: 'pharm-1', branchName: 'Downtown Branch', status: 'suspended', pictureUrl: 'https://i.pravatar.cc/150?u=suspended' },

    // Pharmacy Two Staff
    { id: 'user-6', name: 'Peter Admin', email: 'admin@pharmatwo.com', username: 'peter', password: '12345', role: Role.PHARMACY_ADMIN, pharmacyId: 'pharm-2', branchName: 'Main Branch', status: 'active', pictureUrl: 'https://i.pravatar.cc/150?u=peter' },
];

let pharmacies: Pharmacy[] = [
    { id: 'pharm-1', name: 'PharmaOne Wellness', logo: 'https://img.logoipsum.com/296.svg', contact: '123-456-7890', address: '123 Health St, Med City', country: 'Nigeria', currency: 'NGN', subscriptionPlan: SubscriptionPlan.PRO, trialExpiry: '', status: 'active', sessionSettings: { autoLogoutEnabled: false, autoLogoutMinutes: 30 } },
    { id: 'pharm-2', name: 'MediCare Plus', logo: 'https://img.logoipsum.com/297.svg', contact: '987-654-3210', address: '456 Cure Ave, Wellsville', country: 'Ghana', currency: 'GHS', subscriptionPlan: SubscriptionPlan.BASIC, trialExpiry: '', status: 'active' },
    { id: 'pharm-3', name: 'Trial Pharmacy', logo: 'https://img.logoipsum.com/298.svg', contact: '555-555-5555', address: '789 Test Dr, Suite 101', country: 'Nigeria', currency: 'NGN', subscriptionPlan: SubscriptionPlan.TRIAL, trialExpiry: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'expired_trial' },
    { id: 'pharm-4', name: 'Suspended Health', logo: 'https://img.logoipsum.com/299.svg', contact: '111-222-3333', address: 'Suspended Lane', country: 'Nigeria', currency: 'NGN', subscriptionPlan: SubscriptionPlan.BASIC, trialExpiry: '', status: 'suspended' },
];

let medicines: Medicine[] = [
    { id: 'med-1', pharmacyId: 'pharm-1', branchName: 'Main Branch', name: 'Paracetamol 500mg', supplierId: 'sup-1', description: 'For fever and mild pain.', category: 'Painkiller', unit: 'Tablet', type: 'Generic', stockQuantity: 150, lowStockThreshold: 20, costPrice: 50, sellingPrice: 100, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'med-2', pharmacyId: 'pharm-1', branchName: 'Main Branch', name: 'Amoxicillin 250mg', supplierId: 'sup-1', description: 'Broad-spectrum antibiotic.', category: 'Antibiotic', unit: 'Capsule', type: 'Branded', stockQuantity: 8, lowStockThreshold: 10, costPrice: 120, sellingPrice: 200, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'med-3', pharmacyId: 'pharm-1', branchName: 'Downtown Branch', name: 'Vitamin C 1000mg', supplierId: 'sup-1', description: 'Dietary supplement.', category: 'Supplement', unit: 'Tablet', type: 'Generic', stockQuantity: 0, lowStockThreshold: 15, costPrice: 80, sellingPrice: 150, expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'med-4', pharmacyId: 'pharm-1', branchName: 'Downtown Branch', name: 'Expired Aspirin', supplierId: 'sup-1', description: 'Expired pain reliever.', category: 'Painkiller', unit: 'Tablet', type: 'Generic', stockQuantity: 20, lowStockThreshold: 10, costPrice: 30, sellingPrice: 70, expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'med-5', pharmacyId: 'pharm-2', branchName: 'Main Branch', name: 'Ibuprofen 200mg', supplierId: 'sup-2', description: 'Pain and inflammation relief.', category: 'Painkiller', unit: 'Tablet', type: 'Generic', stockQuantity: 200, lowStockThreshold: 25, costPrice: 40, sellingPrice: 80, expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
    { id: 'med-6', pharmacyId: 'pharm-1', branchName: 'Main Branch', name: 'Loratadine 10mg', supplierId: 'sup-1', description: 'Antihistamine for allergies.', category: 'Antihistamine', unit: 'Tablet', type: 'Branded', stockQuantity: 75, lowStockThreshold: 15, costPrice: 90, sellingPrice: 180, expiryDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'med-7', pharmacyId: 'pharm-1', branchName: 'Downtown Branch', name: 'Salbutamol Inhaler', supplierId: 'sup-1', description: 'For asthma relief.', category: 'Respiratory', unit: 'Inhaler', type: 'Generic', stockQuantity: 30, lowStockThreshold: 10, costPrice: 500, sellingPrice: 850, expiryDate: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
];
let suppliers: Supplier[] = [
    { id: 'sup-1', pharmacyId: 'pharm-1', name: 'MediSupplies Inc.', contactPerson: 'John Doe', email: 'john@medisupplies.com', phone: '111-222-3333', address: '1 Supplier Lane' },
    { id: 'sup-2', pharmacyId: 'pharm-2', name: 'HealthFirst Dist.', contactPerson: 'Jane Smith', email: 'jane@healthfirst.com', phone: '444-555-6666', address: '2 Distributor Ave' },
];

let sales: Sale[] = [
    { id: 'sale-1', pharmacyId: 'pharm-1', branchName: 'Main Branch', staffId: 'user-3', staffName: 'Michael Manager', customerName: 'John Appleseed', items: [{ medicineId: 'med-1', medicineName: 'Paracetamol 500mg', medicineCategory: 'Painkiller', medicineUnit: 'Tablet', medicineType: 'Generic', quantity: 2, unitPrice: 100, discount: 0, total: 200 }], totalAmount: 200, payments: [{ method: PaymentMethod.CASH, amount: 200 }], status: SaleStatus.COMPLETED, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sale-2', pharmacyId: 'pharm-1', branchName: 'Downtown Branch', staffId: 'user-4', staffName: 'Cindy Cashier', customerName: 'Jane Doe', items: [{ medicineId: 'med-3', medicineName: 'Vitamin C 1000mg', medicineCategory: 'Supplement', medicineUnit: 'Tablet', medicineType: 'Generic', quantity: 1, unitPrice: 150, discount: 0, total: 150 }], totalAmount: 150, payments: [{ method: PaymentMethod.CARD, amount: 150 }], status: SaleStatus.COMPLETED, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sale-3', pharmacyId: 'pharm-1', branchName: 'Main Branch', staffId: 'user-3', staffName: 'Michael Manager', customerName: 'Credit Customer', items: [{ medicineId: 'med-1', medicineName: 'Paracetamol 500mg', medicineCategory: 'Painkiller', medicineUnit: 'Tablet', medicineType: 'Generic', quantity: 5, unitPrice: 100, discount: 0, total: 500 }], totalAmount: 500, payments: [{ method: PaymentMethod.CREDIT, amount: 500 }], creditPayments: [], status: SaleStatus.COMPLETED, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sale-4', pharmacyId: 'pharm-1', branchName: 'Main Branch', staffId: 'user-2', staffName: 'Adulhafeez ADMIN', customerName: 'Femi Adebayo', items: [{ medicineId: 'med-6', medicineName: 'Loratadine 10mg', medicineCategory: 'Antihistamine', medicineUnit: 'Tablet', medicineType: 'Branded', quantity: 1, unitPrice: 180, discount: 10, total: 170 }], totalAmount: 170, payments: [{ method: PaymentMethod.TRANSFER, amount: 170 }], status: SaleStatus.COMPLETED, createdAt: new Date().toISOString() },
];

let returns: Return[] = [];
let heldSales: Sale[] = [];

let prescriptions: Prescription[] = [
    { id: 'presc-1', pharmacyId: 'pharm-1', patientName: 'Alice Johnson', doctorName: 'Dr. Evans', prescriptionDate: new Date().toISOString(), items: [{ medicineId: 'med-1', medicineName: 'Paracetamol 500mg', dosage: '1 tablet twice daily', quantity: 14 }], refillsAllowed: 2, refillsRemaining: 2, status: PrescriptionStatus.ACTIVE, createdAt: new Date().toISOString() },
    { id: 'presc-2', pharmacyId: 'pharm-1', patientName: 'Bob Williams', doctorName: 'Dr. Smith', prescriptionDate: new Date().toISOString(), items: [{ medicineId: 'med-2', medicineName: 'Amoxicillin 250mg', dosage: '1 capsule three times daily', quantity: 21 }], refillsAllowed: 0, refillsRemaining: 0, status: PrescriptionStatus.ACTIVE, createdAt: new Date().toISOString() },
];

let expenses: Expense[] = [
    { id: 'exp-1', pharmacyId: 'pharm-1', date: new Date().toISOString(), category: ExpenseCategory.RENT, description: 'Shop rent for the month', amount: 1500, staffId: 'user-2', staffName: 'Adulhafeez ADMIN' },
    { id: 'exp-2', pharmacyId: 'pharm-1', date: new Date().toISOString(), category: ExpenseCategory.SALARIES, description: 'Staff salaries', amount: 3000, staffId: 'user-2', staffName: 'Adulhafeez ADMIN' },
];

let medicineCategories: MedicineCategory[] = [ { id: 'cat-1', pharmacyId: 'pharm-1', name: 'Painkiller' }, { id: 'cat-2', pharmacyId: 'pharm-1', name: 'Antibiotic' }, { id: 'cat-3', pharmacyId: 'pharm-1', name: 'Supplement' }, { id: 'cat-4', pharmacyId: 'pharm-1', name: 'Antihistamine' }, { id: 'cat-5', pharmacyId: 'pharm-1', name: 'Respiratory' }];
let medicineTypes: MedicineType[] = [ { id: 'type-1', pharmacyId: 'pharm-1', name: 'Generic' }, { id: 'type-2', pharmacyId: 'pharm-1', name: 'Branded' }];
let medicineUnits: MedicineUnit[] = [ { id: 'unit-1', pharmacyId: 'pharm-1', name: 'Tablet' }, { id: 'unit-2', pharmacyId: 'pharm-1', name: 'Capsule' }, { id: 'unit-3', pharmacyId: 'pharm-1', name: 'Syrup' }, { id: 'unit-4', pharmacyId: 'pharm-1', name: 'Inhaler' }];

let paymentTransactions: PaymentTransaction[] = [
    { id: 'txn-1', pharmacyId: 'pharm-1', pharmacyName: 'PharmaOne Wellness', amount: 99, currency: 'NGN', plan: SubscriptionPlan.PRO, transactionDate: new Date().toISOString(), paymentMethod: 'Paystack', status: PaymentStatus.COMPLETED },
    { id: 'txn-2', pharmacyId: 'pharm-2', pharmacyName: 'MediCare Plus', amount: 49, currency: 'GHS', plan: SubscriptionPlan.BASIC, transactionDate: new Date().toISOString(), paymentMethod: 'Paystack', status: PaymentStatus.COMPLETED },
    { id: 'txn-3', pharmacyId: 'pharm-4', pharmacyName: 'Suspended Health', amount: 49, currency: 'NGN', plan: SubscriptionPlan.BASIC, transactionDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'Paystack', status: PaymentStatus.FAILED },
    { id: 'txn-4', pharmacyId: 'pharm-1', pharmacyName: 'PharmaOne Wellness', amount: 99, currency: 'NGN', plan: SubscriptionPlan.PRO, transactionDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), paymentMethod: 'Bank Transfer', status: PaymentStatus.PENDING },
];

let supportTickets: SupportTicket[] = [
    { id: 'ticket-1', pharmacyId: 'pharm-1', pharmacyName: 'PharmaOne Wellness', subject: 'Problem with printing receipts', status: SupportTicketStatus.IN_PROGRESS, priority: SupportTicketPriority.HIGH, assignedStaffId: 'user-1', assignedStaffName: 'Super Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), replies: [{ id: 'reply-1', ticketId: 'ticket-1', userId: 'user-2', userName: 'Adulhafeez ADMIN', userRole: Role.PHARMACY_ADMIN, message: 'I cannot print receipts after the last update.', createdAt: new Date().toISOString() }] },
    { id: 'ticket-2', pharmacyId: 'pharm-2', pharmacyName: 'MediCare Plus', subject: 'Question about billing', status: SupportTicketStatus.OPEN, priority: SupportTicketPriority.MEDIUM, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), replies: [] },
];

let announcements: Announcement[] = [
    { id: 'anno-1', title: 'System Maintenance Scheduled', content: 'We will be undergoing scheduled maintenance on Sunday at 2 AM. The platform will be unavailable for approximately 30 minutes.', status: 'active', createdAt: new Date().toISOString() },
    { id: 'anno-2', title: 'New Reporting Features!', content: 'Check out the new detailed sales and stock history reports available in the Reports section.', status: 'inactive', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

let emailTemplates: EmailTemplate[] = [
    {id: 'et-1', name: 'Welcome Email', subject: 'Welcome to SecurePharm!', body: '<h1>Hi {{name}}</h1><p>Welcome to SecurePharm, the best way to manage your pharmacy.</p><p>Regards,<br>The SecurePharm Team</p>'},
    {id: 'et-2', name: 'Password Reset', subject: 'Your Password Reset Request', body: '<p>Hi {{name}},</p><p>Please use the link below to reset your password. This link is valid for 1 hour.</p><p><a href="{{reset_link}}">Reset Password</a></p>'},
];
let smsTemplates: SmsTemplate[] = [
    {id: 'st-1', name: 'OTP SMS', body: 'Your SecurePharm verification code is {{otp}}. Do not share this code.'},
    {id: 'st-2', name: 'Sale Notification', body: 'Thank you for your purchase at {{pharmacy_name}}. Your total was {{total_amount}}.'},
];

let userActivityLogs: UserActivityLog[] = [
    { id: 'act-1', userId: 'user-1', userName: 'Super Admin', userRole: Role.SUPER_ADMIN, action: 'Logged in', ipAddress: '127.0.0.1', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'act-2', userId: 'user-2', userName: 'Adulhafeez ADMIN', userRole: Role.PHARMACY_ADMIN, action: 'Logged in', ipAddress: '8.8.8.8', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { id: 'act-3', userId: 'user-1', userName: 'Super Admin', userRole: Role.SUPER_ADMIN, action: 'Updated branding settings', ipAddress: '127.0.0.1', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
    { id: 'act-4', userId: 'user-6', userName: 'Peter Admin', userRole: Role.PHARMACY_ADMIN, action: 'Failed login attempt', ipAddress: '104.18.30.126', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
];

let tasks: Task[] = [
    { id: 'task-1', userId: 'user-2', title: 'Follow up on supplier order', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), priority: TaskPriority.HIGH, status: TaskStatus.TODO, createdAt: new Date().toISOString() },
    { id: 'task-2', userId: 'user-2', title: 'Prepare monthly sales report', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), priority: TaskPriority.MEDIUM, status: TaskStatus.IN_PROGRESS, createdAt: new Date().toISOString() },
    { id: 'task-3', userId: 'user-3', title: 'Check inventory for expired drugs', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), priority: TaskPriority.LOW, status: TaskStatus.DONE, createdAt: new Date().toISOString() },
    { id: 'task-4', userId: 'user-4', title: 'Close sales for the day', dueDate: new Date().toISOString(), priority: TaskPriority.HIGH, status: TaskStatus.TODO, createdAt: new Date().toISOString() },
];

let rolePermissions: RolePermissions = {
    [Role.SUPER_ADMIN]: Object.values(Permission), // Super admin has all permissions
    [Role.PLATFORM_SUPPORT]: [
        Permission.VIEW_ALL_PHARMACIES,
        Permission.MANAGE_SUPPORT_TICKETS,
        Permission.VIEW_SYSTEM_HEALTH,
    ],
    [Role.PLATFORM_BILLING]: [
        Permission.VIEW_ALL_PHARMACIES,
        Permission.MANAGE_PLATFORM_FINANCES,
    ],
    [Role.PHARMACY_ADMIN]: [
        Permission.VIEW_DASHBOARD,
        Permission.MANAGE_MEDICINES,
        Permission.MANAGE_PRESCRIPTIONS,
        Permission.PERFORM_SALES,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_STAFF,
        Permission.MANAGE_PHARMACY_SETTINGS,
        Permission.MANAGE_BILLING,
        Permission.MANAGE_SUPPLIERS,
        Permission.MANAGE_EXPENSES,
        Permission.VIEW_FINANCES,
        Permission.MANAGE_BRANCHES,
    ],
    [Role.SUB_ADMIN]: [
        Permission.VIEW_DASHBOARD,
        Permission.MANAGE_MEDICINES,
        Permission.MANAGE_PRESCRIPTIONS,
        Permission.PERFORM_SALES,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_STAFF,
        Permission.MANAGE_SUPPLIERS,
        Permission.MANAGE_EXPENSES,
        Permission.VIEW_FINANCES,
    ],
    [Role.MANAGER]: [
        Permission.VIEW_DASHBOARD,
        Permission.MANAGE_MEDICINES,
        Permission.MANAGE_PRESCRIPTIONS,
        Permission.PERFORM_SALES,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_SUPPLIERS,
        Permission.MANAGE_EXPENSES,
    ],
    [Role.CASHIER]: [
        Permission.VIEW_DASHBOARD,
        Permission.PERFORM_SALES,
    ],
};
let stockAdjustmentLogs: StockAdjustmentLog[] = [];
// --- API MOCK ---

/**
 * In a real application, these mock functions would be replaced with calls to a backend service (e.g., Supabase).
 * The _adjustStock helper demonstrates how stock logic could be centralized.
 */

const _getPlatformData = () => ({
    platformSettings,
    subscriptionPlans,
    users,
    pharmacies,
    medicines,
    suppliers,
    sales,
    returns,
    heldSales,
    prescriptions,
    expenses,
    medicineCategories,
    medicineTypes,
    medicineUnits,
    paymentTransactions,
    supportTickets,
    announcements,
    emailTemplates,
    smsTemplates,
    userActivityLogs,
    rolePermissions,
    stockAdjustmentLogs,
    tasks
});


const _adjustStock = (medicineId: string, quantityChange: number, reason: string, user: User) => {
    const medIndex = medicines.findIndex(m => m.id === medicineId);
    if (medIndex === -1) {
        // In a real app, this would be a more robust error
        console.error(`Medicine with ID ${medicineId} not found for stock adjustment.`);
        return;
    }
    
    medicines[medIndex].stockQuantity += quantityChange;
    
    const log: StockAdjustmentLog = {
        id: `log-${Date.now()}`,
        pharmacyId: medicines[medIndex].pharmacyId,
        pharmacyName: pharmacies.find(p => p.id === medicines[medIndex].pharmacyId)?.name || 'Unknown',
        medicineId,
        medicineName: medicines[medIndex].name,
        staffId: user.id,
        staffName: user.name,
        type: quantityChange > 0 ? 'Increase' : 'Decrease',
        quantity: Math.abs(quantityChange),
        reason,
        createdAt: new Date().toISOString(),
    };
    stockAdjustmentLogs.push(log);
    
    return medicines[medIndex];
};


// Fix: Export the 'api' object to make it accessible from other modules.
export const api = {
    // --- Auth & User ---
    login: async (email: string, pass: string): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(u => u.email === email && u.password === pass);
                if (user) {
                    if (user.status === 'suspended') {
                        reject(new Error("Your account has been suspended."));
                    } else {
                        const { password, ...userToReturn } = user;
                        resolve(userToReturn);
                    }
                } else {
                    reject(new Error("Invalid email or password."));
                }
            }, 500);
        });
    },
    logout: () => { /* In a real app, this would invalidate a token */ },

    updateUserProfile: async (userId: string, profileData: { name?: string; email?: string }, newPassword?: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userIndex = users.findIndex(u => u.id === userId);
                if (userIndex === -1) {
                    return reject(new Error('User not found.'));
                }

                if (newPassword) {
                    // In a real app, you'd check the current password. Here we just set the new one.
                    users[userIndex].password = newPassword;
                }
                
                if (profileData.name) {
                    users[userIndex].name = profileData.name;
                }
                if (profileData.email) {
                    // Check for email uniqueness if needed
                    users[userIndex].email = profileData.email;
                }
                
                const { password, ...userToReturn } = users[userIndex];
                resolve(userToReturn);
            }, 500);
        });
    },

    // --- Platform Settings ---
    getPlatformSettings: async (): Promise<PlatformSettings> => Promise.resolve(platformSettings),
    updateBrandingSettings: async (settings: PlatformBranding): Promise<PlatformBranding> => {
        platformSettings.branding = settings;
        return Promise.resolve(platformSettings.branding);
    },
    updateWorkflowSettings: async (settings: PlatformWorkflow): Promise<PlatformWorkflow> => {
        platformSettings.workflow = settings;
        return Promise.resolve(platformSettings.workflow);
    },
    updateMaintenanceSettings: async (settings: PlatformMaintenance): Promise<PlatformMaintenance> => {
        platformSettings.maintenance = settings;
        return Promise.resolve(platformSettings.maintenance);
    },
    updateManualBankAccounts: async (accounts: BankAccount[]): Promise<BankAccount[]> => {
        platformSettings.manualBankAccounts = accounts;
        return Promise.resolve(platformSettings.manualBankAccounts);
    },
    updateIpBlacklist: async (blacklist: BlockedIP[]): Promise<BlockedIP[]> => {
        platformSettings.ipBlacklist = blacklist;
        return Promise.resolve(platformSettings.ipBlacklist);
    },
    updateIpApiSettings: async (settings: IpApiSettings): Promise<IpApiSettings> => {
        platformSettings.ipApi = settings;
        return Promise.resolve(platformSettings.ipApi);
    },
    getRolePermissions: async (): Promise<RolePermissions> => Promise.resolve(rolePermissions),
    updateRolePermissions: async (role: Role, permissions: Permission[]): Promise<void> => {
        rolePermissions[role] = permissions;
        return Promise.resolve();
    },
    getEmailTemplates: async (): Promise<EmailTemplate[]> => Promise.resolve(emailTemplates),
    updateEmailTemplate: async (template: EmailTemplate): Promise<EmailTemplate> => {
        const index = emailTemplates.findIndex(t => t.id === template.id);
        if (index > -1) {
             emailTemplates[index] = template;
        } else {
            // In a real app you might throw an error. Here we'll just add it if not found.
            emailTemplates.push(template);
        }
        return Promise.resolve(template);
    },
    getSmsTemplates: async (): Promise<SmsTemplate[]> => Promise.resolve(smsTemplates),
    updateSmsTemplate: async (template: SmsTemplate): Promise<SmsTemplate> => {
        const index = smsTemplates.findIndex(t => t.id === template.id);
        if (index > -1) {
            smsTemplates[index] = template;
        } else {
             smsTemplates.push(template);
        }
        return Promise.resolve(template);
    },
    getAnnouncements: async (): Promise<Announcement[]> => Promise.resolve(announcements),
    getActiveAnnouncements: async (): Promise<Announcement[]> => Promise.resolve(announcements.filter(a => a.status === 'active')),
    addAnnouncement: async (data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
        const newAnnouncement: Announcement = { ...data, id: `anno-${Date.now()}`, createdAt: new Date().toISOString() };
        announcements.push(newAnnouncement);
        return Promise.resolve(newAnnouncement);
    },
    updateAnnouncement: async (data: Announcement): Promise<Announcement> => {
        const index = announcements.findIndex(a => a.id === data.id);
        if (index > -1) announcements[index] = data;
        return Promise.resolve(data);
    },
    deleteAnnouncement: async (id: string): Promise<void> => {
        announcements = announcements.filter(a => a.id !== id);
        return Promise.resolve();
    },
    getUserActivityLogs: async (): Promise<UserActivityLog[]> => {
        return Promise.resolve(userActivityLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    },
    getIpGeolocation: async (ipAddress: string): Promise<IpGeolocationData | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { provider, apiKey } = platformSettings.ipApi;
                if (provider === IpApiProvider.NONE || !apiKey) {
                    return resolve(null);
                }

                // Simulate API call based on provider
                console.log(`Simulating API call to ${provider} for IP: ${ipAddress}`);
                
                // Mock responses
                const mockDb: Record<string, IpGeolocationData> = {
                    '127.0.0.1': { city: 'Localhost', country: 'N/A', region: 'N/A' },
                    '8.8.8.8': { city: 'Mountain View', country: 'United States', region: 'California' },
                    '104.18.30.126': { city: 'Lagos', country: 'Nigeria', region: 'Lagos' },
                };

                resolve(mockDb[ipAddress] || { city: 'Unknown', country: 'Unknown', region: 'Unknown' });
            }, 300); // Simulate network latency
        });
    },

    // --- Pharmacy Admin ---
    updatePharmacyInformation: async (pharmacyId: string, updatedData: Partial<Pharmacy>): Promise<Pharmacy> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pharmacyIndex = pharmacies.findIndex(p => p.id === pharmacyId);
                if (pharmacyIndex === -1) {
                    return reject(new Error('Pharmacy not found.'));
                }
                // Simulate sending for approval instead of direct update
                pharmacies[pharmacyIndex].pendingChanges = updatedData;
                pharmacies[pharmacyIndex].updateStatus = 'pending_approval';
                pharmacies[pharmacyIndex].updateRequestedAt = new Date().toISOString();
                delete pharmacies[pharmacyIndex].rejectionReason;
                
                resolve(pharmacies[pharmacyIndex]);
            }, 500);
        });
    },

    approvePharmacyUpdate: async (pharmacyId: string): Promise<Pharmacy> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pharmacyIndex = pharmacies.findIndex(p => p.id === pharmacyId);
                if (pharmacyIndex === -1) return reject(new Error('Pharmacy not found.'));
                
                const pharmacy = pharmacies[pharmacyIndex];
                if (pharmacy.pendingChanges) {
                    Object.assign(pharmacy, pharmacy.pendingChanges);
                }
                delete pharmacy.pendingChanges;
                delete pharmacy.rejectionReason;
                pharmacy.updateStatus = 'approved';

                resolve(pharmacy);
            }, 300);
        });
    },

    rejectPharmacyUpdate: async (pharmacyId: string, reason: string): Promise<Pharmacy> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pharmacyIndex = pharmacies.findIndex(p => p.id === pharmacyId);
                if (pharmacyIndex === -1) return reject(new Error('Pharmacy not found.'));
                
                const pharmacy = pharmacies[pharmacyIndex];
                delete pharmacy.pendingChanges;
                pharmacy.updateStatus = 'rejected';
                pharmacy.rejectionReason = reason;

                resolve(pharmacy);
            }, 300);
        });
    },

    updateSessionSettings: async (pharmacyId: string, settings: SessionSettings): Promise<Pharmacy> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pharmacyIndex = pharmacies.findIndex(p => p.id === pharmacyId);
                if (pharmacyIndex === -1) {
                    return reject(new Error('Pharmacy not found.'));
                }
                pharmacies[pharmacyIndex].sessionSettings = settings;
                resolve(pharmacies[pharmacyIndex]);
            }, 500);
        });
    },

    getPharmacyById: async (id: string): Promise<Pharmacy | undefined> => Promise.resolve(pharmacies.find(p => p.id === id)),
    getMedicines: async (pharmacyId: string): Promise<Medicine[]> => Promise.resolve(medicines.filter(m => m.pharmacyId === pharmacyId)),
    getSubscriptionPlans: async (): Promise<SubscriptionPlanDetails[]> => Promise.resolve(subscriptionPlans),
    getSuperAdminDashboardStats: async (): Promise<any> => {
        const pendingApprovals = pharmacies.filter(p => p.updateStatus === 'pending_approval').length;
        return Promise.resolve({ 
            totalPharmacies: pharmacies.length, 
            activeSubscriptions: pharmacies.filter(p => p.status === 'active').length, 
            totalRevenue: 56000, 
            expiredTrials: pharmacies.filter(p => p.status === 'expired_trial').length,
            pendingApprovals: pendingApprovals,
        });
    },
    getPaymentTransactions: async (): Promise<PaymentTransaction[]> => Promise.resolve(paymentTransactions),
    getPharmacyPaymentTransactions: async (pharmacyId: string): Promise<PaymentTransaction[]> => {
        return Promise.resolve(paymentTransactions.filter(t => t.pharmacyId === pharmacyId));
    },
    updatePaymentStatus: async (transactionId: string, status: PaymentStatus): Promise<PaymentTransaction> => {
        const tx = paymentTransactions.find(t => t.id === transactionId);
        if (!tx) throw new Error("Transaction not found");
        tx.status = status;
        return Promise.resolve(tx);
    },
    updateSubscriptionPlan: async (plan: SubscriptionPlanDetails): Promise<SubscriptionPlanDetails> => {
        const index = subscriptionPlans.findIndex(p => p.id === plan.id);
        if (index > -1) subscriptionPlans[index] = plan;
        return Promise.resolve(plan);
    },
    getSupportTickets: async (pharmacyId?: string): Promise<SupportTicket[]> => {
        if (pharmacyId) return Promise.resolve(supportTickets.filter(t => t.pharmacyId === pharmacyId));
        return Promise.resolve(supportTickets);
    },
    getTicketById: async (ticketId: string): Promise<SupportTicket | null> => Promise.resolve(supportTickets.find(t => t.id === ticketId) || null),
    replyToTicket: async (ticketId: string, reply: { message: string, user: User }): Promise<TicketReply> => {
        const ticket = supportTickets.find(t => t.id === ticketId);
        if (!ticket) throw new Error("Ticket not found");
        const newReply: TicketReply = { id: `reply-${Date.now()}`, ticketId, message: reply.message, userId: reply.user.id, userName: reply.user.name, userRole: reply.user.role, createdAt: new Date().toISOString() };
        ticket.replies.push(newReply);
        ticket.updatedAt = new Date().toISOString();
        if(reply.user.role === Role.SUPER_ADMIN) {
            ticket.status = SupportTicketStatus.IN_PROGRESS;
        } else {
            ticket.status = SupportTicketStatus.OPEN;
        }
        return Promise.resolve(newReply);
    },
    updateTicketStatus: async (ticketId: string, status: SupportTicketStatus): Promise<SupportTicket> => {
        const ticket = supportTickets.find(t => t.id === ticketId);
        if (!ticket) throw new Error("Ticket not found");
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
        return Promise.resolve(ticket);
    },
    assignTicket: async (ticketId: string, staff: User): Promise<SupportTicket> => {
        const ticket = supportTickets.find(t => t.id === ticketId);
        if (!ticket) throw new Error("Ticket not found");
        ticket.assignedStaffId = staff.id;
        ticket.assignedStaffName = staff.name;
        ticket.updatedAt = new Date().toISOString();
        return Promise.resolve(ticket);
    },
    getPlatformStaff: async (): Promise<User[]> => Promise.resolve(users.filter(u => u.role === Role.SUPER_ADMIN || u.role === Role.PLATFORM_SUPPORT || u.role === Role.PLATFORM_BILLING)),
    addPlatformStaff: async (staff: Omit<User, 'id' | 'status'> & { password?: string }): Promise<User> => {
        const newUser: UserWithPassword = { ...staff, id: `user-${Date.now()}`, status: 'active' };
        users.push(newUser);
        const { password, ...userToReturn } = newUser;
        return Promise.resolve(userToReturn);
    },
    updatePlatformStaff: async (staff: User, newPassword?: string): Promise<User> => {
        const index = users.findIndex(u => u.id === staff.id);
        if (index === -1) throw new Error("Staff not found");
        users[index] = { ...users[index], ...staff };
        if (newPassword) {
            users[index].password = newPassword;
        }
        const { password, ...userToReturn } = users[index];
        return Promise.resolve(userToReturn);
    },
    updateUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<User> => {
        const user = users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
        user.status = status;
        const { password, ...userToReturn } = user;
        return Promise.resolve(userToReturn);
    },
    getSystemHealthStats: async (): Promise<SystemHealthStats> => Promise.resolve({ apiStatus: 'Operational', avgResponseTime: 120, dbConnections: 45, cpuUsage: 30, responseTimeData: [{time: '10:00', value: 110}, {time: '10:05', value: 130}], cpuUsageData: [{time: '10:00', value: 25}, {time: '10:05', value: 35}], services: [{name: 'API', status: ServiceStatus.OPERATIONAL, details: 'All systems go.'}] }),
    getSystemHealthAlertsLog: async (): Promise<SystemHealthAlert[]> => Promise.resolve([]),
    getUsersForPharmacy: async (pharmacyId: string): Promise<User[]> => Promise.resolve(users.filter(u => u.pharmacyId === pharmacyId)),
    getPharmacies: async (): Promise<Pharmacy[]> => Promise.resolve(pharmacies),
    getPharmacyDashboardStats: async (pharmacyId: string): Promise<any> => {
        const pharmacyUsers = users.filter(u => u.pharmacyId === pharmacyId);
        const pharmacyMedicines = medicines.filter(m => m.pharmacyId === pharmacyId);
        const pharmacySales = sales.filter(s => s.pharmacyId === pharmacyId);
        const pharmacySuppliers = suppliers.filter(s => s.pharmacyId === pharmacyId);
        const pharmacyExpenses = expenses.filter(e => e.pharmacyId === pharmacyId);
        const pharmacyCats = medicineCategories.filter(mc => mc.pharmacyId === pharmacyId);
        const pharmacyTypes = medicineTypes.filter(mt => mt.pharmacyId === pharmacyId);
        const pharmacyUnits = medicineUnits.filter(mu => mu.pharmacyId === pharmacyId);

        const now = new Date();
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(now.getDate() + 60);

        const creditSales = pharmacySales.filter(s => s.payments.some(p => p.method === PaymentMethod.CREDIT));
        const totalReceivable = creditSales.reduce((total, sale) => {
            const paid = sale.creditPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
            return total + (sale.totalAmount - paid);
        }, 0);
        
        const totalRevenue = pharmacySales.reduce((sum, s) => s.status === SaleStatus.COMPLETED ? sum + s.totalAmount : sum, 0);
        const totalExpenses = pharmacyExpenses.reduce((sum, e) => sum + e.amount, 0);

        return Promise.resolve({
            // For new card design
            users: pharmacyUsers.length,
            expired: pharmacyMedicines.filter(m => new Date(m.expiryDate) < now).length,
            outOfStock: pharmacyMedicines.filter(m => m.stockQuantity <= 0).length,
            invoices: pharmacySales.length,
            medicines: pharmacyMedicines.length,
            customers: new Set(pharmacySales.map(s => s.customerName)).size,
            suppliers: pharmacySuppliers.length,
            stores: new Set(pharmacyUsers.map(u => u.branchName)).size,
            expiredToday: 0, // Mocked for now
            unit: pharmacyUnits.length,
            type: pharmacyTypes.length,
            category: pharmacyCats.length,
            
            // For financial cards
            receivable: totalReceivable,
            expenses: totalExpenses,
            todaySales: pharmacySales.filter(s => new Date(s.createdAt).toDateString() === now.toDateString()).reduce((sum, s) => sum + s.totalAmount, 0),
            revenue: totalRevenue,
        });
    },
    getSales: async (pharmacyId: string): Promise<Sale[]> => Promise.resolve(sales.filter(s => s.pharmacyId === pharmacyId)),
    getSaleById: async (saleId: string): Promise<Sale | undefined> => Promise.resolve(sales.find(s => s.id === saleId)),
    getDailySalesReport: async (pharmacyId: string): Promise<{ cash: number, transfer: number, card: number, total: number }> => {
        const todaySales = sales.filter(s => s.pharmacyId === pharmacyId && new Date(s.createdAt).toDateString() === new Date().toDateString());
        const report = { cash: 0, transfer: 0, card: 0, total: 0 };
        
        todaySales.forEach(sale => {
            report.total += sale.totalAmount;
            sale.payments.forEach(p => {
                if (p.method === PaymentMethod.CASH) report.cash += p.amount;
                if (p.method === PaymentMethod.TRANSFER) report.transfer += p.amount;
                if (p.method === PaymentMethod.CARD) report.card += p.amount;
            });
        });

        return Promise.resolve(report);
    },
    getMedicineCategories: async (pharmacyId: string): Promise<MedicineCategory[]> => Promise.resolve(medicineCategories.filter(mc => mc.pharmacyId === pharmacyId)),
    getMedicineTypes: async (pharmacyId: string): Promise<MedicineType[]> => Promise.resolve(medicineTypes.filter(mt => mt.pharmacyId === pharmacyId)),
    getMedicineUnits: async (pharmacyId: string): Promise<MedicineUnit[]> => Promise.resolve(medicineUnits.filter(mu => mu.pharmacyId === pharmacyId)),
    getSuppliers: async (pharmacyId: string): Promise<Supplier[]> => Promise.resolve(suppliers.filter(s => s.pharmacyId === pharmacyId)),
    // Fix: Update function signature to accept Omit<Medicine, 'id' | 'createdAt'> to match usage.
    addMedicine: async (med: Omit<Medicine, 'id' | 'createdAt'>): Promise<Medicine> => {
        const newMed = { ...med, id: `med-${Date.now()}`, createdAt: new Date().toISOString() };
        medicines.push(newMed as Medicine);
        return Promise.resolve(newMed as Medicine);
    },
    updateMedicine: async (med: Medicine): Promise<Medicine> => {
        const index = medicines.findIndex(m => m.id === med.id);
        if (index > -1) medicines[index] = med;
        return Promise.resolve(med);
    },
    deleteMedicine: async (id: string): Promise<void> => {
        medicines = medicines.filter(m => m.id !== id);
        return Promise.resolve();
    },
    getPrescriptions: async (pharmacyId: string): Promise<Prescription[]> => Promise.resolve(prescriptions.filter(p => p.pharmacyId === pharmacyId)),
    addPrescription: async (data: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription> => {
        const newPrescription: Prescription = { ...data, id: `presc-${Date.now()}`, createdAt: new Date().toISOString() };
        prescriptions.push(newPrescription);
        return Promise.resolve(newPrescription);
    },
    updatePrescription: async (data: Prescription): Promise<Prescription> => {
        const index = prescriptions.findIndex(p => p.id === data.id);
        if (index > -1) {
            prescriptions[index] = data;
        }
        return Promise.resolve(data);
    },
    dispensePrescription: async (prescriptionId: string, user: User): Promise<{ updatedPrescription: Prescription, newSale: Sale }> => {
        const pIndex = prescriptions.findIndex(pr => pr.id === prescriptionId);
        if (pIndex === -1) throw new Error("Prescription not found");
        
        const p = prescriptions[pIndex];

        if (p.refillsRemaining <= 0) {
            throw new Error("No refills remaining for this prescription.");
        }

        p.refillsRemaining -= 1;

        if (p.refillsRemaining <= 0) {
            p.status = PrescriptionStatus.COMPLETED;
        } else {
            p.status = PrescriptionStatus.DISPENSED;
        }
        
        // Mock a sale
        const saleItems: SaleItem[] = [];
        let totalAmount = 0;
        for (const item of p.items) {
            const med = medicines.find(m => m.id === item.medicineId);
            if (!med) continue;
            // Decrease stock
            _adjustStock(item.medicineId, -item.quantity, `Prescription #${p.id.slice(-6)}`, user);
            saleItems.push({
                medicineId: item.medicineId,
                medicineName: item.medicineName,
                medicineCategory: med.category,
                medicineUnit: med.unit,
                medicineType: med.type,
                quantity: item.quantity,
                unitPrice: med.sellingPrice,
                discount: 0,
                total: item.quantity * med.sellingPrice
            });
            totalAmount += item.quantity * med.sellingPrice;
        }
        const newSale: Sale = { id: `sale-${Date.now()}`, pharmacyId: p.pharmacyId, branchName: user.branchName || 'Main Branch', staffId: user.id, staffName: user.name, customerName: p.patientName, items: saleItems, totalAmount, payments: [{method: PaymentMethod.PRESCRIPTION, amount: totalAmount}], status: SaleStatus.COMPLETED, createdAt: new Date().toISOString() };
        sales.push(newSale);

        prescriptions[pIndex] = p; // Persist changes to the prescription
        
        return Promise.resolve({ updatedPrescription: p, newSale });
    },
    getHeldSales: async (pharmacyId: string): Promise<Sale[]> => Promise.resolve(heldSales.filter(s => s.pharmacyId === pharmacyId)),
    recordSale: async (saleData: Omit<Sale, 'id' | 'createdAt'>, activeHeldSaleId?: string): Promise<Sale> => {
        if (activeHeldSaleId) {
            heldSales = heldSales.filter(s => s.id !== activeHeldSaleId);
        }
        const newSale: Sale = { ...saleData, id: `sale-${Date.now()}`, createdAt: new Date().toISOString() };
        const user = users.find(u => u.id === saleData.staffId);
        if (!user) throw new Error("User performing sale not found.");

        // Decrease stock for each item sold
        newSale.items.forEach(item => {
            _adjustStock(item.medicineId, -item.quantity, `Sale #${newSale.id.slice(-6)}`, user);
        });

        sales.push(newSale);
        return Promise.resolve(newSale);
    },
    holdSale: async (saleData: Omit<Sale, 'id' | 'createdAt' | 'status' | 'payments'>): Promise<Sale> => {
        const heldSale: Sale = { ...saleData, id: `held-${Date.now()}`, status: SaleStatus.HELD, createdAt: new Date().toISOString(), payments: [] };
        heldSales.push(heldSale);
        return Promise.resolve(heldSale);
    },
    recordReturn: async (returnData: Omit<Return, 'id' | 'createdAt'>): Promise<Return> => {
        const newReturn: Return = { ...returnData, id: `ret-${Date.now()}`, createdAt: new Date().toISOString() };
        const user = users.find(u => u.id === returnData.staffId);
        if (!user) throw new Error("User performing return not found.");

        // Increase stock for each item returned
        newReturn.items.forEach(item => {
            _adjustStock(item.medicineId, item.quantity, `Return #${newReturn.id.slice(-6)}`, user);
        });

        returns.push(newReturn);
        return Promise.resolve(newReturn);
    },
    getCreditSales: async (pharmacyId: string): Promise<Sale[]> => Promise.resolve(sales.filter(s => s.pharmacyId === pharmacyId && s.payments.some(p => p.method === PaymentMethod.CREDIT))),
    recordCreditPayment: async (saleId: string, amount: number, method: PaymentMethod, user: User): Promise<Sale> => {
        const sale = sales.find(s => s.id === saleId);
        if (!sale) throw new Error("Sale not found");
        if (!sale.creditPayments) sale.creditPayments = [];
        sale.creditPayments.push({ id: `cp-${Date.now()}`, date: new Date().toISOString(), amount, method, staffId: user.id, staffName: user.name });
        return Promise.resolve(sale);
    },
    addSupplier: async (data: Omit<Supplier, 'id'>): Promise<Supplier> => {
        const newSupplier: Supplier = { ...data, id: `sup-${Date.now()}` };
        suppliers.push(newSupplier);
        return Promise.resolve(newSupplier);
    },
    updateSupplier: async (data: Supplier): Promise<Supplier> => {
        const index = suppliers.findIndex(s => s.id === data.id);
        if (index > -1) suppliers[index] = data;
        return Promise.resolve(data);
    },
    deleteSupplier: async (id: string): Promise<void> => {
        suppliers = suppliers.filter(s => s.id !== id);
        return Promise.resolve();
    },
    getExpenses: async (pharmacyId: string): Promise<Expense[]> => Promise.resolve(expenses.filter(e => e.pharmacyId === pharmacyId)),
    addExpense: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
        const newExpense: Expense = { ...data, id: `exp-${Date.now()}` };
        expenses.push(newExpense);
        return Promise.resolve(newExpense);
    },
    updateExpense: async (data: Expense): Promise<Expense> => {
        const index = expenses.findIndex(e => e.id === data.id);
        if (index > -1) expenses[index] = data;
        return Promise.resolve(data);
    },
    deleteExpense: async (id: string): Promise<void> => {
        expenses = expenses.filter(e => e.id !== id);
        return Promise.resolve();
    },
    adjustMedicineStock: async (medicineId: string, quantityChange: number, reason: string, user: User): Promise<Medicine> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const updatedMed = _adjustStock(medicineId, quantityChange, reason, user);
                    resolve(updatedMed);
                } catch (e) {
                    reject(e);
                }
            }, 200);
        });
    },
    getPharmacyFinanceSummary: async (pharmacyId: string): Promise<PharmacyFinanceSummary> => {
        const pharmacySales = sales.filter(s => s.pharmacyId === pharmacyId && s.status === SaleStatus.COMPLETED);
        const pharmacyExpenses = expenses.filter(e => e.pharmacyId === pharmacyId);
        
        const totalRevenue = pharmacySales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalExpenses = pharmacyExpenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;

        // Mock monthly data for the chart
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const monthlyData = months.map(month => ({
            month,
            revenue: Math.floor(Math.random() * (totalRevenue / 3)) + 1000,
            expenses: Math.floor(Math.random() * (totalExpenses / 2)) + 500,
        }));

        return Promise.resolve({
            totalRevenue,
            totalExpenses,
            netProfit,
            monthlyData,
        });
    },
    getStaff: async (pharmacyId: string): Promise<User[]> => Promise.resolve(users.filter(u => u.pharmacyId === pharmacyId)),
    addPharmacyStaff: async (staff: Omit<User, 'id' | 'status'> & { password?: string }): Promise<User> => {
        const newUser: UserWithPassword = { ...staff, id: `user-${Date.now()}`, status: 'active' };
        users.push(newUser);
        const { password, ...userToReturn } = newUser;
        return Promise.resolve(userToReturn);
    },
    getSalesSummaryReport: async (pharmacyId: string): Promise<SalesSummaryReport> => Promise.resolve({ profitData: [], salesByStaff: [], salesByPaymentMethod: [] }),
    getMedicineSalesReport: async (pharmacyId: string): Promise<MedicineSalesReportItem[]> => {
        const pharmacySales = sales.filter(s => s.pharmacyId === pharmacyId && s.status === SaleStatus.COMPLETED);
        
        const reportMap: Record<string, MedicineSalesReportItem> = {};

        for (const sale of pharmacySales) {
            for (const item of sale.items) {
                const medicine = medicines.find(m => m.id === item.medicineId);
                if (!medicine) continue; // Skip if medicine not found

                const profit = (item.unitPrice - medicine.costPrice) * item.quantity;

                if (!reportMap[item.medicineId]) {
                    reportMap[item.medicineId] = {
                        medicineId: item.medicineId,
                        medicineName: item.medicineName,
                        quantitySold: 0,
                        totalRevenue: 0,
                        totalProfit: 0,
                    };
                }
                
                reportMap[item.medicineId].quantitySold += item.quantity;
                reportMap[item.medicineId].totalRevenue += item.total;
                reportMap[item.medicineId].totalProfit += profit;
            }
        }

        return Promise.resolve(Object.values(reportMap).sort((a, b) => b.totalRevenue - a.totalRevenue));
    },
    getInventoryLevelsReport: async (pharmacyId: string): Promise<InventoryLevelReportItem[]> => Promise.resolve([]),
    getDetailedSalesReport: async (pharmacyId: string): Promise<DetailedSaleReportItem[]> => {
        const reportItems: DetailedSaleReportItem[] = [];
        const pharmacy = pharmacies.find(p => p.id === pharmacyId);
        if (!pharmacy) return [];

        const pharmacySales = sales.filter(s => s.pharmacyId === pharmacyId && s.status === SaleStatus.COMPLETED);

        for (const sale of pharmacySales) {
            for (const item of sale.items) {
                const medicine = medicines.find(m => m.id === item.medicineId);
                if (!medicine) continue;

                const totalCostPrice = medicine.costPrice * item.quantity;
                const totalSalePrice = item.unitPrice * item.quantity;
                const profit = (totalSalePrice - item.discount) - totalCostPrice;

                reportItems.push({
                    saleId: sale.id,
                    pharmacyName: pharmacy.name,
                    branchName: sale.branchName,
                    customerName: sale.customerName,
                    medicineName: item.medicineName,
                    medicineCategory: item.medicineCategory,
                    medicineUnit: item.medicineUnit,
                    medicineType: item.medicineType,
                    quantity: item.quantity,
                    remainingQuantity: medicine.stockQuantity, // Current stock after all sales
                    unitCostPrice: medicine.costPrice,
                    unitSalePrice: item.unitPrice,
                    totalCostPrice: totalCostPrice,
                    totalSalePrice: totalSalePrice,
                    discount: item.discount,
                    profit: profit,
                    cashierName: sale.staffName,
                    paymentMethods: sale.payments.map(p => p.method).join(', '),
                    dateTime: sale.createdAt,
                });
            }
        }
        return Promise.resolve(reportItems.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
    },
    getStockHistoryReport: async (pharmacyId: string, start: string, end: string): Promise<StockHistoryReportItem[]> => Promise.resolve([]),
    getStockReport: async (pharmacyId: string): Promise<StockReportItem[]> => {
        const reportItems: StockReportItem[] = medicines
            .filter(m => m.pharmacyId === pharmacyId)
            .map(m => ({
                medicineId: m.id,
                medicineName: m.name,
                medicineCategory: m.category,
                medicineType: m.type,
                medicineUnit: m.unit,
                stockQuantity: m.stockQuantity,
                costPrice: m.costPrice,
                sellingPrice: m.sellingPrice,
                totalCostPrice: m.costPrice * m.stockQuantity,
                totalSellingPrice: m.sellingPrice * m.stockQuantity,
                dateAdded: m.createdAt,
                branchName: m.branchName,
            }));
        return Promise.resolve(reportItems);
    },
    getReturns: async (pharmacyId: string, staffId?: string): Promise<Return[]> => {
        let results = returns.filter(r => r.pharmacyId === pharmacyId);
        if(staffId) results = results.filter(r => r.staffId === staffId);
        return Promise.resolve(results);
    },
    getRecentPharmacyActivity: async (pharmacyId: string, staffId?: string): Promise<RecentActivity[]> => {
        let pharmacySales = sales.filter(s => s.pharmacyId === pharmacyId);
        let pharmacyReturns = returns.filter(r => r.pharmacyId === pharmacyId);

        if (staffId) {
            pharmacySales = pharmacySales.filter(s => s.staffId === staffId);
            pharmacyReturns = pharmacyReturns.filter(r => r.staffId === staffId);
        }

        const saleActivities: RecentActivity[] = pharmacySales.map(s => ({
            id: s.id,
            type: 'Sale',
            description: `Sale to ${s.customerName}`,
            amount: s.totalAmount,
            createdAt: s.createdAt,
        }));
        
        const returnActivities: RecentActivity[] = pharmacyReturns.map(r => ({
            id: r.id,
            type: 'Return',
            description: `Return from ${r.customerName}`,
            amount: r.totalAmount,
            createdAt: r.createdAt,
        }));

        const combinedActivity = [...saleActivities, ...returnActivities];

        return Promise.resolve(
            combinedActivity
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5) // Return top 5 recent activities
        );
    },
    addManualPayment: async (payment: Omit<PaymentTransaction, 'id'>): Promise<PaymentTransaction> => {
        const newTxn: PaymentTransaction = { ...payment, id: `txn-${Date.now()}` };
        paymentTransactions.push(newTxn);
        return Promise.resolve(newTxn);
    },
    updatePharmacy: async (pharmacy: Pharmacy): Promise<Pharmacy> => {
        const index = pharmacies.findIndex(p => p.id === pharmacy.id);
        if (index > -1) pharmacies[index] = pharmacy;
        return Promise.resolve(pharmacy);
    },
    createTicket: async (data: { subject: string; message: string; priority: SupportTicketPriority; pharmacyId: string; pharmacyName: string; user: User }): Promise<SupportTicket> => {
        const newTicket: SupportTicket = {
            id: `ticket-${Date.now()}`,
            pharmacyId: data.pharmacyId,
            pharmacyName: data.pharmacyName,
            subject: data.subject,
            status: SupportTicketStatus.OPEN,
            priority: data.priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [{ id: `reply-${Date.now()}`, ticketId: `ticket-${Date.now()}`, userId: data.user.id, userName: data.user.name, userRole: data.user.role, message: data.message, createdAt: new Date().toISOString() }],
        };
        supportTickets.push(newTicket);
        return Promise.resolve(newTicket);
    },
    getCashierDashboardStats: async (pharmacyId: string, staffId: string): Promise<any> => {
        const user = users.find(u => u.id === staffId);
        const branchName = user?.branchName;

        const branchSales = sales.filter(s => s.pharmacyId === pharmacyId && s.branchName === branchName);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        
        return Promise.resolve({ 
            salesToday: branchSales.filter(s => new Date(s.createdAt).toDateString() === now.toDateString()).reduce((sum, s) => sum + s.totalAmount, 0),
            salesThisWeek: branchSales.filter(s => new Date(s.createdAt) >= startOfWeek).reduce((sum, s) => sum + s.totalAmount, 0),
            salesThisMonth: branchSales.filter(s => new Date(s.createdAt) >= startOfMonth).reduce((sum, s) => sum + s.totalAmount, 0),
            salesThisYear: branchSales.filter(s => new Date(s.createdAt) >= startOfYear).reduce((sum, s) => sum + s.totalAmount, 0),
        });
    },
    getPlatformUsageStats: async (): Promise<any> => Promise.resolve({ totalSalesVolume: 1250000, totalTransactions: 5432, totalMedicinesManaged: 12345 }),
    getPlatformGrowthReport: async (): Promise<PlatformGrowthReportItem[]> => Promise.resolve([{month: 'Jan', newPharmacies: 5}, {month: 'Feb', newPharmacies: 8}]),
    getSubscriptionRevenueReport: async (): Promise<SubscriptionRevenueReportItem[]> => Promise.resolve([{plan: SubscriptionPlan.PRO, revenue: 990}, {plan: SubscriptionPlan.BASIC, revenue: 490}]),
    addMedicineCategory: async (data: Omit<MedicineCategory, 'id'>): Promise<MedicineCategory> => { const d = {...data, id:`cat-${Date.now()}`}; medicineCategories.push(d); return Promise.resolve(d); },
    updateMedicineCategory: async (data: MedicineCategory): Promise<MedicineCategory> => { const i = medicineCategories.findIndex(x => x.id === data.id); if (i > -1) medicineCategories[i] = data; return Promise.resolve(data); },
    deleteMedicineCategory: async (id: string): Promise<void> => { medicineCategories = medicineCategories.filter(x => x.id !== id); return Promise.resolve(); },
    addMedicineType: async (data: Omit<MedicineType, 'id'>): Promise<MedicineType> => { const d = {...data, id:`type-${Date.now()}`}; medicineTypes.push(d); return Promise.resolve(d); },
    updateMedicineType: async (data: MedicineType): Promise<MedicineType> => { const i = medicineTypes.findIndex(x => x.id === data.id); if (i > -1) medicineTypes[i] = data; return Promise.resolve(data); },
    deleteMedicineType: async (id: string): Promise<void> => { medicineTypes = medicineTypes.filter(x => x.id !== id); return Promise.resolve(); },
    addMedicineUnit: async (data: Omit<MedicineUnit, 'id'>): Promise<MedicineUnit> => { const d = {...data, id:`unit-${Date.now()}`}; medicineUnits.push(d); return Promise.resolve(d); },
    updateMedicineUnit: async (data: MedicineUnit): Promise<MedicineUnit> => { const i = medicineUnits.findIndex(x => x.id === data.id); if (i > -1) medicineUnits[i] = data; return Promise.resolve(data); },
    deleteMedicineUnit: async (id: string): Promise<void> => { medicineUnits = medicineUnits.filter(x => x.id !== id); return Promise.resolve(); },

    // --- Backup & Restore ---
    createPlatformBackup: async (): Promise<any> => {
        console.log("Creating full platform backup...");
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(_getPlatformData());
            }, 1000);
        });
    },
    restorePlatformBackup: async (backupData: any): Promise<void> => {
        console.log("Restoring from platform backup...", backupData);
        // In a real application, this would be a complex, transactional DB operation.
        // As we can't re-assign the module-level variables, we just log and simulate success.
        return new Promise(resolve => {
            setTimeout(() => {
                console.log("Mock restore complete. In a real app, the server data would be overwritten.");
                resolve();
            }, 1500);
        });
    },
    createPharmacyBackup: async (pharmacyId: string): Promise<any> => {
        console.log(`Creating backup for pharmacy ID: ${pharmacyId}`);
        return new Promise(resolve => {
            setTimeout(() => {
                const allData = _getPlatformData();
                const pharmacyData = {
                    pharmacy: allData.pharmacies.find(p => p.id === pharmacyId),
                    users: allData.users.filter(u => u.pharmacyId === pharmacyId),
                    medicines: allData.medicines.filter(m => m.pharmacyId === pharmacyId),
                    sales: allData.sales.filter(s => s.pharmacyId === pharmacyId),
                    suppliers: allData.suppliers.filter(s => s.pharmacyId === pharmacyId),
                    prescriptions: allData.prescriptions.filter(p => p.pharmacyId === pharmacyId),
                    expenses: allData.expenses.filter(e => e.pharmacyId === pharmacyId),
                    returns: allData.returns.filter(r => r.pharmacyId === pharmacyId),
                    stockAdjustmentLogs: allData.stockAdjustmentLogs.filter(l => l.pharmacyId === pharmacyId),
                };
                resolve(pharmacyData);
            }, 1000);
        });
    },
    restorePharmacyBackup: async (pharmacyId: string, backupData: any): Promise<void> => {
        console.log(`Restoring data for pharmacy ID: ${pharmacyId}`, backupData);
    },
};