import React, { useState, useEffect, useMemo, useCallback, ReactNode, useRef, ReactElement } from 'react';
// Fix: Use createRoot from react-dom/client for React 18 compatible rendering.
import { createRoot } from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth, useTheme, useApp } from '../App';
import { User, Role, Pharmacy, SubscriptionPlan, Medicine, Sale, SaleItem, PaymentMethod, SaleStatus, StockAdjustmentLog, SalesSummaryReport, MedicineSalesReportItem, InventoryLevelReportItem, SubscriptionPlanDetails, Prescription, PrescriptionStatus, PrescriptionItem, Payment, MedicineUnit, MedicineCategory, DetailedSaleReportItem, Supplier, Expense, ExpenseCategory, CreditPayment, MedicineType, PaymentTransaction, PaymentStatus, SystemHealthStats, ServiceStatus, PlatformBranding, PlatformMaintenance, PlatformWorkflow, SystemHealthAlert, BankAccount, PlatformSettings, PharmacyFinanceSummary, SupportTicket, SupportTicketStatus, SupportTicketPriority, TicketReply, Notification, Announcement, EmailTemplate, SmsTemplate, Return, StockHistoryReportItem, ReturnItem, PlatformGrowthReportItem, SubscriptionRevenueReportItem, SessionSettings, BlockedIP, Permission, RolePermissions, IpApiProvider, IpApiSettings, UserActivityLog, IpGeolocationData, StockReportItem, Task, TaskStatus, TaskPriority, RecentActivity } from '../types';
import { api } from '../services/api';

import {
  IconHome, IconBuilding, IconCreditCard, IconSettings, IconPill, IconUsers,
  IconShoppingCart, IconActivity, IconLogOut, IconBell, IconPlusCircle,
  IconChevronDown, IconAlertTriangle, IconCheckCircle, IconXCircle, IconClipboardList,
  // Fix: Corrected typo from IconLifeBouoy to IconLifeBuoy.
  IconDownload, IconArrowUpDown, IconX, IconPrinter, IconSun, IconMoon, IconTruck, IconDollarSign, IconReceipt, IconMenu, IconServer, IconPalette, IconTool, IconZap, IconCheckSquare, IconCopy, IconLifeBuoy, IconSend, IconFileText, IconPlus, IconMinus, IconTrendingUp, IconTrendingDown, IconQrCode, IconMegaphone, IconMail, IconMessageSquare, IconShieldOff, IconShieldCheck, IconGlobe, IconEye, IconDatabase, IconCalculator
} from '../components/Icons';
import { Button, Card, StatCard, Modal, Table, TableRow, TableCell, Label, Input, Select } from '../components/ui';

// --- START: GENERIC & HELPER COMPONENTS ---

// --- Helper Functions & Constants ---
const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString();
const formatDateTime = (isoString: string | Date) => new Date(isoString).toLocaleString();
const formatReceiptDateTime = (isoString: string | Date) => {
    const date = new Date(isoString);

    const getDayWithSuffix = (day: number) => {
        if (day > 3 && day < 21) return day + 'th';
        switch (day % 10) {
            case 1: return day + 'st';
            case 2: return day + 'nd';
            case 3: return day + 'rd';
            default: return day + 'th';
        }
    };
    
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = getDayWithSuffix(date.getDate());
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();

    return `${month} ${day}, ${year} @ ${time}`;
};
const formatCurrency = (amount: number, currency = 'NGN') => {
    const effectiveCurrency = currency || 'NGN';
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: effectiveCurrency }).format(amount);
    } catch (error) {
        if (error instanceof RangeError) {
            console.warn(`Invalid currency code "${effectiveCurrency}" provided. Falling back to NGN.`);
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(amount);
        }
        throw error;
    }
};
const getPharmacyStatusColor = (status: Pharmacy['status']) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'expired_trial': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
};
const getUserStatusColor = (status: User['status']) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
};
const getPrescriptionStatusColor = (status: PrescriptionStatus) => {
    switch (status) {
        case PrescriptionStatus.ACTIVE: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case PrescriptionStatus.DISPENSED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case PrescriptionStatus.COMPLETED: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        case PrescriptionStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
};
const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
        case PaymentStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case PaymentStatus.PENDING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case PaymentStatus.FAILED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
};
const getServiceStatusColor = (status: ServiceStatus) => {
    switch (status) {
        case ServiceStatus.OPERATIONAL: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case ServiceStatus.DEGRADED: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case ServiceStatus.MAINTENANCE: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case ServiceStatus.OUTAGE: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
};
const getTicketStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
        case SupportTicketStatus.OPEN: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case SupportTicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case SupportTicketStatus.CLOSED: return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
};
const getTicketPriorityColor = (priority: SupportTicketPriority) => {
    switch (priority) {
        case SupportTicketPriority.LOW: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case SupportTicketPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case SupportTicketPriority.HIGH: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
};
const getTaskPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.LOW: return 'bg-green-100 text-green-800';
        case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
        case TaskPriority.HIGH: return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};
const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.TODO: return 'bg-blue-100 text-blue-800';
        case TaskStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800';
        case TaskStatus.DONE: return 'bg-green-100 text-green-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

// Fix: Moved IconCalendar component definition before its usage.
// --- Helper component to render a FontAwesome icon if available, or a fallback.
const IconCalendar: React.FC<{className?: string}> = ({className}) => <IconFileText className={className} />;

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; className?: string }> = ({ active, onClick, children, className }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 flex items-center justify-center ${
            active
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700'
        } ${className || ''}`}
    >
        {children}
    </button>
);


const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const NotificationPanel: React.FC<{
    notifications: Notification[];
    onClose: () => void;
    navigateTo: (view: string, params?: Record<string, any>) => void;
}> = ({ notifications, onClose, navigateTo }) => {
    const handleNotificationClick = (notif: Notification) => {
        if (notif.type.startsWith('task_')) {
            navigateTo('tasks', { taskId: notif.taskId });
        } else {
            let filter = '';
            if (notif.type === 'low_stock') filter = 'low_stock';
            if (notif.type === 'near_expiry') filter = 'expiring_soon';
            if (notif.type === 'expired') filter = 'expired';
            navigateTo('medicines', { medicinesFilter: filter });
        }
        onClose();
    };


    return (
        <div className="absolute top-16 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-50">
            <div className="flex justify-between items-center p-3 border-b dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white">Notifications</h4>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <IconX className="w-5 h-5 text-slate-500" />
                </button>
            </div>
            {notifications.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => {
                        let icon;
                        switch(notif.type) {
                            case 'low_stock': icon = <IconAlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-500" />; break;
                            case 'near_expiry': icon = <IconAlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 text-orange-500" />; break;
                            case 'expired': icon = <IconXCircle className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" />; break;
                            case 'task_due': icon = <IconBell className="w-6 h-6 mr-3 flex-shrink-0 text-blue-500" />; break;
                            case 'task_overdue': icon = <IconAlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 text-red-500" />; break;
                            default: icon = <IconBell className="w-6 h-6 mr-3 flex-shrink-0 text-slate-500" />;
                        }

                        return (
                            <div key={notif.id} onClick={() => handleNotificationClick(notif)} className="flex items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-slate-700 last:border-b-0">
                                {icon}
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{notif.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No new notifications.</p>
            )}
        </div>
    );
};


const DigitalClock: React.FC<{ className?: string }> = ({ className }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className={`font-mono font-bold ${className}`}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
        </div>
    );
};

const DashboardStatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => {
    const colorClasses: Record<string, { border: string; bg: string; text: string; }> = {
        red: { border: 'border-red-500', bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-500' },
        orange: { border: 'border-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-500' },
        green: { border: 'border-green-500', bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-500' },
        blue: { border: 'border-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-500' },
        yellow: { border: 'border-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-500/20', text: 'text-yellow-500' },
    };
    const classes = colorClasses[color] || colorClasses.blue;

    return (
        <div onClick={onClick} className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 ${classes.border} flex flex-col justify-between ${onClick ? 'cursor-pointer transition-transform transform hover:-translate-y-1' : ''}`}>
            <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${classes.bg} mr-4`}>
                    <div className={classes.text}>{icon}</div>
                </div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
                </div>
            </div>
            {onClick && (
                <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick?.(); }} className="text-xs text-slate-400 hover:text-indigo-600 text-right mt-2">
                    View All &rarr;
                </a>
            )}
        </div>
    );
};
const FinancialStatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, icon, color }) => {
    const colorClasses: Record<string, { bg: string; text: string; }> = {
        red: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-500' },
        green: { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-500' },
        blue: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-500' },
        orange: { bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-500' },
    };
     const defaultClasses = { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-500' };
     const classes = colorClasses[color] || defaultClasses;


     return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${classes.bg} ${classes.text} mr-4`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

