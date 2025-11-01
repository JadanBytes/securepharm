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

const SAUserActivity: React.FC = () => {
    const [logs, setLogs] = useState<UserActivityLog[]>([]);
    const [geoCache, setGeoCache] = useState<Record<string, IpGeolocationData | null>>({});
    const [hoveredIp, setHoveredIp] = useState<string | null>(null);

    useEffect(() => {
        api.getUserActivityLogs().then(setLogs);
    }, []);

    const handleIpHover = (ipAddress: string) => {
        setHoveredIp(ipAddress);
        if (!geoCache.hasOwnProperty(ipAddress)) {
            // Fetch only if not in cache
            api.getIpGeolocation(ipAddress).then(data => {
                setGeoCache(prev => ({...prev, [ipAddress]: data}));
            });
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">User Activity Logs</h2>
            <Table headers={['Timestamp', 'User', 'Role', 'Action', 'IP Address']}>
                {logs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>{log.userRole}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell 
                            className="relative"
                            onMouseEnter={() => handleIpHover(log.ipAddress)}
                            onMouseLeave={() => setHoveredIp(null)}
                        >
                            <span className="cursor-pointer underline decoration-dotted">{log.ipAddress}</span>
                            {hoveredIp === log.ipAddress && geoCache[log.ipAddress] && (
                                <div className="absolute z-10 bottom-full left-0 mb-2 w-max p-2 text-sm bg-slate-800 text-white rounded-md shadow-lg">
                                    {geoCache[log.ipAddress]?.city}, {geoCache[log.ipAddress]?.country}
                                </div>
                            )}
                             {hoveredIp === log.ipAddress && geoCache.hasOwnProperty(log.ipAddress) && geoCache[log.ipAddress] === null && (
                                 <div className="absolute z-10 bottom-full left-0 mb-2 w-max p-2 text-sm bg-slate-800 text-white rounded-md shadow-lg">
                                     Geolocation not available.
                                 </div>
                             )}
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
        </Card>
    );
};

const SupportTicketDetails: React.FC<{ ticketId: string, user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ ticketId, user, navigateTo }) => {
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [platformStaff, setPlatformStaff] = useState<User[]>([]);

    const refreshTicket = useCallback(() => {
        api.getTicketById(ticketId).then(setTicket);
    }, [ticketId]);

    useEffect(() => {
        refreshTicket();
        if (user.role === Role.SUPER_ADMIN || user.role === Role.PLATFORM_SUPPORT) {
            api.getPlatformStaff().then(setPlatformStaff);
        }
    }, [refreshTicket, user.role]);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        setIsSubmitting(true);
        try {
            await api.replyToTicket(ticketId, { message: replyMessage, user });
            setReplyMessage('');
            refreshTicket();
        } catch (error) {
            console.error("Failed to submit reply:", error);
            alert("Error submitting reply.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleStatusChange = async (status: SupportTicketStatus) => {
        if (!ticket) return;
        try {
            const updatedTicket = await api.updateTicketStatus(ticket.id, status);
            setTicket(updatedTicket);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Error updating status.");
        }
    };

    const handleAssignStaff = async (staffId: string) => {
        if (!ticket) return;
        const staffMember = platformStaff.find(s => s.id === staffId);
        if (staffMember) {
            try {
                const updatedTicket = await api.assignTicket(ticket.id, staffMember);
                setTicket(updatedTicket);
            } catch (error) {
                console.error("Failed to assign staff:", error);
                alert("Error assigning staff.");
            }
        }
    };

    if (!ticket) {
        return <Card>Loading ticket details...</Card>;
    }

    const canManageTicket = user.role === Role.SUPER_ADMIN || user.role === Role.PLATFORM_SUPPORT;

    return (
        <div className="space-y-6">
            <Button variant="secondary" onClick={() => navigateTo(canManageTicket ? 'support' : 'my_support_tickets')}>&larr; Back to Tickets</Button>
            
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                        <p className="text-slate-500">From: {ticket.pharmacyName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                    </div>
                </div>

                {canManageTicket && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center space-x-4">
                        <div>
                            <Label htmlFor="ticket-status">Change Status</Label>
                            <Select id="ticket-status" value={ticket.status} onChange={e => handleStatusChange(e.target.value as SupportTicketStatus)}>
                                <option value={SupportTicketStatus.OPEN}>Open</option>
                                <option value={SupportTicketStatus.IN_PROGRESS}>In Progress</option>
                                <option value={SupportTicketStatus.CLOSED}>Closed</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="ticket-assign">Assign To</Label>
                             <Select id="ticket-assign" value={ticket.assignedStaffId || ''} onChange={e => handleAssignStaff(e.target.value)}>
                                <option value="">Unassigned</option>
                                {platformStaff.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
                            </Select>
                        </div>
                         <div className="flex-grow">
                             <p className="text-sm text-slate-500">Assigned to: <span className="font-semibold">{ticket.assignedStaffName || 'N/A'}</span></p>
                        </div>
                    </div>
                )}
            </Card>

            <div className="space-y-4">
                {ticket.replies.map((reply) => (
                    <Card key={reply.id} className={reply.userId === user.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{reply.userName} <span className="text-xs text-slate-500 font-normal">({reply.userRole})</span></p>
                            <p className="text-xs text-slate-400">{formatDateTime(reply.createdAt)}</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{reply.message}</p>
                    </Card>
                ))}
            </div>

            {ticket.status !== SupportTicketStatus.CLOSED && (
                <Card>
                    <h3 className="text-lg font-bold mb-2">Add a Reply</h3>
                    <form onSubmit={handleReplySubmit}>
                        <textarea
                            value={replyMessage}
                            onChange={e => setReplyMessage(e.target.value)}
                            rows={5}
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Type your message here..."
                        />
                        <div className="mt-2 text-right">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Reply'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

const UnderConstruction: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <IconTool className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Under Construction</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The "{title}" page is currently being built. Please check back later!</p>
    </div>
);

const PharmacyDashboard: React.FC<{ user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, navigateTo }) => {
    const { currentUserIP } = useApp();
    const [stats, setStats] = useState<any>(null);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    useEffect(() => {
        if (user.pharmacyId) {
            api.getPharmacyDashboardStats(user.pharmacyId).then(setStats);
            api.getPharmacyById(user.pharmacyId).then(p => p && setPharmacy(p));
            api.getRecentPharmacyActivity(user.pharmacyId).then(setRecentActivity);
        }
    }, [user.pharmacyId]);

    if (!stats || !pharmacy) return <Card>Loading dashboard...</Card>;
    
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                        <p className="text-slate-500 dark:text-slate-400">Here's what's happening at {pharmacy.name} today.</p>
                    </div>
                     <div className="text-right mt-2 sm:mt-0">
                         <DigitalClock className="text-2xl text-slate-700 dark:text-slate-300" />
                         <p className="text-xs text-slate-400">Your IP: {currentUserIP}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <FinancialStatCard title="Today's Sales" value={formatCurrency(stats.todaySales, pharmacy.currency)} icon={<IconTrendingUp className="w-6 h-6" />} color="green" />
                 <FinancialStatCard title="Total Revenue" value={formatCurrency(stats.revenue, pharmacy.currency)} icon={<IconDollarSign className="w-6 h-6" />} color="blue" />
                 <FinancialStatCard title="Total Expenses" value={formatCurrency(stats.expenses, pharmacy.currency)} icon={<IconTrendingDown className="w-6 h-6" />} color="orange" />
                 <FinancialStatCard title="Receivables" value={formatCurrency(stats.receivable, pharmacy.currency)} icon={<IconCreditCard className="w-6 h-6" />} color="red" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard title="Medicines" value={stats.medicines} icon={<IconPill className="w-6 h-6" />} color="blue" onClick={() => navigateTo('medicines')} />
                <DashboardStatCard title="Out of Stock" value={stats.outOfStock} icon={<IconXCircle className="w-6 h-6" />} color="red" onClick={() => navigateTo('medicines', { medicinesFilter: 'out_of_stock' })} />
                <DashboardStatCard title="Expired" value={stats.expired} icon={<IconAlertTriangle className="w-6 h-6" />} color="orange" onClick={() => navigateTo('medicines', { medicinesFilter: 'expired' })} />
                <DashboardStatCard title="Suppliers" value={stats.suppliers} icon={<IconTruck className="w-6 h-6" />} color="yellow" onClick={() => navigateTo('suppliers')} />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                     <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                     {recentActivity.length > 0 ? (
                         <div className="space-y-3">
                             {recentActivity.map(activity => (
                                 <div key={activity.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                     <div className="flex items-center">
                                         <div className={`p-2 rounded-full mr-3 ${activity.type === 'Sale' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                             {activity.type === 'Sale' ? <IconShoppingCart className="w-4 h-4" /> : <IconReceipt className="w-4 h-4" />}
                                         </div>
                                         <div>
                                             <p className="font-medium text-slate-800 dark:text-slate-200">{activity.description}</p>
                                             <p className="text-xs text-slate-400">{formatDateTime(activity.createdAt)}</p>
                                         </div>
                                     </div>
                                     <p className={`font-semibold ${activity.type === 'Sale' ? 'text-green-600' : 'text-orange-600'}`}>{formatCurrency(activity.amount, pharmacy.currency)}</p>
                                 </div>
                             ))}
                         </div>
                     ) : <p className="text-sm text-slate-500">No recent activity.</p>}
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigateTo('pos')} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            <IconShoppingCart className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="font-semibold text-sm">New Sale</span>
                        </button>
                         <button onClick={() => navigateTo('medicines', { isAdding: true })} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            <IconPill className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="font-semibold text-sm">Add Medicine</span>
                        </button>
                         <button onClick={() => navigateTo('expenses', { isAdding: true })} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            <IconCalculator className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="font-semibold text-sm">Add Expense</span>
                        </button>
                         <button onClick={() => navigateTo('reports')} className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                            <IconFileText className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="font-semibold text-sm">View Reports</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CashierDashboard: React.FC<{ user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, navigateTo }) => {
    const [stats, setStats] = useState<any>(null);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

    useEffect(() => {
        if (user.pharmacyId) {
            api.getCashierDashboardStats(user.pharmacyId, user.id).then(setStats);
            api.getPharmacyById(user.pharmacyId).then(p => p && setPharmacy(p));
        }
    }, [user.pharmacyId, user.id]);

    if (!stats || !pharmacy) return <Card>Loading dashboard...</Card>;

    return (
        <div className="space-y-6">
             <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
                        <p className="text-slate-500 dark:text-slate-400">Branch: {user.branchName}</p>
                    </div>
                    <Button onClick={() => navigateTo('pos')} className="mt-4 sm:mt-0">
                        <IconShoppingCart className="w-5 h-5 mr-2" />
                        Go to POS
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Sales" value={formatCurrency(stats.salesToday, pharmacy.currency)} icon={<IconDollarSign />} color="bg-green-500" />
                <StatCard title="This Week's Sales" value={formatCurrency(stats.salesThisWeek, pharmacy.currency)} icon={<IconCalendar />} color="bg-blue-500" />
                <StatCard title="This Month's Sales" value={formatCurrency(stats.salesThisMonth, pharmacy.currency)} icon={<IconFileText />} color="bg-indigo-500" />
                <StatCard title="This Year's Sales" value={formatCurrency(stats.salesThisYear, pharmacy.currency)} icon={<IconTrendingUp />} color="bg-purple-500" />
            </div>

            <Card>
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="flex space-x-4">
                    <Button onClick={() => navigateTo('pos')}>
                        <IconShoppingCart className="w-5 h-5 mr-2" />
                        New Sale
                    </Button>
                     <Button onClick={() => navigateTo('returns')} variant="secondary">
                        <IconReceipt className="w-5 h-5 mr-2" />
                        Process Return
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// --- START: PHARMACY COMPONENTS (CRUD, POS etc) ---
// Note: Due to file size constraints, these are simplified. A real app would have more robust forms and state management.

const Medicines: React.FC<{ user: User, initialFilter?: string, isAdding?: boolean }> = ({ user, initialFilter, isAdding }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Medicines" />;
};

const POS: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Point of Sale (POS)" />;
};

const Prescriptions: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Prescriptions" />;
};

const Staff: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Staff Management" />;
};

const Suppliers: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Suppliers" />;
};

const Expenses: React.FC<{ user: User, isAdding?: boolean }> = ({ user, isAdding }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Expenses" />;
};

const PharmacyFinances: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Finances" />;
};

const Reports: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Reports" />;
};

const Returns: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="Returns" />;
};

const MySupportTickets: React.FC<{ user: User, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, navigateTo }) => {
   // A fully implemented component would go here
    return <UnderConstruction title="My Support Tickets" />;
};

const MySubscription: React.FC<{ user: User }> = ({ user }) => {
    // A fully implemented component would go here
    return <UnderConstruction title="My Subscription" />;
};

const PharmacySettings: React.FC<{ user: User }> = ({ user }) => {
   // A fully implemented component would go here
    return <UnderConstruction title="Pharmacy Settings" />;
};

// --- START: SUPER ADMIN COMPONENTS (CRUD etc) ---

const SAStaff: React.FC = () => {
   // A fully implemented component would go here
    return <UnderConstruction title="Platform Staff" />;
};

const SACommunication: React.FC = () => {
    // A fully implemented component would go here
    return <UnderConstruction title="Communication" />;
};

// --- END: SUPER ADMIN COMPONENTS ---

const SASystemHealth: React.FC = () => {
    const [stats, setStats] = useState<SystemHealthStats | null>(null);
    const [alerts, setAlerts] = useState<SystemHealthAlert[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        api.getSystemHealthStats().then(setStats);
        api.getSystemHealthAlertsLog().then(setAlerts);
    }, []);

    if (!stats) return <Card>Loading system health...</Card>;
    
    const chartTooltipProps = {
        wrapperStyle: { backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}` },
    };
    const chartAxisProps = { tick: { fill: theme === 'dark' ? '#94a3b8' : '#64748b' } };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="API Status" value={stats.apiStatus} icon={stats.apiStatus === 'Operational' ? <IconCheckCircle /> : <IconAlertTriangle />} color={stats.apiStatus === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'} />
                <StatCard title="Avg. Response Time" value={`${stats.avgResponseTime}ms`} icon={<IconActivity />} />
                <StatCard title="DB Connections" value={stats.dbConnections} icon={<IconServer />} />
                <StatCard title="CPU Usage" value={`${stats.cpuUsage}%`} icon={<IconZap />} />
            </div>

            <Card>
                <h3 className="text-xl font-bold mb-4">Service Status</h3>
                <div className="space-y-2">
                    {stats.services.map(service => (
                        <div key={service.name} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                            <div>
                                <p className="font-semibold">{service.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{service.details}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>{service.status}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="text-xl font-bold mb-4">Response Time (ms)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats.responseTimeData}>
                            <XAxis dataKey="time" {...chartAxisProps} />
                            <YAxis {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">CPU Usage (%)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats.cpuUsageData}>
                            <XAxis dataKey="time" {...chartAxisProps} />
                            <YAxis {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps} />
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

const SASettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('branding');
    const [settings, setSettings] = useState<PlatformSettings | null>(null);

    useEffect(() => {
        api.getPlatformSettings().then(setSettings);
    }, []);

    const updateSettings = <T extends keyof PlatformSettings>(key: T, value: PlatformSettings[T]) => {
        setSettings(prev => prev ? { ...prev, [key]: value } : null);
    };

    if (!settings) return <Card>Loading settings...</Card>;

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex space-x-2 border-b dark:border-slate-700">
                    <TabButton active={activeTab === 'branding'} onClick={() => setActiveTab('branding')}>Branding</TabButton>
                    <TabButton active={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')}>Workflow</TabButton>
                    <TabButton active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')}>Maintenance</TabButton>
                    <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>Payments</TabButton>
                    <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')}>Security</TabButton>
                    <TabButton active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')}>Permissions</TabButton>
                </div>
                <div className="pt-6">
                    {activeTab === 'branding' && <BrandingSettings settings={settings.branding} onUpdate={(s) => updateSettings('branding', s)} />}
                    {activeTab === 'workflow' && <WorkflowSettings settings={settings.workflow} onUpdate={(s) => updateSettings('workflow', s)} />}
                    {activeTab === 'maintenance' && <MaintenanceSettings settings={settings.maintenance} onUpdate={(s) => updateSettings('maintenance', s)} />}
                    {activeTab === 'payments' && <PaymentSettings accounts={settings.manualBankAccounts} onUpdate={(a) => updateSettings('manualBankAccounts', a)} />}
                    {activeTab === 'security' && <SecuritySettings ipBlacklist={settings.ipBlacklist} ipApi={settings.ipApi} onUpdateBlacklist={(l) => updateSettings('ipBlacklist', l)} onUpdateIpApi={(s) => updateSettings('ipApi', s)} />}
                    {activeTab === 'permissions' && <PermissionsSettings />}
                </div>
            </Card>
        </div>
    );
};

const BrandingSettings: React.FC<{ settings: PlatformBranding, onUpdate: (s: PlatformBranding) => void }> = ({ settings, onUpdate }) => {
    const [formData, setFormData] = useState(settings);
    
    const handleSave = async () => {
        await api.updateBrandingSettings(formData);
        onUpdate(formData);
        // This is a mock; a real app would prompt a reload to see color changes.
        alert("Settings saved! Reload the page to see color changes.");
    };

    return (
        <SettingsFormWrapper title="Branding" subtitle="Customize the look and feel of the platform.">
             <div className="space-y-4 max-w-lg">
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <Input value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} type="color" />
                <Button onClick={handleSave}>Save Branding</Button>
            </div>
        </SettingsFormWrapper>
    );
};
const WorkflowSettings: React.FC<{ settings: PlatformWorkflow, onUpdate: (s: PlatformWorkflow) => void }> = ({ settings, onUpdate }) => {
    const [formData, setFormData] = useState(settings);
    
    const handleSave = async () => {
        await api.updateWorkflowSettings(formData);
        onUpdate(formData);
    };

    return (
        <SettingsFormWrapper title="Workflow" subtitle="Automate platform actions and approval processes.">
            <div className="space-y-4 max-w-lg">
                <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.requireApprovalForBankTransfer} onChange={e => setFormData({...formData, requireApprovalForBankTransfer: e.target.checked})} /> <span>Require approval for bank transfer payments</span></label>
                <Button onClick={handleSave}>Save Workflow</Button>
            </div>
        </SettingsFormWrapper>
    );
};
const MaintenanceSettings: React.FC<{ settings: PlatformMaintenance, onUpdate: (s: PlatformMaintenance) => void }> = ({ settings, onUpdate }) => {
    const [formData, setFormData] = useState(settings);

    const handleSave = async () => {
        await api.updateMaintenanceSettings(formData);
        onUpdate(formData);
    };
    
    return (
        <SettingsFormWrapper title="Maintenance Mode" subtitle="Take the platform offline for maintenance. Super Admins can still log in.">
            <div className="space-y-4 max-w-lg">
                <label className="flex items-center space-x-2"><input type="checkbox" checked={formData.isEnabled} onChange={e => setFormData({...formData, isEnabled: e.target.checked})} /> <span>Enable Maintenance Mode</span></label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" rows={4}></textarea>
                <Button onClick={handleSave} variant={formData.isEnabled ? 'danger' : 'primary'}>Save Maintenance Settings</Button>
            </div>
        </SettingsFormWrapper>
    );
};
const PaymentSettings: React.FC<{ accounts: BankAccount[], onUpdate: (a: BankAccount[]) => void }> = ({ accounts, onUpdate }) => {
    return <SettingsFormWrapper title="Payment Settings" subtitle="Configure manual payment methods.">...</SettingsFormWrapper>;
};
const SecuritySettings: React.FC<{ ipBlacklist: BlockedIP[], ipApi: IpApiSettings, onUpdateBlacklist: (l: BlockedIP[]) => void, onUpdateIpApi: (s: IpApiSettings) => void }> = ({ ipBlacklist, ipApi, onUpdateBlacklist, onUpdateIpApi }) => {
    return <SettingsFormWrapper title="Security" subtitle="Manage IP blocking and other security features.">...</SettingsFormWrapper>;
};
const PermissionsSettings: React.FC = () => {
    return <SettingsFormWrapper title="Role Permissions" subtitle="Define what each role can see and do.">...</SettingsFormWrapper>;
};
// --- END: SUPER ADMIN COMPONENTS ---

// --- Main Dashboard Component ---
type DashboardProps = {
  user: User;
  brandingSettings?: PlatformBranding | null;
};

// Fix: The Dashboard component must be a default export to be used in App.tsx without curly braces.
const Dashboard: React.FC<DashboardProps> = ({ user, brandingSettings }) => {
    const { logout, originalUser, stopImpersonating } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [view, setView] = useState('dashboard');
    const [viewParams, setViewParams] = useState<Record<string, any>>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

    useEffect(() => {
        if (user.pharmacyId) {
            api.getPharmacyById(user.pharmacyId).then(p => p && setPharmacy(p));
        }
    }, [user.pharmacyId]);

    const navigateTo = useCallback((newView: string, params: Record<string, any> = {}) => {
        setView(newView);
        setViewParams(params);
        setIsSidebarOpen(false); // Close sidebar on navigation
    }, []);
    
    const renderView = () => {
        switch (view) {
            case 'dashboard':
                if (user.role === Role.SUPER_ADMIN) return <SADashboard navigateTo={navigateTo} />;
                if (user.role === Role.CASHIER) return <CashierDashboard user={user} navigateTo={navigateTo} />;
                return <PharmacyDashboard user={user} navigateTo={navigateTo} />;
            
            // Pharmacy Views
            case 'medicines': return <Medicines user={user} initialFilter={viewParams.medicinesFilter} isAdding={viewParams.isAdding} />;
            case 'pos': return <POS user={user} />;
            case 'prescriptions': return <Prescriptions user={user} />;
            case 'staff': return <Staff user={user} />;
            case 'suppliers': return <Suppliers user={user} />;
            case 'expenses': return <Expenses user={user} isAdding={viewParams.isAdding} />;
            case 'finances': return <PharmacyFinances user={user} />;
            case 'reports': return <Reports user={user} />;
            case 'returns': return <Returns user={user} />;
            case 'my_support_tickets': return <MySupportTickets user={user} navigateTo={navigateTo} />;
            case 'my_subscription': return <MySubscription user={user} />;
            
            // Super Admin Views
            case 'pharmacies': return <SAPharmacies initialFilter={viewParams.filter} />;
            case 'billing': return <SABilling />;
            case 'support': return <SASupport navigateTo={navigateTo} />;
            case 'sa_staff': return <SAStaff />;
            case 'communication': return <SACommunication />;
            case 'user_activity': return <SAUserActivity />;
            case 'system_health': return <SASystemHealth />;
            case 'platform_settings': return <SASettings />;
            
            // Shared
            case 'support_ticket_details': return <SupportTicketDetails ticketId={viewParams.ticketId} user={user} navigateTo={navigateTo} />;
            case 'settings':
                if(user.pharmacyId) return <PharmacySettings user={user}/>;
                return <UserProfileSettings user={user} />;

            default: return <div>Page not found</div>;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar user={user} pharmacy={pharmacy} navigateTo={navigateTo} activeView={view} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} brandingSettings={brandingSettings} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} navigateTo={navigateTo} />
                {originalUser && (
                    <div className="bg-yellow-400 text-black p-2 text-center text-sm font-semibold flex justify-center items-center">
                        <IconEye className="w-4 h-4 mr-2" />
                        You are impersonating {user.name}. 
                        <button onClick={stopImpersonating} className="ml-2 underline font-bold">Return to my account</button>
                    </div>
                )}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

type SidebarProps = {
    user: User,
    pharmacy: Pharmacy | null,
    navigateTo: (view: string) => void,
    activeView: string,
    isSidebarOpen: boolean,
    setIsSidebarOpen: (isOpen: boolean) => void
};

const Sidebar: React.FC<SidebarProps> = ({ user, pharmacy, navigateTo, activeView, isSidebarOpen, setIsSidebarOpen }) => {
    const isSuperAdmin = user.role === Role.SUPER_ADMIN;
    
    const navItems = isSuperAdmin ? [
        { view: 'dashboard', label: 'Dashboard', icon: <IconHome /> },
        { view: 'pharmacies', label: 'Pharmacies', icon: <IconBuilding /> },
        { view: 'billing', label: 'Billing', icon: <IconCreditCard /> },
        { view: 'support', label: 'Support Tickets', icon: <IconLifeBuoy /> },
        { view: 'user_activity', label: 'User Activity', icon: <IconUsers /> },
        { view: 'sa_staff', label: 'Platform Staff', icon: <IconShieldCheck /> },
        { view: 'communication', label: 'Communication', icon: <IconMegaphone /> },
        { view: 'system_health', label: 'System Health', icon: <IconServer /> },
        { view: 'platform_settings', label: 'Platform Settings', icon: <IconSettings /> },
    ] : [
        { view: 'dashboard', label: 'Dashboard', icon: <IconHome /> },
        { view: 'pos', label: 'POS', icon: <IconShoppingCart /> },
        { view: 'medicines', label: 'Medicines', icon: <IconPill /> },
        { view: 'prescriptions', label: 'Prescriptions', icon: <IconClipboardList /> },
        { view: 'staff', label: 'Staff', icon: <IconUsers /> },
        { view: 'suppliers', label: 'Suppliers', icon: <IconTruck /> },
        { view: 'expenses', label: 'Expenses', icon: <IconReceipt /> },
        { view: 'finances', label: 'Finances', icon: <IconDollarSign /> },
        { view: 'reports', label: 'Reports', icon: <IconFileText /> },
        { view: 'returns', label: 'Returns', icon: <IconReceipt /> },
        { view: 'my_subscription', label: 'Subscription', icon: <IconCreditCard /> },
        { view: 'my_support_tickets', label: 'Support', icon: <IconLifeBuoy /> },
    ];
    
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`absolute lg:relative inset-y-0 left-0 bg-white dark:bg-slate-800 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col border-r dark:border-slate-700`}>
                <div className="flex items-center justify-center h-20 border-b dark:border-slate-700 flex-shrink-0 px-4">
                     <img src={pharmacy?.logo || 'https://img.logoipsum.com/289.svg'} alt="Logo" className="h-10 w-auto" />
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.view}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); navigateTo(item.view); }}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                        activeView === item.view
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

type HeaderProps = {
    user: User,
    brandingSettings?: PlatformBranding | null,
    onToggleSidebar: () => void,
    navigateTo: (view: string) => void,
};

const Header: React.FC<HeaderProps> = ({ user, brandingSettings, onToggleSidebar, navigateTo }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Mock notifications
        setNotifications([
            { id: '1', type: 'low_stock', message: 'Paracetamol is running low.', medicineName: 'Paracetamol', createdAt: new Date().toISOString() },
            { id: '2', type: 'near_expiry', message: 'Amoxicillin is expiring soon.', medicineName: 'Amoxicillin', createdAt: new Date().toISOString() },
            { id: '3', type: 'task_overdue', message: 'Monthly report is overdue.', taskId: 'task-2', createdAt: new Date().toISOString() }
        ]);
    }, []);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <header className="flex-shrink-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                <button onClick={onToggleSidebar} className="lg:hidden text-slate-500 dark:text-slate-400">
                    <IconMenu className="w-6 h-6" />
                </button>
                <div className="hidden lg:block">
                    {/* Could put breadcrumbs here */}
                </div>
                <div className="flex items-center space-x-4">
                     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {theme === 'light' ? <IconMoon className="w-5 h-5" /> : <IconSun className="w-5 h-5" />}
                    </button>
                    <div className="relative" ref={notificationRef}>
                        <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <IconBell className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                            {notifications.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>}
                        </button>
                        {isNotificationsOpen && <NotificationPanel notifications={notifications} onClose={() => setIsNotificationsOpen(false)} navigateTo={navigateTo} />}
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                            <img src={user.pictureUrl || 'https://i.pravatar.cc/150'} alt={user.name} className="h-9 w-9 rounded-full" />
                            <div className="hidden sm:block text-left">
                                <span className="font-semibold text-sm">{user.name}</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400">{user.role}</span>
                            </div>
                            <IconChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border dark:border-slate-700 z-50">
                                <a href="#" onClick={(e) => {e.preventDefault(); navigateTo('settings'); setIsDropdownOpen(false);}} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Sign out</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Dashboard;