const SettingsFormWrapper: React.FC<{ title: string; subtitle: string; children: ReactNode }> = ({ title, subtitle, children }) => (
    <Card>
        <div className="border-b pb-4 mb-6 dark:border-slate-700">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {children}
    </Card>
);

const UserProfileSettings: React.FC<{ user: User }> = ({ user }) => {
    const { updateUserContext } = useAuth();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword && newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword && newPassword.length < 5) {
            setError("Password must be at least 5 characters long.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedUser = await api.updateUserProfile(
                user.id,
                { name, email },
                newPassword || undefined
            );
            updateUserContext(updatedUser);
            setSuccess('Profile updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SettingsFormWrapper title="My Profile" subtitle="Update your personal information and password.">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-300">{error}</div>}
                {success && <div className="p-3 bg-green-100 text-green-700 rounded-md dark:bg-green-900/30 dark:text-green-300">{success}</div>}

                <div><Label htmlFor="profile-name">Full Name</Label><Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div><Label htmlFor="profile-email">Email Address</Label><Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                
                <div className="pt-4 border-t dark:border-slate-700">
                    <h3 className="font-semibold">Change Password</h3>
                    <p className="text-xs text-slate-500 mb-2">Leave blank to keep your current password.</p>
                    <div><Label htmlFor="profile-new-password">New Password</Label><Input id="profile-new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                    <div><Label htmlFor="profile-confirm-password">Confirm New Password</Label><Input id="profile-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </SettingsFormWrapper>
    );
};

// --- END: GENERIC & HELPER COMPONENTS ---

// --- START: SUPER ADMIN COMPONENTS ---

const SADashboard: React.FC<{ navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ navigateTo }) => {
    const [stats, setStats] = useState<any>(null);
    const [growthData, setGrowthData] = useState<PlatformGrowthReportItem[]>([]);
    const [revenueData, setRevenueData] = useState<SubscriptionRevenueReportItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<UserActivityLog[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        api.getSuperAdminDashboardStats().then(setStats);
        api.getPlatformGrowthReport().then(setGrowthData);
        api.getSubscriptionRevenueReport().then(setRevenueData);
        api.getUserActivityLogs().then(logs => setRecentActivity(logs.slice(0, 5)));
    }, []);
    
    const chartTooltipProps = {
        wrapperStyle: {
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}`,
            borderRadius: '0.5rem',
        },
        contentStyle: { backgroundColor: 'transparent', border: 'none' },
        cursor: { fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
    };
    
    const chartAxisProps = {
        tick: { fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 },
        tickLine: { stroke: theme === 'dark' ? '#475569' : '#e5e7eb' }
    };
    
    const chartGridProps = {
        stroke: theme === 'dark' ? '#334155' : '#e5e7eb',
        strokeDasharray: "3 3"
    };
    
    const chartLegendProps = {
        wrapperStyle: { color: theme === 'dark' ? '#f1f5f9' : '#334155', paddingTop: '10px' }
    };

    if (!stats) return <Card>Loading platform statistics...</Card>;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Total Pharmacies" value={stats.totalPharmacies} icon={<IconBuilding />} onClick={() => navigateTo('pharmacies')} />
                <StatCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={<IconCheckCircle />} color="bg-green-500" />
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue, 'USD')} icon={<IconDollarSign />} color="bg-blue-500" onClick={() => navigateTo('billing')} />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<IconAlertTriangle />} color="bg-yellow-500" onClick={() => navigateTo('pharmacies', { filter: 'pending_approval' })} />
                <StatCard title="Expired Trials" value={stats.expiredTrials} icon={<IconXCircle />} color="bg-red-500" onClick={() => navigateTo('pharmacies', { filter: 'expired_trial' })} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">New Pharmacy Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={growthData}>
                            <CartesianGrid {...chartGridProps} />
                            <XAxis dataKey="month" {...chartAxisProps} />
                            <YAxis {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps} />
                            <Legend {...chartLegendProps} />
                            <Bar dataKey="newPharmacies" fill="#4f46e5" name="New Pharmacies" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Recent Platform Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map(log => (
                            <div key={log.id} className="flex items-center text-sm">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full mr-3">
                                    <IconActivity className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-slate-800 dark:text-slate-200">
                                        <span className="font-semibold">{log.userName}</span> {log.action.toLowerCase()}.
                                    </p>
                                    <p className="text-xs text-slate-400">{formatDateTime(log.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ManageSubscriptionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    pharmacy: Pharmacy | null;
    plans: SubscriptionPlanDetails[];
    onSave: (pharmacy: Pharmacy, plan: SubscriptionPlan, trialExpiry: string) => Promise<void>;
}> = ({ isOpen, onClose, pharmacy, plans, onSave }) => {
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SubscriptionPlan.BASIC);
    const [trialExpiry, setTrialExpiry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (pharmacy) {
            setSelectedPlan(pharmacy.subscriptionPlan);
            setTrialExpiry(pharmacy.trialExpiry ? pharmacy.trialExpiry.split('T')[0] : '');
        }
    }, [pharmacy]);

    if (!isOpen || !pharmacy) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSave(pharmacy, selectedPlan, trialExpiry ? new Date(trialExpiry).toISOString() : '');
        setIsSubmitting(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Subscription for ${pharmacy.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="subscription-plan">Subscription Plan</Label>
                    <Select id="subscription-plan" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value as SubscriptionPlan)}>
                        {plans.map(p => <option key={p.id} value={p.name}>{p.name} - {formatCurrency(p.price, 'USD')}/mo</option>)}
                    </Select>
                </div>
                {selectedPlan === SubscriptionPlan.TRIAL && (
                    <div>
                        <Label htmlFor="trial-expiry">Trial Expiry Date</Label>
                        <Input id="trial-expiry" type="date" value={trialExpiry} onChange={(e) => setTrialExpiry(e.target.value)} />
                    </div>
                )}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const SAPharmacies: React.FC<{ initialFilter?: string }> = ({ initialFilter }) => {
    const { impersonate } = useAuth();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlanDetails[]>([]);
    const [filter, setFilter] = useState(initialFilter || 'all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [selectedPharmacyForSub, setSelectedPharmacyForSub] = useState<Pharmacy | null>(null);

    useEffect(() => {
        api.getPharmacies().then(setPharmacies);
        api.getSubscriptionPlans().then(setPlans);
    }, []);

    const filteredPharmacies = useMemo(() => {
        return pharmacies
            .filter(p => {
                if (filter === 'all') return true;
                if (filter === 'pending_approval') return p.updateStatus === 'pending_approval';
                return p.status === filter;
            })
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [pharmacies, filter, searchTerm]);

    const handleImpersonate = async (pharmacy: Pharmacy) => {
        const admin = (await api.getUsersForPharmacy(pharmacy.id)).find(u => u.role === Role.PHARMACY_ADMIN);
        if (admin) {
            if (window.confirm(`Are you sure you want to log in as ${admin.name} from ${pharmacy.name}?`)) {
                impersonate(admin);
            }
        } else {
            alert("Could not find an admin account for this pharmacy.");
        }
    };
    
    const handleOpenSubModal = (pharmacy: Pharmacy) => {
        setSelectedPharmacyForSub(pharmacy);
        setIsSubModalOpen(true);
    };

    const handleSaveSubscription = async (pharmacy: Pharmacy, plan: SubscriptionPlan, trialExpiry: string) => {
        const updatedPharmacy = { ...pharmacy, subscriptionPlan: plan, trialExpiry: trialExpiry, status: plan === SubscriptionPlan.TRIAL && new Date(trialExpiry) < new Date() ? 'expired_trial' : pharmacy.status };
        await api.updatePharmacy(updatedPharmacy);
        setPharmacies(prev => prev.map(p => p.id === updatedPharmacy.id ? updatedPharmacy : p));
        setIsSubModalOpen(false);
    };

    const handleApproveUpdate = async (pharmacyId: string) => {
        await api.approvePharmacyUpdate(pharmacyId);
        const updatedPharmacies = await api.getPharmacies();
        setPharmacies(updatedPharmacies);
    };

    const handleRejectUpdate = async (pharmacyId: string) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
            await api.rejectPharmacyUpdate(pharmacyId, reason);
            const updatedPharmacies = await api.getPharmacies();
            setPharmacies(updatedPharmacies);
        }
    };

    return (
        <div className="space-y-4">
             <Card>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Pharmacies</h2>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Search pharmacies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                         <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="expired_trial">Expired Trial</option>
                            <option value="pending_approval">Pending Approval</option>
                        </Select>
                    </div>
                </div>
            </Card>

            {filteredPharmacies.map(p => (
                <Card key={p.id}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <img src={p.logo} alt={p.name} className="h-12 w-12 rounded-full mr-4 bg-slate-200 dark:bg-slate-700" />
                            <div>
                                <h3 className="text-lg font-bold">{p.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{p.address}, {p.country}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPharmacyStatusColor(p.status)}`}>{p.status.replace(/_/g, ' ')}</span>
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{p.subscriptionPlan} Plan</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="secondary" onClick={() => handleOpenSubModal(p)}>Manage Sub</Button>
                            <Button onClick={() => handleImpersonate(p)}>Impersonate</Button>
                        </div>
                    </div>
                    {p.updateStatus === 'pending_approval' && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400">
                             <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Pending Update Approval</h4>
                             <p className="text-sm text-yellow-700 dark:text-yellow-300">Requested on: {formatDateTime(p.updateRequestedAt!)}</p>
                             <ul className="list-disc list-inside text-sm mt-2">
                                {Object.entries(p.pendingChanges || {}).map(([key, value]) => (
                                    <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
                                ))}
                             </ul>
                             <div className="flex space-x-2 mt-3">
{/* Fix: Removed invalid 'size' prop from Button and used className for styling. */}
                                <Button variant="primary" className="!text-xs !py-1 !px-2 !bg-green-600 hover:!bg-green-700" onClick={() => handleApproveUpdate(p.id)}>Approve</Button>
{/* Fix: Removed invalid 'size' prop from Button and used className for styling. */}
                                <Button variant="danger" className="!text-xs !py-1 !px-2" onClick={() => handleRejectUpdate(p.id)}>Reject</Button>
                             </div>
                        </div>
                    )}
                     {p.updateStatus === 'rejected' && p.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400">
                            <h4 className="font-semibold text-red-800 dark:text-red-200">Update Rejected</h4>
                            <p className="text-sm text-red-700 dark:text-red-300">Reason: {p.rejectionReason}</p>
                        </div>
                    )}
                </Card>
            ))}

            <ManageSubscriptionModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                pharmacy={selectedPharmacyForSub}
                plans={plans}
                onSave={handleSaveSubscription}
            />
        </div>
    );
};

const SABilling: React.FC = () => {
    const { theme } = useTheme();
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlanDetails[]>([]);
    const [revenueData, setRevenueData] = useState<SubscriptionRevenueReportItem[]>([]);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDetails | null>(null);

    useEffect(() => {
        api.getPaymentTransactions().then(setTransactions);
        api.getSubscriptionPlans().then(setPlans);
        api.getSubscriptionRevenueReport().then(setRevenueData);
    }, []);

    const handleUpdatePaymentStatus = async (tx: PaymentTransaction, status: PaymentStatus) => {
        if (status === PaymentStatus.COMPLETED && tx.status === PaymentStatus.PENDING) {
            // In a real app, this would also trigger updating the pharmacy's subscription status
            alert(`Approving payment for ${tx.pharmacyName}. Their subscription will be activated.`);
        }
        const updatedTx = await api.updatePaymentStatus(tx.id, status);
        setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    };

    const handleEditPlan = (plan: SubscriptionPlanDetails) => {
        setSelectedPlan(plan);
        setIsPlanModalOpen(true);
    };

    const handleSavePlan = async (plan: SubscriptionPlanDetails) => {
        await api.updateSubscriptionPlan(plan);
        setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
        setIsPlanModalOpen(false);
    };
    
    const chartTooltipProps = {
        wrapperStyle: {
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}`,
            borderRadius: '0.5rem',
        },
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <h2 className="text-xl font-bold">Subscription Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                        {plans.map(plan => (
                            <Card key={plan.id} className="!p-4">
                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <p className="text-2xl font-bold">{formatCurrency(plan.price, 'USD')}<span className="text-sm font-normal">/mo</span></p>
                                <ul className="text-xs space-y-1 my-2">
                                    <li>Branch Limit: {plan.branchLimit}</li>
                                    <li>Staff Limit: {plan.staffLimit}</li>
                                </ul>
                                <Button onClick={() => handleEditPlan(plan)} className="w-full text-xs !py-1">Edit Plan</Button>
                            </Card>
                        ))}
                    </div>
                </Card>
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Subscription Revenue</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={revenueData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="revenue"
                                nameKey="plan"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {revenueData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip {...chartTooltipProps} formatter={(value: number) => formatCurrency(value, 'USD')} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-bold">Payment Transactions</h2>
                <Table headers={['Date', 'Pharmacy', 'Plan', 'Amount', 'Method', 'Status', 'Actions']}>
                    {transactions.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                            <TableCell className="font-medium">{tx.pharmacyName}</TableCell>
                            <TableCell>{tx.plan}</TableCell>
                            <TableCell>{formatCurrency(tx.amount, tx.currency)}</TableCell>
                            <TableCell>{tx.paymentMethod}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(tx.status)}`}>{tx.status}</span>
                            </TableCell>
                             <TableCell>
                                {tx.status === PaymentStatus.PENDING && tx.paymentMethod === 'Bank Transfer' && (
                                     <Button
                                        onClick={() => handleUpdatePaymentStatus(tx, PaymentStatus.COMPLETED)}
                                        className="!py-1 !px-2 !text-xs !bg-green-600 hover:!bg-green-700"
                                     >
                                        Approve
                                     </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>
             {isPlanModalOpen && selectedPlan && <EditPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} plan={selectedPlan} onSave={handleSavePlan} />}
        </div>
    );
};

const EditPlanModal: React.FC<{isOpen: boolean; onClose: () => void; plan: SubscriptionPlanDetails; onSave: (plan: SubscriptionPlanDetails) => void;}> = ({isOpen, onClose, plan, onSave}) => {
    const [formData, setFormData] = useState(plan);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, price: Number(formData.price), branchLimit: Number(formData.branchLimit), staffLimit: Number(formData.staffLimit)});
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${plan.name} Plan`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="price">Price (USD)</Label><Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} /></div>
                <div><Label htmlFor="branchLimit">Branch Limit</Label><Input id="branchLimit" name="branchLimit" type="number" value={formData.branchLimit} onChange={handleChange} /></div>
                <div><Label htmlFor="staffLimit">Staff Limit</Label><Input id="staffLimit" name="staffLimit" type="number" value={formData.staffLimit} onChange={handleChange} /></div>
                <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save Changes</Button></div>
            </form>
        </Modal>
    )
}

const SASupport: React.FC<{ navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ navigateTo }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);

    useEffect(() => {
        api.getSupportTickets().then(setTickets);
    }, []);

    const openTickets = tickets.filter(t => t.status !== SupportTicketStatus.CLOSED);
    const closedTickets = tickets.filter(t => t.status === SupportTicketStatus.CLOSED);

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold">Open Support Tickets ({openTickets.length})</h2>
                <Table headers={['Created', 'Pharmacy', 'Subject', 'Priority', 'Status', 'Assigned To']}>
                    {openTickets.map(ticket => (
                        <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigateTo('support_ticket_details', { ticketId: ticket.id })}>
                            <TableCell>{formatDateTime(ticket.createdAt)}</TableCell>
                            <TableCell>{ticket.pharmacyName}</TableCell>
                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                            <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityColor(ticket.priority)}`}>{ticket.priority}</span></TableCell>
                            <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span></TableCell>
                            <TableCell>{ticket.assignedStaffName || 'Unassigned'}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>

            <Card>
                <h2 className="text-xl font-bold">Closed Support Tickets ({closedTickets.length})</h2>
                {closedTickets.length > 0 ? (
                    <Table headers={['Created', 'Pharmacy', 'Subject', 'Priority', 'Status', 'Assigned To']}>
                        {closedTickets.map(ticket => (
                            <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigateTo('support_ticket_details', { ticketId: ticket.id })}>
                                <TableCell>{formatDateTime(ticket.createdAt)}</TableCell>
                                <TableCell>{ticket.pharmacyName}</TableCell>
                                <TableCell className="font-medium">{ticket.subject}</TableCell>
                                <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityColor(ticket.priority)}`}>{ticket.priority}</span></TableCell>
                                <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span></TableCell>
                                <TableCell>{ticket.assignedStaffName || 'Unassigned'}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                ) : <p className="text-sm text-slate-500 mt-4">No closed tickets.</p>}
            </Card>
        </div>
    );
};

const SupportTicketDetails: React.FC<{ ticketId: string, user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ ticketId, user, navigateTo }) => {
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [reply, setReply] = useState('');
    const [platformStaff, setPlatformStaff] = useState<User[]>([]);

    const fetchTicket = useCallback(async () => {
        const t = await api.getTicketById(ticketId);
        setTicket(t);
    }, [ticketId]);

    useEffect(() => {
        fetchTicket();
        if (user.role === Role.SUPER_ADMIN) {
            api.getPlatformStaff().then(setPlatformStaff);
        }
    }, [fetchTicket, user.role]);

    const handleReply = async () => {
        if (!reply.trim()) return;
        await api.replyToTicket(ticketId, { message: reply, user });
        setReply('');
        fetchTicket();
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as SupportTicketStatus;
        await api.updateTicketStatus(ticketId, newStatus);
        fetchTicket();
    };
    
    const handleAssignStaff = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const staffId = e.target.value;
        const staffMember = platformStaff.find(s => s.id === staffId);
        if (staffMember) {
            await api.assignTicket(ticketId, staffMember);
            fetchTicket();
        }
    };

    if (!ticket) return <Card>Loading ticket details...</Card>;

    const isPlatformUser = [Role.SUPER_ADMIN, Role.PLATFORM_SUPPORT, Role.PLATFORM_BILLING].includes(user.role);

    return (
        <div className="space-y-6">
            <Button variant="secondary" onClick={() => navigateTo(isPlatformUser ? 'support' : 'my_support_tickets')}>&larr; Back to Tickets</Button>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                        <p className="text-sm text-slate-500">From: {ticket.pharmacyName} | Opened: {formatDateTime(ticket.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTicketPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                    </div>
                </div>
            </Card>

            {isPlatformUser && (
                <Card>
                    <div className="flex items-center space-x-4">
                        <div>
                            <Label htmlFor="ticket-status">Change Status</Label>
                            <Select id="ticket-status" value={ticket.status} onChange={handleStatusChange}>
                                {Object.values(SupportTicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="ticket-assignee">Assign To</Label>
                            <Select id="ticket-assignee" value={ticket.assignedStaffId || ''} onChange={handleAssignStaff}>
                                <option value="">Unassigned</option>
                                {platformStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </div>
                    </div>
                </Card>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-bold">Conversation</h3>
                {ticket.replies.map(r => (
                    <Card key={r.id}>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{r.userName} <span className="text-xs font-normal text-slate-500">({r.userRole})</span></p>
                            <p className="text-xs text-slate-400">{formatDateTime(r.createdAt)}</p>
                        </div>
                        <p className="whitespace-pre-wrap">{r.message}</p>
                    </Card>
                ))}
            </div>

            {ticket.status !== SupportTicketStatus.CLOSED && (
                <Card>
                    <h3 className="text-lg font-bold mb-2">Add a Reply</h3>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={5} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"></textarea>
                    <div className="text-right mt-2">
                        <Button onClick={handleReply}>Send Reply</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

const SAStaff: React.FC = () => {
    const [staff, setStaff] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);

    useEffect(() => {
        api.getPlatformStaff().then(setStaff);
    }, []);

    const handleSave = async (staffMember: Omit<User, 'id' | 'status'>, password?: string) => {
        if (editingStaff) {
            await api.updatePlatformStaff({ ...editingStaff, ...staffMember }, password);
        } else {
            await api.addPlatformStaff({ ...staffMember, password: password || '12345' });
        }
        api.getPlatformStaff().then(setStaff);
        setIsModalOpen(false);
        setEditingStaff(null);
    };
    
    const handleStatusToggle = async (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        await api.updateUserStatus(user.id, newStatus);
        api.getPlatformStaff().then(setStaff);
    };

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Platform Staff</h2>
                    <Button onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}>
                        <IconPlusCircle className="w-5 h-5 mr-2" /> Add Staff
                    </Button>
                </div>
            </Card>
            <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                {staff.map(s => (
                    <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(s.status)}`}>{s.status}</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button onClick={() => { setEditingStaff(s); setIsModalOpen(true); }} className="!text-xs !py-1 !px-2">Edit</Button>
                                <Button
                                    onClick={() => handleStatusToggle(s)}
                                    variant={s.status === 'active' ? 'danger' : 'secondary'}
                                    className="!text-xs !py-1 !px-2"
                                >
                                    {s.status === 'active' ? 'Suspend' : 'Activate'}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            {isModalOpen && <PlatformStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} staffMember={editingStaff} />}
        </div>
    );
};

const PlatformStaffModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (staff: Omit<User, 'id' | 'status'>, password?: string) => void; staffMember: User | null; }> = ({ isOpen, onClose, onSave, staffMember }) => {
    const [formData, setFormData] = useState({ name: '', email: '', username: '', role: Role.PLATFORM_SUPPORT, password: '' });

    useEffect(() => {
        if (staffMember) {
            setFormData({ name: staffMember.name, email: staffMember.email, username: staffMember.username, role: staffMember.role, password: '' });
        } else {
             setFormData({ name: '', email: '', username: '', role: Role.PLATFORM_SUPPORT, password: '' });
        }
    }, [staffMember]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, formData.password);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={staffMember ? 'Edit Staff' : 'Add Staff'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                <div><Label htmlFor="username">Username</Label><Input id="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required /></div>
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Select id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as Role })}>
                        <option value={Role.PLATFORM_SUPPORT}>Platform Support</option>
                        <option value={Role.PLATFORM_BILLING}>Platform Billing</option>
                        <option value={Role.SUPER_ADMIN}>Super Admin</option>
                    </Select>
                </div>
                 <div><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder={staffMember ? "Leave blank to keep current" : ""} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
                <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save</Button></div>
            </form>
        </Modal>
    );
};

const SystemHealth: React.FC = () => {
    const [stats, setStats] = useState<SystemHealthStats | null>(null);
    const [alerts, setAlerts] = useState<SystemHealthAlert[]>([]);
    const { theme } = useTheme();
    
    useEffect(() => {
        api.getSystemHealthStats().then(setStats);
        api.getSystemHealthAlertsLog().then(setAlerts);
    }, []);

    const chartTooltipProps = {
        wrapperStyle: { backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}`},
    };
    const chartAxisProps = { tick: { fill: theme === 'dark' ? '#94a3b8' : '#64748b' } };

    if (!stats) return <Card>Loading system health...</Card>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="API Status" value={stats.apiStatus} icon={<IconServer />} color={stats.apiStatus === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'} />
                <StatCard title="Avg Response Time" value={`${stats.avgResponseTime}ms`} icon={<IconActivity />} />
                <StatCard title="DB Connections" value={stats.dbConnections} icon={<IconDatabase />} />
                <StatCard title="CPU Usage" value={`${stats.cpuUsage}%`} icon={<IconZap />} color={stats.cpuUsage > 80 ? 'bg-red-500' : 'bg-green-500'} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold mb-4">API Response Time (ms)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats.responseTimeData}>
                            <XAxis dataKey="time" {...chartAxisProps}/>
                            <YAxis {...chartAxisProps}/>
                            <Tooltip {...chartTooltipProps}/>
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                 <Card>
                    <h3 className="font-bold mb-4">CPU Usage (%)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats.cpuUsageData}>
                            <XAxis dataKey="time" {...chartAxisProps} />
                            <YAxis domain={[0, 100]} {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps}/>
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
             <Card>
                <h3 className="font-bold mb-2">Service Status</h3>
                <div className="space-y-2">
                    {stats.services.map(service => (
                        <div key={service.name} className="flex justify-between items-center p-2 rounded-md bg-slate-50 dark:bg-slate-700">
                           <div>
                             <span className="font-semibold">{service.name}</span>
                             <p className="text-xs text-slate-500">{service.details}</p>
                           </div>
                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>{service.status}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const UserActivity: React.FC = () => {
    const [logs, setLogs] = useState<UserActivityLog[]>([]);
    const [geoDataCache, setGeoDataCache] = useState<Record<string, IpGeolocationData | null>>({});

    useEffect(() => {
        api.getUserActivityLogs().then(setLogs);
    }, []);
    
    const fetchGeoData = useCallback(async (ipAddress: string) => {
        if (geoDataCache[ipAddress]) return; // Already fetched or fetching
        
        const data = await api.getIpGeolocation(ipAddress);
        setGeoDataCache(prev => ({ ...prev, [ipAddress]: data }));
    }, [geoDataCache]);

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">User Activity Log</h2>
            <Table headers={['Timestamp', 'User', 'Role', 'Action', 'IP Address', 'Location']}>
                {logs.map(log => {
                    const geo = geoDataCache[log.ipAddress];
                    return (
                        <TableRow key={log.id}>
                            <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                            <TableCell className="font-medium">{log.userName}</TableCell>
                            <TableCell>{log.userRole}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell onMouseOver={() => fetchGeoData(log.ipAddress)}>{log.ipAddress}</TableCell>
                            <TableCell>
                                {geo ? `${geo.city}, ${geo.country}` : <span className="text-xs text-slate-400">Hover IP for info</span>}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </Table>
        </Card>
    );
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<PlatformSettings | null>(null);
    const [rolePermissions, setRolePermissions] = useState<RolePermissions | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        api.getPlatformSettings().then(setSettings);
        api.getRolePermissions().then(setRolePermissions);
    }, []);

    const handleBrandingChange = (field: keyof PlatformBranding, value: string) => {
        setSettings(prev => prev ? { ...prev, branding: { ...prev.branding, [field]: value } } : null);
    };
    
    const handleWorkflowChange = (field: keyof PlatformWorkflow, value: boolean) => {
        setSettings(prev => prev ? { ...prev, workflow: { ...prev.workflow, [field]: value } } : null);
    };

    const handleMaintenanceChange = (field: keyof PlatformMaintenance, value: boolean | string) => {
        setSettings(prev => prev ? { ...prev, maintenance: { ...prev.maintenance, [field]: value } } : null);
    };
    
    const handleIpApiChange = (field: keyof IpApiSettings, value: string) => {
        setSettings(prev => prev ? { ...prev, ipApi: { ...prev.ipApi, [field]: value } } : null);
    };

    const handleSaveBranding = async () => {
        if (settings) {
            setIsSubmitting(true);
            await api.updateBrandingSettings(settings.branding);
            alert('Branding settings saved!');
            // Force reload to apply new theme color system-wide
            window.location.reload();
            setIsSubmitting(false);
        }
    };
    
    const handleSaveWorkflow = async () => {
         if (settings) {
            setIsSubmitting(true);
            await api.updateWorkflowSettings(settings.workflow);
            alert('Workflow settings saved!');
            setIsSubmitting(false);
        }
    };
    
    const handleSaveMaintenance = async () => {
         if (settings) {
            setIsSubmitting(true);
            await api.updateMaintenanceSettings(settings.maintenance);
            alert('Maintenance settings saved!');
            setIsSubmitting(false);
        }
    };

    const handleSaveIpApi = async () => {
        if (settings) {
            setIsSubmitting(true);
            await api.updateIpApiSettings(settings.ipApi);
            alert('IP Geolocation API settings saved!');
            setIsSubmitting(false);
        }
    };

    const handlePermissionChange = (role: Role, permission: Permission, checked: boolean) => {
        setRolePermissions(prev => {
            if (!prev) return null;
            const newPerms = { ...prev };
            if (checked) {
                newPerms[role] = [...new Set([...newPerms[role], permission])];
            } else {
                newPerms[role] = newPerms[role].filter(p => p !== permission);
            }
            return newPerms;
        });
    };
    
    const handleSavePermissions = async (role: Role) => {
        if(rolePermissions) {
            await api.updateRolePermissions(role, rolePermissions[role]);
            alert(`Permissions for ${role} saved!`);
        }
    };

    if (!settings || !rolePermissions) return <Card>Loading settings...</Card>;

    return (
        <div className="space-y-6">
            <SettingsFormWrapper title="Branding" subtitle="Customize the platform's appearance.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                    <div><Label htmlFor="name">Platform Name</Label><Input id="name" value={settings.branding.name} onChange={e => handleBrandingChange('name', e.target.value)} /></div>
                    <div><Label htmlFor="logoUrl">Logo URL</Label><Input id="logoUrl" value={settings.branding.logoUrl} onChange={e => handleBrandingChange('logoUrl', e.target.value)} /></div>
                    <div><Label htmlFor="primaryColor">Primary Color</Label><Input id="primaryColor" type="color" value={settings.branding.primaryColor} onChange={e => handleBrandingChange('primaryColor', e.target.value)} /></div>
                    <div><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" type="email" value={settings.branding.contactEmail} onChange={e => handleBrandingChange('contactEmail', e.target.value)} /></div>
                 </div>
                 <Button onClick={handleSaveBranding} disabled={isSubmitting} className="mt-4">{isSubmitting ? 'Saving...' : 'Save Branding'}</Button>
            </SettingsFormWrapper>
            
             <SettingsFormWrapper title="Workflow" subtitle="Configure automated platform actions.">
                 <div className="space-y-4">
                    <div className="flex items-center"><input type="checkbox" id="autoSuspend" checked={settings.workflow.autoSuspendOnFailedPayment} onChange={e => handleWorkflowChange('autoSuspendOnFailedPayment', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><Label htmlFor="autoSuspend" className="ml-2 !mb-0">Auto-suspend pharmacies on failed subscription payment</Label></div>
                    <div className="flex items-center"><input type="checkbox" id="requireApproval" checked={settings.workflow.requireApprovalForBankTransfer} onChange={e => handleWorkflowChange('requireApprovalForBankTransfer', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><Label htmlFor="requireApproval" className="ml-2 !mb-0">Require manual approval for Bank Transfer payments</Label></div>
                 </div>
                 <Button onClick={handleSaveWorkflow} disabled={isSubmitting} className="mt-4">{isSubmitting ? 'Saving...' : 'Save Workflow'}</Button>
            </SettingsFormWrapper>
            
             <SettingsFormWrapper title="Maintenance Mode" subtitle="Temporarily disable access for non-admins.">
                 <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center"><input type="checkbox" id="maintenanceEnabled" checked={settings.maintenance.isEnabled} onChange={e => handleMaintenanceChange('isEnabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><Label htmlFor="maintenanceEnabled" className="ml-2 !mb-0">Enable Maintenance Mode</Label></div>
                    <div><Label htmlFor="maintenanceMessage">Maintenance Message</Label><textarea id="maintenanceMessage" rows={3} value={settings.maintenance.message} onChange={e => handleMaintenanceChange('message', e.target.value)} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" /></div>
                 </div>
                 <Button onClick={handleSaveMaintenance} disabled={isSubmitting} className="mt-4">{isSubmitting ? 'Saving...' : 'Save Maintenance Settings'}</Button>
            </SettingsFormWrapper>
            
             <SettingsFormWrapper title="IP Geolocation API" subtitle="Configure an API for enriching user activity logs with location data.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                     <div>
                        <Label htmlFor="ip-provider">API Provider</Label>
                        <Select id="ip-provider" value={settings.ipApi.provider} onChange={e => handleIpApiChange('provider', e.target.value)}>
                            {Object.values(IpApiProvider).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                     </div>
                     <div>
                        <Label htmlFor="ip-apiKey">API Key</Label>
                        <Input id="ip-apiKey" type="password" value={settings.ipApi.apiKey} onChange={e => handleIpApiChange('apiKey', e.target.value)} />
                     </div>
                 </div>
                  <Button onClick={handleSaveIpApi} disabled={isSubmitting} className="mt-4">{isSubmitting ? 'Saving...' : 'Save API Settings'}</Button>
            </SettingsFormWrapper>

            <SettingsFormWrapper title="Access Control" subtitle="Manage permissions for different platform and pharmacy roles.">
                 <div className="space-y-6">
                    {Object.keys(rolePermissions).map(role => (
                        <div key={role}>
                            <h3 className="text-lg font-semibold">{role}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                {Object.values(Permission).map(permission => (
                                     <div key={permission} className="flex items-center">
                                        <input type="checkbox" id={`${role}-${permission}`} checked={rolePermissions[role as Role].includes(permission)} onChange={e => handlePermissionChange(role as Role, permission, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                        <Label htmlFor={`${role}-${permission}`} className="ml-2 !mb-0 text-sm font-normal">{permission}</Label>
                                     </div>
                                ))}
                            </div>
                             <Button onClick={() => handleSavePermissions(role as Role)} className="mt-3 !text-xs !py-1 !px-2">Save {role} Permissions</Button>
                        </div>
                    ))}
                 </div>
            </SettingsFormWrapper>

        </div>
    );
};

// --- END: SUPER ADMIN COMPONENTS ---


// --- START: PHARMACY COMPONENTS ---
const PharmacyDashboard: React.FC<{ navigateTo: (view: string) => void, user: User }> = ({ navigateTo, user }) => {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        if (user.pharmacyId) {
            api.getPharmacyDashboardStats(user.pharmacyId).then(setStats);
            api.getRecentPharmacyActivity(user.pharmacyId, user.id).then(setRecentActivity);
        }
    }, [user.pharmacyId, user.id]);
    
    const chartTooltipProps = {
        wrapperStyle: { backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}`},
    };

    if (!stats) return <Card>Loading dashboard...</Card>;
    
    return (
         <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialStatCard title="Today's Sales" value={formatCurrency(stats.todaySales)} icon={<IconDollarSign className="w-6 h-6"/>} color="green" />
                <FinancialStatCard title="Total Revenue" value={formatCurrency(stats.revenue)} icon={<IconTrendingUp className="w-6 h-6"/>} color="blue" />
                <FinancialStatCard title="Total Expenses" value={formatCurrency(stats.expenses)} icon={<IconTrendingDown className="w-6 h-6"/>} color="orange" />
                <FinancialStatCard title="Total Receivable" value={formatCurrency(stats.receivable)} icon={<IconCreditCard className="w-6 h-6"/>} color="red" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <DashboardStatCard title="Medicines" value={stats.medicines} icon={<IconPill className="w-6 h-6" />} color="blue" onClick={() => navigateTo('medicines')} />
                <DashboardStatCard title="Customers" value={stats.customers} icon={<IconUsers className="w-6 h-6" />} color="green" onClick={() => navigateTo('reports')} />
                <DashboardStatCard title="Invoices" value={stats.invoices} icon={<IconFileText className="w-6 h-6" />} color="orange" onClick={() => navigateTo('reports')} />
                <DashboardStatCard title="Suppliers" value={stats.suppliers} icon={<IconTruck className="w-6 h-6" />} color="blue" onClick={() => navigateTo('suppliers')} />
                <DashboardStatCard title="Out of Stock" value={stats.outOfStock} icon={<IconXCircle className="w-6 h-6" />} color="red" onClick={() => navigateTo('medicines')} />
                <DashboardStatCard title="Expired" value={stats.expired} icon={<IconAlertTriangle className="w-6 h-6" />} color="red" onClick={() => navigateTo('medicines')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                     <Table headers={['Type', 'Description', 'Amount', 'Date']}>
                        {recentActivity.map(activity => (
                            <TableRow key={activity.id}>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${activity.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{activity.type}</span>
                                </TableCell>
                                <TableCell>{activity.description}</TableCell>
                                <TableCell>{formatCurrency(activity.amount)}</TableCell>
                                <TableCell>{formatDateTime(activity.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => navigateTo('pos')} className="flex items-center justify-center !text-sm"><IconShoppingCart className="w-4 h-4 mr-2"/> New Sale</Button>
                            <Button onClick={() => navigateTo('medicines')} className="flex items-center justify-center !text-sm"><IconPill className="w-4 h-4 mr-2"/> Add Medicine</Button>
                            <Button onClick={() => navigateTo('expenses')} className="flex items-center justify-center !text-sm"><IconReceipt className="w-4 h-4 mr-2"/> Add Expense</Button>
                            <Button onClick={() => navigateTo('reports')} className="flex items-center justify-center !text-sm"><IconFileText className="w-4 h-4 mr-2"/> View Reports</Button>
                        </div>
                    </Card>
                     <Card>
                        <h3 className="font-bold text-lg mb-2">Quick Stats</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Total Staff:</span> <span className="font-semibold">{stats.users}</span></div>
                            <div className="flex justify-between"><span>Total Categories:</span> <span className="font-semibold">{stats.category}</span></div>
                            <div className="flex justify-between"><span>Total Types:</span> <span className="font-semibold">{stats.type}</span></div>
                            <div className="flex justify-between"><span>Total Units:</span> <span className="font-semibold">{stats.unit}</span></div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Fix: Update navigateTo prop type to accept an optional params object.
const CashierDashboard: React.FC<{ user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, navigateTo }) => {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    useEffect(() => {
        if (user.pharmacyId) {
            api.getCashierDashboardStats(user.pharmacyId, user.id).then(setStats);
            api.getRecentPharmacyActivity(user.pharmacyId, user.id).then(setRecentActivity);
        }
    }, [user.pharmacyId, user.id]);

    if (!stats) return <Card>Loading dashboard...</Card>;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialStatCard title="Sales Today" value={formatCurrency(stats.salesToday)} icon={<IconDollarSign className="w-6 h-6"/>} color="green" />
                <FinancialStatCard title="This Week" value={formatCurrency(stats.salesThisWeek)} icon={<IconTrendingUp className="w-6 h-6"/>} color="blue" />
                <FinancialStatCard title="This Month" value={formatCurrency(stats.salesThisMonth)} icon={<IconCalendar className="w-6 h-6"/>} color="orange" />
                <FinancialStatCard title="This Year" value={formatCurrency(stats.salesThisYear)} icon={<IconActivity className="w-6 h-6"/>} color="red" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">My Recent Activity</h3>
                    <Table headers={['Type', 'Description', 'Amount', 'Date']}>
                        {recentActivity.map(activity => (
                             <TableRow key={activity.id}>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${activity.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{activity.type}</span>
                                </TableCell>
                                <TableCell>{activity.description}</TableCell>
                                <TableCell>{formatCurrency(activity.amount)}</TableCell>
                                <TableCell>{formatDateTime(activity.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <Button onClick={() => navigateTo('pos')} className="w-full flex items-center justify-center text-lg py-4">
                            <IconShoppingCart className="w-6 h-6 mr-2"/> Start New Sale
                        </Button>
                         <Button variant="secondary" onClick={() => navigateTo('pos', { view: 'held_sales' })} className="w-full flex items-center justify-center">
                            <IconClipboardList className="w-5 h-5 mr-2"/> View Held Sales
                        </Button>
                        <Button variant="secondary" onClick={() => navigateTo('returns')} className="w-full flex items-center justify-center">
                            <IconCalculator className="w-5 h-5 mr-2"/> Process Return
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const DetailedSalesReport: React.FC<{ user: User }> = ({ user }) => {
    const [reportData, setReportData] = useState<DetailedSaleReportItem[]>([]);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

    useEffect(() => {
        if (user.pharmacyId) {
            api.getDetailedSalesReport(user.pharmacyId).then(setReportData);
            api.getPharmacyById(user.pharmacyId).then(p => setPharmacy(p || null));
        }
    }, [user.pharmacyId]);

    const handlePrintReceipt = async (saleId: string) => {
        if (!user.pharmacyId) return;

        const saleToPrint = await api.getSaleById(saleId);
        
        if (!saleToPrint || !pharmacy) {
            alert('Could not find sale or pharmacy details to print.');
            return;
        }

        const printContainer = document.getElementById('printable-receipt');
        if (!printContainer) {
            console.error("Printable container not found");
            return;
        };

        const root = createRoot(printContainer);
        root.render(<PrintableReceipt sale={saleToPrint} pharmacy={pharmacy} />);

        setTimeout(() => {
            window.print();
            root.unmount();
        }, 100);
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">Detailed Sales Report</h2>
            <Table headers={['Date/Time', 'Customer', 'Medicine', 'Qty', 'Total Price', 'Profit', 'Cashier', 'Actions']}>
                {reportData.map((item, index) => (
                    <TableRow key={`${item.saleId}-${index}`}>
                        <TableCell>{formatDateTime(item.dateTime)}</TableCell>
                        <TableCell className="font-medium">{item.customerName}</TableCell>
                        <TableCell>{item.medicineName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.totalSalePrice, pharmacy?.currency)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(item.profit, pharmacy?.currency)}</TableCell>
                        <TableCell>{item.cashierName}</TableCell>
                        <TableCell>
                            <button 
                                onClick={() => handlePrintReceipt(item.saleId)} 
                                className="p-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white"
                                aria-label="Print Receipt"
                            >
                                <IconPrinter className="w-5 h-5" />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
        </Card>
    );
};

// ... (rest of the components like POS, Medicines, etc.)


// --- END: PHARMACY COMPONENTS ---


// --- START: MAIN DASHBOARD COMPONENT ---
// Fix: Use a named export for Dashboard to resolve circular dependency.
const Dashboard: React.FC<{ user: User, brandingSettings?: PlatformBranding | null }> = ({ user, brandingSettings }) => {
    // ... (rest of the Dashboard component implementation)
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const auth = useAuth();
    // Auto-logout logic
    useEffect(() => {
        let logoutTimer: NodeJS.Timeout;
        // Fix: Add a `typeof` check to ensure autoLogoutMinutes is a number before performing arithmetic.
        if (pharmacy?.sessionSettings?.autoLogoutEnabled && typeof pharmacy.sessionSettings.autoLogoutMinutes === 'number') {
            const logout = () => {
                // In a real app, you might want a more graceful logout (e.g., showing a modal first)
                alert(`You have been logged out due to inactivity as per your pharmacy's settings.`);
                auth.logout();
            };
            logoutTimer = setTimeout(logout, pharmacy.sessionSettings.autoLogoutMinutes * 60 * 1000);
        }
        return () => {
            if(logoutTimer) clearTimeout(logoutTimer);
        }
    }, [pharmacy, auth]);


    const { theme, toggleTheme } = useTheme();

    const isSuperAdmin = user.role === Role.SUPER_ADMIN;
    const isPlatformStaff = [Role.SUPER_ADMIN, Role.PLATFORM_SUPPORT, Role.PLATFORM_BILLING].includes(user.role);
    const isPharmacyAdmin = user.role === Role.PHARMACY_ADMIN;
    const isCashier = user.role === Role.CASHIER;

    const [currentView, setCurrentView] = useState('dashboard');
    const [viewParams, setViewParams] = useState<Record<string, any>>({});
    
    const navigateTo = (view: string, params: Record<string, any> = {}) => {
        setCurrentView(view);
        setViewParams(params);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    };

    useEffect(() => {
        if (user.pharmacyId) {
            api.getPharmacyById(user.pharmacyId).then(data => setPharmacy(data || null));
            // Mock notifications
            setNotifications([
                { id: '1', type: 'low_stock', message: 'Amoxicillin is low in stock.', medicineName: 'Amoxicillin', createdAt: new Date().toISOString() },
                { id: '2', type: 'near_expiry', message: 'Aspirin is expiring in 15 days.', medicineName: 'Aspirin', createdAt: new Date().toISOString() },
                { id: '3', type: 'task_overdue', message: 'Monthly report preparation is overdue.', taskId: 'task-2', createdAt: new Date().toISOString() },
            ]);
        }
    }, [user.pharmacyId]);


    const stopImpersonating = () => {
        if (window.confirm("Are you sure you want to stop impersonating and return to your Super Admin account?")) {
            auth.stopImpersonating();
        }
    };
    
    // --- Side navigation items based on role ---
    const navItems = useMemo(() => {
        const platformItems = [
            { name: 'Dashboard', icon: <IconHome />, view: 'dashboard' },
            { name: 'Pharmacies', icon: <IconBuilding />, view: 'pharmacies' },
            { name: 'Billing', icon: <IconCreditCard />, view: 'billing' },
            { name: 'Support', icon: <IconLifeBuoy />, view: 'support' },
            { name: 'Platform Staff', icon: <IconUsers />, view: 'staff' },
            { name: 'System Health', icon: <IconServer />, view: 'system_health' },
            { name: 'User Activity', icon: <IconEye />, view: 'user_activity' },
            { name: 'Communication', icon: <IconMegaphone />, view: 'communication' },
            { name: 'Settings', icon: <IconSettings />, view: 'settings' },
        ];
        
        const pharmacyItems = {
            [Role.PHARMACY_ADMIN]: [
                { name: 'Dashboard', icon: <IconHome />, view: 'dashboard' },
                { name: 'POS', icon: <IconShoppingCart />, view: 'pos' },
                { name: 'Medicines', icon: <IconPill />, view: 'medicines' },
                { name: 'Prescriptions', icon: <IconFileText />, view: 'prescriptions' },
                { name: 'Suppliers', icon: <IconTruck />, view: 'suppliers' },
                { name: 'Staff', icon: <IconUsers />, view: 'staff' },
                { name: 'Expenses', icon: <IconReceipt />, view: 'expenses' },
                { name: 'Finances', icon: <IconDollarSign />, view: 'finances' },
                { name: 'Reports', icon: <IconActivity />, view: 'reports' },
                { name: 'My Support Tickets', icon: <IconLifeBuoy />, view: 'my_support_tickets' },
                { name: 'My Subscription', icon: <IconCreditCard />, view: 'my_subscription' },
                { name: 'Settings', icon: <IconSettings />, view: 'settings' },
            ],
            [Role.SUB_ADMIN]: [
                { name: 'Dashboard', icon: <IconHome />, view: 'dashboard' },
                { name: 'POS', icon: <IconShoppingCart />, view: 'pos' },
                { name: 'Medicines', icon: <IconPill />, view: 'medicines' },
                { name: 'Prescriptions', icon: <IconFileText />, view: 'prescriptions' },
                { name: 'Suppliers', icon: <IconTruck />, view: 'suppliers' },
                { name: 'Staff', icon: <IconUsers />, view: 'staff' },
                { name: 'Expenses', icon: <IconReceipt />, view: 'expenses' },
                { name: 'Finances', icon: <IconDollarSign />, view: 'finances' },
                { name: 'Reports', icon: <IconActivity />, view: 'reports' },
            ],
            [Role.MANAGER]: [
                { name: 'Dashboard', icon: <IconHome />, view: 'dashboard' },
                { name: 'POS', icon: <IconShoppingCart />, view: 'pos' },
                { name: 'Medicines', icon: <IconPill />, view: 'medicines' },
                { name: 'Prescriptions', icon: <IconFileText />, view: 'prescriptions' },
                { name: 'Suppliers', icon: <IconTruck />, view: 'suppliers' },
                { name: 'Expenses', icon: <IconReceipt />, view: 'expenses' },
                { name: 'Reports', icon: <IconActivity />, view: 'reports' },
            ],
            [Role.CASHIER]: [
                { name: 'Dashboard', icon: <IconHome />, view: 'dashboard' },
                { name: 'POS', icon: <IconShoppingCart />, view: 'pos' },
                { name: 'Returns', icon: <IconCalculator />, view: 'returns' },
            ],
        };
        
        if (isPlatformStaff) return platformItems;
        // Fix: Check if user.role exists in pharmacyItems before accessing.
        return pharmacyItems[user.role] || [];

    }, [isPlatformStaff, user.role]);


    const renderView = () => {
        // Platform Views
        if(isPlatformStaff) {
            switch(currentView) {
                case 'dashboard': return <SADashboard navigateTo={navigateTo} />;
                case 'pharmacies': return <SAPharmacies initialFilter={viewParams.filter} />;
                case 'billing': return <SABilling />;
                case 'support': return <SASupport navigateTo={navigateTo} />;
                case 'support_ticket_details': return <SupportTicketDetails ticketId={viewParams.ticketId} user={user} navigateTo={navigateTo} />;
                case 'staff': return <SAStaff />;
                case 'system_health': return <SystemHealth />;
                case 'user_activity': return <UserActivity />;
                // case 'communication': return <Communication />;
                case 'settings': return <Settings />;
                default: return <SADashboard navigateTo={navigateTo} />;
            }
        }
        
        // Pharmacy Views
        switch(currentView) {
            case 'dashboard': 
                if (isCashier) return <CashierDashboard user={user} navigateTo={navigateTo} />;
                return <PharmacyDashboard user={user} navigateTo={navigateTo} />;
            case 'reports': return <Reports user={user} />;
            case 'settings': return <PharmacySettings user={user} pharmacy={pharmacy} onUpdate={setPharmacy} />;
            case 'pos': return <POS user={user} />;
            // case 'medicines': return <Medicines user={user} />;
            case 'prescriptions': return <Prescriptions user={user} />;
            case 'staff': return <PharmacyStaff user={user} />;
            case 'suppliers': return <Suppliers user={user} />;
            case 'expenses': return <Expenses user={user} />;
            // case 'finances': return <PharmacyFinances user={user} />;
            case 'my_support_tickets': return <MySupportTickets user={user} navigateTo={navigateTo} />;
            case 'support_ticket_details': return <SupportTicketDetails ticketId={viewParams.ticketId} user={user} navigateTo={navigateTo} />;
            // case 'my_subscription': return <MySubscription user={user} />;
            case 'returns': return <Returns user={user} />;
            default: 
                 if (isCashier) return <CashierDashboard user={user} navigateTo={navigateTo} />;
                return <PharmacyDashboard user={user} navigateTo={navigateTo} />;
        }
    };
    
    const SideNav = ({ items }: { items: { name: string; icon: ReactElement; view: string }[] }) => (
        <nav className="flex-1 space-y-2 px-2 pb-4">
            {items.map(item => (
                <a
                    key={item.name}
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigateTo(item.view); }}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                        currentView === item.view
                            ? 'bg-indigo-700 text-white'
                            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                >
                    {React.cloneElement(item.icon, { className: `mr-3 h-5 w-5 text-indigo-300 ${currentView === item.view ? 'text-white' : 'group-hover:text-indigo-200'}` })}
                    {item.name}
                </a>
            ))}
        </nav>
    );

    return (
        <div>
             {auth.originalUser && (
                <div className="bg-yellow-400 text-black text-center py-2 px-4 text-sm font-semibold flex items-center justify-center">
                    <IconAlertTriangle className="w-5 h-5 mr-2" />
                    You are impersonating {user.name} ({user.role}) from {pharmacy?.name}.
                    <button onClick={stopImpersonating} className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md text-xs">
                        Return to Super Admin
                    </button>
                </div>
            )}
            <div className="flex h-screen">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex md:flex-shrink-0">
                    <div className="flex flex-col w-64 bg-indigo-800">
                        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-900">
                            {brandingSettings?.logoUrl ? <img className="h-8 w-auto" src={brandingSettings.logoUrl} alt="Logo" /> : <IconPill className="h-8 w-8 text-white" />}
                            <span className="text-white text-lg font-semibold ml-2">{brandingSettings?.name || 'SecurePharm'}</span>
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto">
                           <SideNav items={navItems} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    {/* Top Bar */}
                    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-slate-800 shadow dark:border-b dark:border-slate-700">
                         <button onClick={() => setIsMobileMenuOpen(true)} className="px-4 border-r border-slate-200 dark:border-slate-700 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
                            <IconMenu className="h-6 w-6" />
                        </button>
                        <div className="flex-1 px-4 flex justify-between items-center">
                            <div className="flex-1 flex">
                                {/* Search bar can go here */}
                            </div>
                            <div className="ml-4 flex items-center md:ml-6">
                                <DigitalClock className="hidden sm:block text-slate-500 dark:text-slate-400 mr-4" />
                                <button onClick={toggleTheme} className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800">
                                    {theme === 'dark' ? <IconSun className="h-6 w-6" /> : <IconMoon className="h-6 w-6" />}
                                </button>
                                <div className="relative">
                                    <button onClick={() => setIsNotificationsOpen(o => !o)} className="p-1 mx-2 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800">
                                        <IconBell className="h-6 w-6" />
                                        {notifications.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>}
                                    </button>
                                    {isNotificationsOpen && <NotificationPanel notifications={notifications} onClose={() => setIsNotificationsOpen(false)} navigateTo={navigateTo} />}
                                </div>
                                
                                {/* Profile dropdown */}
                                <div className="ml-3 relative group">
                                    <button className="max-w-xs bg-white dark:bg-slate-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800">
                                        <img className="h-8 w-8 rounded-full" src={user.pictureUrl || 'https://i.pravatar.cc/150'} alt="User" />
                                    </button>
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="px-4 py-2 border-b dark:border-slate-600">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                                        </div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('settings', { tab: 'profile' }); }} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600">My Profile</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); auth.logout(); }} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600">Sign out</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                        <div className="py-6 px-4 sm:px-6 lg:px-8">
                            {renderView()}
                        </div>
                    </main>
                </div>
                
                 {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="fixed inset-0 flex z-40">
                             <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
                             <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <IconX className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex-shrink-0 flex items-center px-4">
                                         {brandingSettings?.logoUrl ? <img className="h-8 w-auto" src={brandingSettings.logoUrl} alt="Logo" /> : <IconPill className="h-8 w-8 text-white" />}
                                         <span className="text-white text-lg font-semibold ml-2">{brandingSettings?.name || 'SecurePharm'}</span>
                                    </div>
                                    <SideNav items={navItems} />
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-14"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
// --- END: MAIN DASHBOARD COMPONENT ---
// Re-export as default
export default Dashboard;

// --- Reports components ---
const Reports: React.FC<{ user: User }> = ({ user }) => {
    const [activeReport, setActiveReport] = useState('detailed_sales');

    const renderReport = () => {
        switch (activeReport) {
            case 'detailed_sales': return <DetailedSalesReport user={user} />;
            default: return <p>Select a report to view.</p>;
        }
    };
    
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Reports</h1>
             <Card>
                <div className="flex space-x-2 border-b pb-2 mb-4 dark:border-slate-700">
                    <TabButton active={activeReport === 'detailed_sales'} onClick={() => setActiveReport('detailed_sales')}>Detailed Sales</TabButton>
                </div>
                {renderReport()}
            </Card>
        </div>
    );
};

// --- Settings components ---
const PharmacySettings: React.FC<{ user: User, pharmacy: Pharmacy | null, onUpdate: (pharmacy: Pharmacy) => void }> = ({ user, pharmacy, onUpdate }) => {
     const [activeTab, setActiveTab] = useState( 'profile' );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
             <div className="flex space-x-2 border-b dark:border-slate-700">
                <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>My Profile</TabButton>
                {user.role === Role.PHARMACY_ADMIN && <TabButton active={activeTab === 'pharmacy_info'} onClick={() => setActiveTab('pharmacy_info')}>Pharmacy Information</TabButton>}
             </div>
            {activeTab === 'profile' && <UserProfileSettings user={user} />}
            {activeTab === 'pharmacy_info' && pharmacy && <PharmacyInformationSettings pharmacy={pharmacy} onUpdate={onUpdate} />}
        </div>
    )
}

const PharmacyInformationSettings: React.FC<{ pharmacy: Pharmacy, onUpdate: (pharmacy: Pharmacy) => void }> = ({ pharmacy, onUpdate }) => {
    const [formData, setFormData] = useState(pharmacy);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const updatedPharmacy = await api.updatePharmacyInformation(pharmacy.id, formData);
        onUpdate(updatedPharmacy);
        setSuccess('Your changes have been submitted for approval.');
        setIsSubmitting(false);
    };

    return (
        <SettingsFormWrapper title="Pharmacy Information" subtitle="Manage your pharmacy's details. Changes require admin approval.">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                {success && <div className="p-3 bg-green-100 text-green-700 rounded-md dark:bg-green-900/30 dark:text-green-300">{success}</div>}
                 {pharmacy.updateStatus === 'rejected' && pharmacy.rejectionReason && (
                    <div className="p-3 bg-red-100 text-red-800 rounded-md dark:bg-red-900/30 dark:text-red-300">
                        <h4 className="font-bold">Previous update was rejected</h4>
                        <p>Reason: {pharmacy.rejectionReason}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="name">Pharmacy Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} /></div>
                    <div><Label htmlFor="contact">Contact Phone</Label><Input id="contact" name="contact" value={formData.contact} onChange={handleChange} /></div>
                    <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} /></div>
                    <div><Label htmlFor="country">Country</Label><Input id="country" name="country" value={formData.country} onChange={handleChange} /></div>
                    <div><Label htmlFor="currency">Currency (e.g., NGN)</Label><Input id="currency" name="currency" value={formData.currency} onChange={handleChange} /></div>
                </div>
                 <Button type="submit" disabled={isSubmitting || pharmacy.updateStatus === 'pending_approval'}>
                    {pharmacy.updateStatus === 'pending_approval' ? 'Pending Approval' : (isSubmitting ? 'Submitting...' : 'Request Update')}
                </Button>
            </form>
        </SettingsFormWrapper>
    )
};

const POS: React.FC<{ user: User }> = ({ user }) => { return <div>POS Component</div> }
const Prescriptions: React.FC<{ user: User }> = ({ user }) => { return <div>Prescriptions Component</div> }

const PharmacyStaff: React.FC<{ user: User }> = ({ user }) => {
     const [staff, setStaff] = useState<User[]>([]);
     
     useEffect(() => {
        if (user.pharmacyId) {
            api.getUsersForPharmacy(user.pharmacyId).then(setStaff);
        }
     }, [user.pharmacyId]);

    const handleSave = async (staffMember: Omit<User, 'id' | 'status'>, password?: string) => {
        if (!user.pharmacyId) return;
        // Logic to add/update staff
        // Note: This is simplified. A real app would have an edit state.
        await api.addPharmacyStaff({ ...staffMember, password: password || '12345', pharmacyId: user.pharmacyId });
        api.getUsersForPharmacy(user.pharmacyId).then(setStaff);
    };

     return (
        <div>
            Staff management for pharmacy.
            {/* The modal and table would go here */}
        </div>
     )
}

const Suppliers: React.FC<{ user: User }> = ({ user }) => { return <div>Suppliers Component</div> }
const Expenses: React.FC<{ user: User }> = ({ user }) => { return <div>Expenses Component</div> }
const MySupportTickets: React.FC<{ user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, navigateTo }) => { 
    return <div>MySupportTickets Component</div> 
}
const Returns: React.FC<{ user: User }> = ({ user }) => { return <div>Returns Component</div> }

const PrintableReceipt: React.FC<{ sale: Sale; pharmacy: Pharmacy }> = ({ sale, pharmacy }) => {
    return (
        <div className="text-black font-sans p-2" style={{ width: '80mm', fontSize: '12px' }}>
            <div className="text-center">
                {pharmacy.logo && <img src={pharmacy.logo} alt="Logo" className="h-12 mx-auto mb-2" />}
                <h2 className="text-lg font-bold">{pharmacy.name}</h2>
                <p className="text-xs">{pharmacy.address}</p>
                <p className="text-xs">{pharmacy.contact}</p>
            </div>

            <hr className="my-2 border-t border-dashed border-black" />

            <div className="text-xs">
                <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span>{sale.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatReceiptDateTime(sale.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{sale.staffName}</span>
                </div>
                <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{sale.customerName}</span>
                </div>
            </div>

            <hr className="my-2 border-t border-dashed border-black" />

            <div>
                <div className="grid grid-cols-12 font-bold text-xs">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>
                {sale.items.map(item => (
                    <div key={item.medicineId} className="grid grid-cols-12 my-1 text-xs">
                        <div className="col-span-5">{item.medicineName}</div>
                        <div className="col-span-2 text-center">{item.quantity}</div>
                        <div className="col-span-2 text-right">{item.unitPrice.toFixed(2)}</div>
                        <div className="col-span-3 text-right">{item.total.toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <hr className="my-2 border-t border-dashed border-black" />

            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{sale.items.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>{sale.items.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-1">
                    <span>Total:</span>
                    <span>{formatCurrency(sale.totalAmount, pharmacy.currency)}</span>
                </div>
            </div>

             <hr className="my-2 border-t border-dashed border-black" />

            <div className="text-xs">
                <h3 className="font-bold text-center mb-1">Payment Details</h3>
                {sale.payments.map((p, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{p.method}:</span>
                        <span>{formatCurrency(p.amount, pharmacy.currency)}</span>
                    </div>
                ))}
            </div>

            <div className="text-center mt-4 text-xs">
                <p>Thank you for your patronage!</p>
                <p className="text-xs mt-1">Powered by SecurePharm</p>
            </div>
        </div>
    );
};
