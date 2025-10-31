

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
                <h2 className="text-xl font-bold">Closed Tickets</h2>
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
            </Card>
        </div>
    );
};

const SASupportTicketDetails: React.FC<{ ticketId: string; navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ ticketId, navigateTo }) => {
    const { user } = useAuth();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [staff, setStaff] = useState<User[]>([]);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const refreshTicket = useCallback(() => {
        api.getTicketById(ticketId).then(setTicket);
    }, [ticketId]);

    useEffect(() => {
        refreshTicket();
        api.getPlatformStaff().then(setStaff);
    }, [refreshTicket]);

    if (!ticket || !user) return <Card>Loading ticket...</Card>;

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;
        setIsSubmitting(true);
        await api.replyToTicket(ticket.id, { message: replyMessage, user });
        setReplyMessage('');
        refreshTicket();
        setIsSubmitting(false);
    };
    
    const handleUpdateStatus = async (status: SupportTicketStatus) => {
        await api.updateTicketStatus(ticket.id, status);
        refreshTicket();
    };

    const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const staffId = e.target.value;
        const selectedStaff = staff.find(s => s.id === staffId);
        if (selectedStaff) {
            await api.assignTicket(ticket.id, selectedStaff);
            refreshTicket();
        }
    };


    return (
        <div className="space-y-6">
            <Button variant="secondary" onClick={() => navigateTo('support')}>&larr; Back to All Tickets</Button>
            <Card>
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{ticket.subject}</h2>
                        <p className="text-slate-500 dark:text-slate-400">From {ticket.pharmacyName}</p>
                        <div className="flex items-center space-x-2 mt-2">
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTicketPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                         <Select onChange={handleAssign} value={ticket.assignedStaffId || ''} className="w-48">
                            <option value="">Assign to...</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Select>
                        {ticket.status !== SupportTicketStatus.CLOSED && (
                            <Button onClick={() => handleUpdateStatus(SupportTicketStatus.CLOSED)}>Close Ticket</Button>
                        )}
                    </div>
                 </div>
            </Card>

            <div className="space-y-4">
                {ticket.replies.map(reply => (
                    <Card key={reply.id} className={`${reply.userRole === Role.SUPER_ADMIN ? 'bg-indigo-50 dark:bg-slate-700/50' : ''}`}>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <p className="font-semibold">{reply.userName} <span className="text-slate-500 text-xs">({reply.userRole})</span></p>
                            <p className="text-slate-400 dark:text-slate-500">{formatDateTime(reply.createdAt)}</p>
                        </div>
                        <p>{reply.message}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <h3 className="text-lg font-bold mb-2">Add a Reply</h3>
                <form onSubmit={handleReply}>
                    <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={5} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Type your response here..."></textarea>
                    <div className="mt-2 text-right">
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Reply'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const SAStaff: React.FC = () => {
    const [staff, setStaff] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);

    const refreshStaff = useCallback(() => {
        api.getPlatformStaff().then(setStaff);
    }, []);

    useEffect(() => {
        refreshStaff();
    }, [refreshStaff]);
    
    const handleEdit = (user: User) => {
        setEditingStaff(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };
    
    const handleSave = async (data: any, isNew: boolean) => {
        if (isNew) {
            await api.addPlatformStaff(data);
        } else {
            // Fix: Destructure password from data to match api.updatePlatformStaff signature and prevent type error.
            const { password, ...staffData } = data;
            await api.updatePlatformStaff(staffData as User, password);
        }
        refreshStaff();
        setIsModalOpen(false);
    };

    const handleStatusToggle = async (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'reactivate' : 'suspend'} ${user.name}?`)) {
            await api.updateUserStatus(user.id, newStatus);
            refreshStaff();
        }
    };


    return (
        <div className="space-y-4">
            <Card>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Platform Staff</h2>
                    <Button onClick={handleAdd}><IconPlusCircle className="mr-2 h-5 w-5"/> Add Staff</Button>
                </div>
            </Card>

            <Table headers={['Name', 'Email', 'Role', 'Status', 'Actions']}>
                {staff.map(user => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(user.status)}`}>{user.status}</span></TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleEdit(user)} className="!text-xs !py-1 !px-2">Edit</Button>
                                <Button onClick={() => handleStatusToggle(user)} variant={user.status === 'active' ? 'danger' : 'secondary'} className="!text-xs !py-1 !px-2">{user.status === 'active' ? 'Suspend' : 'Reactivate'}</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            {isModalOpen && <SAStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} staff={editingStaff} onSave={handleSave} />}
        </div>
    );
};

const SAStaffModal: React.FC<{isOpen: boolean; onClose: () => void; staff: User | null; onSave: (data: any, isNew: boolean) => void}> = ({isOpen, onClose, staff, onSave}) => {
    const [name, setName] = useState(staff?.name || '');
    const [email, setEmail] = useState(staff?.email || '');
    const [role, setRole] = useState(staff?.role || Role.PLATFORM_SUPPORT);
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            id: staff?.id,
            name,
            email,
            role,
            username: email.split('@')[0], // Simple username generation
            password: password || undefined,
        };
        onSave(data, !staff);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={staff ? "Edit Staff" : "Add New Staff"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="staff-name">Full Name</Label><Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div><Label htmlFor="staff-email">Email</Label><Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div>
                    <Label htmlFor="staff-role">Role</Label>
                    <Select id="staff-role" value={role} onChange={e => setRole(e.target.value as Role)} required>
                        <option value={Role.PLATFORM_SUPPORT}>Platform Support</option>
                        <option value={Role.PLATFORM_BILLING}>Platform Billing</option>
                        <option value={Role.SUPER_ADMIN}>Super Admin</option>
                    </Select>
                </div>
                <div><Label htmlFor="staff-password">Password</Label><Input id="staff-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={staff ? "Leave blank to keep current" : "Required"} required={!staff} /></div>
                <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save Staff</Button></div>
            </form>
        </Modal>
    )
};

const SASystemHealth: React.FC = () => {
    const [stats, setStats] = useState<SystemHealthStats | null>(null);
    const [alerts, setAlerts] = useState<SystemHealthAlert[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        api.getSystemHealthStats().then(setStats);
        api.getSystemHealthAlertsLog().then(setAlerts);
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

    if (!stats) return <Card>Loading system health...</Card>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="API Status" value={stats.apiStatus} icon={<IconServer />} color={stats.apiStatus === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'} />
                <StatCard title="Avg Response Time" value={`${stats.avgResponseTime}ms`} icon={<IconActivity />} />
                <StatCard title="DB Connections" value={stats.dbConnections} icon={<IconDatabase />} />
                <StatCard title="CPU Usage" value={`${stats.cpuUsage}%`} icon={<IconZap />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="font-bold text-lg mb-4">API Response Time (ms)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.responseTimeData}>
                            <CartesianGrid {...chartGridProps} />
                            <XAxis dataKey="time" {...chartAxisProps} />
                            <YAxis {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" name="Response Time" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">CPU Usage (%)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.cpuUsageData}>
                            <CartesianGrid {...chartGridProps} />
                            <XAxis dataKey="time" {...chartAxisProps} />
                            <YAxis {...chartAxisProps} />
                            <Tooltip {...chartTooltipProps} />
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" name="CPU Usage"/>
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card>
                <h3 className="font-bold text-lg mb-4">Service Status</h3>
                <Table headers={['Service', 'Status', 'Details']}>
                    {stats.services.map(service => (
                        <TableRow key={service.name}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>{service.status}</span></TableCell>
                            <TableCell>{service.details}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

const SAUserActivity: React.FC = () => {
    const [logs, setLogs] = useState<UserActivityLog[]>([]);
    const [geoData, setGeoData] = useState<Record<string, IpGeolocationData | null>>({});

    useEffect(() => {
        api.getUserActivityLogs().then(logs => {
            setLogs(logs);
            // Fetch geo data for unique IPs
            const uniqueIps = [...new Set(logs.map(log => log.ipAddress))];
            uniqueIps.forEach(ip => {
                api.getIpGeolocation(ip).then(data => {
                    setGeoData(prev => ({ ...prev, [ip]: data }));
                });
            });
        });
    }, []);

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">User Activity Logs</h2>
            <Table headers={['Timestamp', 'User', 'Role', 'Action', 'IP Address', 'Location']}>
                {logs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        <TableCell className="font-medium">{log.userName}</TableCell>
                        <TableCell>{log.userRole}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                         <TableCell>
                            {geoData[log.ipAddress] ? `${geoData[log.ipAddress]?.city}, ${geoData[log.ipAddress]?.country}` : 'Loading...'}
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
        </Card>
    );
};

const SASettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('branding');

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: <IconUsers className="w-5 h-5 mr-2" /> },
        { id: 'branding', label: 'Branding', icon: <IconPalette className="w-5 h-5 mr-2" /> },
        { id: 'security', label: 'Security', icon: <IconShieldCheck className="w-5 h-5 mr-2" /> },
        { id: 'communications', label: 'Communications', icon: <IconMegaphone className="w-5 h-5 mr-2" /> },
        { id: 'payments', label: 'Payments', icon: <IconCreditCard className="w-5 h-5 mr-2" /> },
        { id: 'maintenance', label: 'Maintenance', icon: <IconTool className="w-5 h-5 mr-2" /> },
        { id: 'backup', label: 'Backup/Restore', icon: <IconDatabase className="w-5 h-5 mr-2" /> },
    ];
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile': return <UserProfileSettings user={useAuth().user!} />;
            case 'branding': return <SABrandingSettings />;
            case 'security': return <SASecuritySettings />;
            case 'communications': return <SACommunicationsSettings />;
            case 'payments': return <SAPaymentSettings />;
            case 'maintenance': return <SAMaintenanceSettings />;
            case 'backup': return <SABackupRestore />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b dark:border-slate-700 pb-2 overflow-x-auto">
                {tabs.map(tab => (
                    <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                        {tab.icon}
                        {tab.label}
                    </TabButton>
                ))}
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

const SABrandingSettings: React.FC = () => {
    const [settings, setSettings] = useState<PlatformBranding | null>(null);
    useEffect(() => { api.getPlatformSettings().then(s => setSettings(s.branding)); }, []);

    if (!settings) return <Card>Loading settings...</Card>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.updateBrandingSettings(settings);
        alert('Branding settings updated! The page will now reload to apply changes.');
        window.location.reload();
    };

    return (
        <SettingsFormWrapper title="Platform Branding" subtitle="Customize the look and feel of the platform.">
             <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                <div><Label htmlFor="name">Platform Name</Label><Input id="name" name="name" value={settings.name} onChange={handleChange} /></div>
                <div><Label htmlFor="logoUrl">Logo URL</Label><Input id="logoUrl" name="logoUrl" value={settings.logoUrl} onChange={handleChange} /></div>
                <div><Label htmlFor="primaryColor">Primary Color</Label><Input id="primaryColor" name="primaryColor" type="color" value={settings.primaryColor} onChange={handleChange} /></div>
                <div><Label htmlFor="contactEmail">Contact Email</Label><Input id="contactEmail" name="contactEmail" type="email" value={settings.contactEmail} onChange={handleChange} /></div>
                <Button type="submit">Save Branding</Button>
            </form>
        </SettingsFormWrapper>
    );
};

const SASecuritySettings: React.FC = () => {
    const [rolePermissions, setRolePermissions] = useState<RolePermissions | null>(null);
    const [ipBlacklist, setIpBlacklist] = useState<BlockedIP[]>([]);
    const [newIp, setNewIp] = useState({ ipAddress: '', reason: '' });
    const [ipApiSettings, setIpApiSettings] = useState<IpApiSettings | null>(null);

    useEffect(() => {
        api.getRolePermissions().then(setRolePermissions);
        api.getPlatformSettings().then(s => {
            setIpBlacklist(s.ipBlacklist);
            setIpApiSettings(s.ipApi);
        });
    }, []);

    const handlePermissionChange = async (role: Role, permission: Permission, checked: boolean) => {
        if (!rolePermissions) return;
        const currentPermissions = rolePermissions[role];
        const newPermissions = checked
            ? [...currentPermissions, permission]
            : currentPermissions.filter(p => p !== permission);
        
        await api.updateRolePermissions(role, newPermissions);
        setRolePermissions({ ...rolePermissions, [role]: newPermissions });
    };

    const handleAddIp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIp.ipAddress.trim()) return;
        const newBlacklist = [...ipBlacklist, { ...newIp, id: `ip-${Date.now()}`, createdAt: new Date().toISOString() }];
        await api.updateIpBlacklist(newBlacklist);
        setIpBlacklist(newBlacklist);
        setNewIp({ ipAddress: '', reason: '' });
    };
    
    const handleRemoveIp = async (id: string) => {
        const newBlacklist = ipBlacklist.filter(ip => ip.id !== id);
        await api.updateIpBlacklist(newBlacklist);
        setIpBlacklist(newBlacklist);
    };

    const handleIpApiSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ipApiSettings) {
            await api.updateIpApiSettings(ipApiSettings);
            alert("IP Geolocation API settings saved!");
        }
    };
    
    if (!rolePermissions || !ipApiSettings) return <Card>Loading...</Card>;

    return (
        <div className="space-y-6">
            <SettingsFormWrapper title="Role-Based Access Control" subtitle="Define what each user role can see and do.">
                <div className="space-y-6">
                    {Object.values(Role).map(role => (
                        <div key={role}>
                            <h3 className="font-semibold text-lg border-b dark:border-slate-700 pb-1 mb-2">{role}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {Object.values(Permission).map(permission => (
                                    <label key={permission} className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                            checked={rolePermissions[role]?.includes(permission)}
                                            onChange={(e) => handlePermissionChange(role, permission, e.target.checked)}
                                        />
                                        <span>{permission}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsFormWrapper>
            
             <SettingsFormWrapper title="IP Blacklist" subtitle="Block specific IP addresses from accessing the platform.">
                 <div className="space-y-4">
                     <form onSubmit={handleAddIp} className="flex items-end space-x-2">
                         <div className="flex-grow"><Label htmlFor="ip-address">IP Address</Label><Input id="ip-address" value={newIp.ipAddress} onChange={(e) => setNewIp({...newIp, ipAddress: e.target.value})} placeholder="e.g., 192.168.1.1" /></div>
                         <div className="flex-grow"><Label htmlFor="ip-reason">Reason (Optional)</Label><Input id="ip-reason" value={newIp.reason} onChange={(e) => setNewIp({...newIp, reason: e.target.value})} placeholder="e.g., Suspicious activity" /></div>
                         <Button type="submit">Add IP</Button>
                     </form>
                     <ul className="space-y-2">
                         {ipBlacklist.map(ip => (
                            <li key={ip.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded-md">
                                <div>
                                    <p className="font-mono">{ip.ipAddress}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{ip.reason}</p>
                                </div>
                                <Button variant="danger" className="!py-1 !px-2 !text-xs" onClick={() => handleRemoveIp(ip.id)}>Remove</Button>
                            </li>
                         ))}
                     </ul>
                 </div>
            </SettingsFormWrapper>

             <SettingsFormWrapper title="IP Geolocation API" subtitle="Configure an API to get location data for user activity logs.">
                <form onSubmit={handleIpApiSave} className="space-y-4 max-w-lg">
                    <div>
                        <Label htmlFor="ip-api-provider">Provider</Label>
                        <Select id="ip-api-provider" value={ipApiSettings.provider} onChange={(e) => setIpApiSettings({...ipApiSettings, provider: e.target.value as IpApiProvider})}>
                            <option value={IpApiProvider.NONE}>None (Disabled)</option>
                            <option value={IpApiProvider.IPINFO}>IPinfo</option>
                            <option value={IpApiProvider.ABSTRACT}>Abstract API</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="ip-api-key">API Key</Label>
                        <Input id="ip-api-key" type="password" value={ipApiSettings.apiKey} onChange={(e) => setIpApiSettings({...ipApiSettings, apiKey: e.target.value})} disabled={ipApiSettings.provider === IpApiProvider.NONE} />
                    </div>
                    <Button type="submit">Save API Settings</Button>
                </form>
            </SettingsFormWrapper>
        </div>
    );
};

const SACommunicationsSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('announcements');
    const tabs = ['announcements', 'email_templates', 'sms_templates'];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'announcements': return <SAAnnouncements />;
            case 'email_templates': return <SAEmailTemplates />;
            case 'sms_templates': return <SASmsTemplates />;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2 border-b dark:border-slate-700">
                <TabButton active={activeTab==='announcements'} onClick={() => setActiveTab('announcements')}>Announcements</TabButton>
                <TabButton active={activeTab==='email_templates'} onClick={() => setActiveTab('email_templates')}>Email Templates</TabButton>
                <TabButton active={activeTab==='sms_templates'} onClick={() => setActiveTab('sms_templates')}>SMS Templates</TabButton>
            </div>
            {renderContent()}
        </div>
    );
};

const SAAnnouncements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const refresh = useCallback(() => api.getAnnouncements().then(setAnnouncements), []);
    useEffect(() => { refresh() }, [refresh]);

    const handleSave = async (data: any, isNew: boolean) => {
        if (isNew) {
            await api.addAnnouncement(data);
        } else {
            await api.updateAnnouncement(data);
        }
        refresh();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await api.deleteAnnouncement(id);
            refresh();
        }
    };

    return (
        <div className="space-y-4">
             <div className="text-right">
                <Button onClick={() => { setEditingAnnouncement(null); setIsModalOpen(true); }}><IconPlusCircle className="mr-2" /> New Announcement</Button>
            </div>
            <Table headers={['Title', 'Status', 'Created At', 'Actions']}>
                {announcements.map(a => (
                    <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.title}</TableCell>
                        <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{a.status}</span></TableCell>
                        <TableCell>{formatDate(a.createdAt)}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button className="!text-xs !py-1 !px-2" onClick={() => { setEditingAnnouncement(a); setIsModalOpen(true); }}>Edit</Button>
                                <Button variant="danger" className="!text-xs !py-1 !px-2" onClick={() => handleDelete(a.id)}>Delete</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
            {isModalOpen && <SAAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} announcement={editingAnnouncement} onSave={handleSave} />}
        </div>
    );
};
const SAAnnouncementModal: React.FC<{isOpen: boolean, onClose: () => void, announcement: Announcement | null, onSave: (data: any, isNew: boolean) => void}> = ({isOpen, onClose, announcement, onSave}) => {
    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');
    const [status, setStatus] = useState<'active' | 'inactive'>(announcement?.status || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: announcement?.id, title, content, status }, !announcement);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={announcement ? "Edit Announcement" : "New Announcement"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={e => setTitle(e.target.value)} required /></div>
                <div><Label htmlFor="content">Content</Label><textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" required></textarea></div>
                <div><Label htmlFor="status">Status</Label><Select id="status" value={status} onChange={e => setStatus(e.target.value as any)}><option value="active">Active</option><option value="inactive">Inactive</option></Select></div>
                <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save</Button></div>
            </form>
        </Modal>
    )
}

const SAEmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    useEffect(() => { api.getEmailTemplates().then(setTemplates); }, []);

    const handleSave = async (template: EmailTemplate) => {
        await api.updateEmailTemplate(template);
        setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        setEditingTemplate(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Templates</h3>
                {templates.map(t => (
                    <Card key={t.id} className="cursor-pointer" onClick={() => setEditingTemplate(t)}>
                        <h4 className="font-semibold">{t.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Subject: {t.subject}</p>
                    </Card>
                ))}
            </div>
            {editingTemplate && (
                <Card>
                    <h3 className="text-lg font-semibold">Editing: {editingTemplate.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">You can use variables like {'{{name}}'}, {'{{reset_link}}'}.</p>
                    <div className="space-y-4">
                         <div><Label htmlFor="subject">Subject</Label><Input id="subject" value={editingTemplate.subject} onChange={e => setEditingTemplate({...editingTemplate, subject: e.target.value})} /></div>
                         <div><Label htmlFor="body">Body (HTML)</Label><textarea id="body" value={editingTemplate.body} onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})} rows={10} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-mono text-sm"></textarea></div>
                         <Button onClick={() => handleSave(editingTemplate)}>Save Template</Button>
                    </div>
                </Card>
            )}
        </div>
    );
}

const SASmsTemplates: React.FC = () => {
     const [templates, setTemplates] = useState<SmsTemplate[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);

    useEffect(() => { api.getSmsTemplates().then(setTemplates); }, []);

    const handleSave = async (template: SmsTemplate) => {
        await api.updateSmsTemplate(template);
        setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        setEditingTemplate(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">SMS Templates</h3>
                {templates.map(t => (
                    <Card key={t.id} className="cursor-pointer" onClick={() => setEditingTemplate(t)}>
                        <h4 className="font-semibold">{t.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{t.body}</p>
                    </Card>
                ))}
            </div>
            {editingTemplate && (
                <Card>
                    <h3 className="text-lg font-semibold">Editing: {editingTemplate.name}</h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">You can use variables like {'{{otp}}'}, {'{{pharmacy_name}}'}.</p>
                    <div className="space-y-4">
                         <div><Label htmlFor="sms-body">Body</Label><textarea id="sms-body" value={editingTemplate.body} onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})} rows={5} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 font-mono text-sm"></textarea></div>
                         <Button onClick={() => handleSave(editingTemplate)}>Save Template</Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

const SAPaymentSettings: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [newAccount, setNewAccount] = useState({ bankName: '', accountName: '', accountNumber: '' });

    useEffect(() => { api.getPlatformSettings().then(s => setAccounts(s.manualBankAccounts)); }, []);

    const handleSave = async () => {
        await api.updateManualBankAccounts(accounts);
        alert("Bank accounts updated!");
    };
    
    const handleAddAccount = () => {
        if (newAccount.bankName && newAccount.accountNumber && newAccount.accountName) {
            const updatedAccounts = [...accounts, { ...newAccount, id: `bank-${Date.now()}` }];
            setAccounts(updatedAccounts);
            setNewAccount({ bankName: '', accountName: '', accountNumber: '' });
        }
    };
    
    const handleRemoveAccount = (id: string) => {
        setAccounts(accounts.filter(acc => acc.id !== id));
    };

    return (
        <SettingsFormWrapper title="Manual Payment Settings" subtitle="Provide bank accounts for manual subscription payments.">
            <div className="space-y-4">
                {accounts.map((acc, index) => (
                    <div key={acc.id} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-md">
                        <Input value={acc.bankName} onChange={e => { const u = [...accounts]; u[index].bankName = e.target.value; setAccounts(u); }} placeholder="Bank Name" />
                        <Input value={acc.accountName} onChange={e => { const u = [...accounts]; u[index].accountName = e.target.value; setAccounts(u); }} placeholder="Account Name" />
                        <Input value={acc.accountNumber} onChange={e => { const u = [...accounts]; u[index].accountNumber = e.target.value; setAccounts(u); }} placeholder="Account Number" />
                        <Button variant="danger" onClick={() => handleRemoveAccount(acc.id)}>Remove</Button>
                    </div>
                ))}
                <div className="flex items-end space-x-2 pt-4 border-t dark:border-slate-700">
{/* Fix: Added missing htmlFor and id attributes for accessibility and correctness. */}
                    <div className="flex-grow"><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" value={newAccount.bankName} onChange={e => setNewAccount({...newAccount, bankName: e.target.value})} /></div>
{/* Fix: Added missing htmlFor and id attributes for accessibility and correctness. */}
                    <div className="flex-grow"><Label htmlFor="accountName">Account Name</Label><Input id="accountName" value={newAccount.accountName} onChange={e => setNewAccount({...newAccount, accountName: e.target.value})} /></div>
{/* Fix: Added missing htmlFor and id attributes for accessibility and correctness. */}
                    <div className="flex-grow"><Label htmlFor="accountNumber">Account Number</Label><Input id="accountNumber" value={newAccount.accountNumber} onChange={e => setNewAccount({...newAccount, accountNumber: e.target.value})} /></div>
                    <Button onClick={handleAddAccount}>Add Account</Button>
                </div>
                <Button onClick={handleSave}>Save All Changes</Button>
            </div>
        </SettingsFormWrapper>
    );
};

const SAMaintenanceSettings: React.FC = () => {
    const [settings, setSettings] = useState<PlatformMaintenance | null>(null);
    useEffect(() => { api.getPlatformSettings().then(s => setSettings(s.maintenance)); }, []);

    if (!settings) return <Card>Loading...</Card>;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.updateMaintenanceSettings(settings);
        alert("Maintenance settings updated!");
    };

    return (
         <SettingsFormWrapper title="Platform Maintenance" subtitle="Enable or disable maintenance mode for all users except Super Admins.">
             <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                 <label className="flex items-center space-x-3">
                     <input type="checkbox" className="form-checkbox h-5 w-5" checked={settings.isEnabled} onChange={e => setSettings({...settings, isEnabled: e.target.checked})} />
                     <span>Enable Maintenance Mode</span>
                 </label>
                 <div>
                    <Label htmlFor="maintenance-message">Maintenance Message</Label>
                    <textarea id="maintenance-message" rows={4} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" value={settings.message} onChange={e => setSettings({...settings, message: e.target.value})} disabled={!settings.isEnabled}></textarea>
                 </div>
                 <Button type="submit">Save Settings</Button>
             </form>
         </SettingsFormWrapper>
    );
};

const SABackupRestore: React.FC = () => {
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBackup = async () => {
        if (!window.confirm("This will create a full backup of the entire platform. Continue?")) return;
        setIsBackingUp(true);
        const backupData = await api.createPlatformBackup();
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `securepharm_platform_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsBackingUp(false);
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!window.confirm("DANGER: Restoring from a backup will overwrite ALL current platform data. This cannot be undone. Are you absolutely sure you want to proceed?")) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const backupData = JSON.parse(event.target?.result as string);
                    setIsRestoring(true);
                    await api.restorePlatformBackup(backupData);
                    alert("Platform restore completed successfully.");
                    setIsRestoring(false);
                } catch (error) {
                    alert("Error parsing backup file. Please ensure it's a valid JSON file.");
                    setIsRestoring(false);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <SettingsFormWrapper title="Platform Backup & Restore" subtitle="Create a full system backup or restore from a previous point.">
            <div className="space-y-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md">
                    <IconAlertTriangle className="inline-block mr-2 h-5 w-5" />
                    <strong>Warning:</strong> These are powerful tools. Backup regularly and only restore if absolutely necessary.
                </p>
                <div className="flex space-x-4">
                     <Button onClick={handleBackup} disabled={isBackingUp}>
                        {isBackingUp ? 'Creating Backup...' : 'Create Full Platform Backup'}
                    </Button>
                     <Button variant="danger" onClick={handleRestoreClick} disabled={isRestoring}>
                        {isRestoring ? 'Restoring...' : 'Restore from Backup'}
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                </div>
            </div>
        </SettingsFormWrapper>
    );
};


// --- END: SUPER ADMIN COMPONENTS ---

// --- START: PHARMACY USER COMPONENTS (Admin, Manager, Cashier) ---

const printReceipt = (sale: Sale, pharmacy: Pharmacy) => {
    const ReceiptComponent = (
        <div className="text-xs text-black font-mono p-2" style={{ width: '80mm' }}>
            <div className="text-center mb-2">
                <h1 className="text-base font-bold uppercase">{pharmacy.name}</h1>
                <p>{pharmacy.address}</p>
                <p>Tel: {pharmacy.contact}</p>
            </div>
            <hr className="border-black border-dashed my-1" />
            <div className="flex justify-between">
                <span>Receipt No:</span>
                <span>{sale.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{sale.staffName}</span>
            </div>
            <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatReceiptDateTime(sale.createdAt)}</span>
            </div>
            <hr className="border-black border-dashed my-1" />
            
            {/* Table Header */}
            <div className="grid grid-cols-12 font-bold">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-4 text-right">Amount</div>
            </div>

            {/* Fix: Corrected a rendering bug where sale item details were displayed incorrectly. */}
            {sale.items.map((item) => (
                <React.Fragment key={item.medicineId}>
                    <div className="grid grid-cols-12">
                        <div className="col-span-6 truncate">{item.medicineName}</div>
                        <div className="col-span-2 text-right">{item.quantity}</div>
                        <div className="col-span-4 text-right">{item.total.toFixed(2)}</div>
                    </div>
                    <div className="grid grid-cols-12 text-xs">
                        <div className="col-span-12 pl-2">
                            {`@ ${item.unitPrice.toFixed(2)}`}
                        </div>
                    </div>
                </React.Fragment>
            ))}

            <hr className="border-black border-dashed my-1" />

            <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{formatCurrency(sale.totalAmount, pharmacy.currency)}</span>
            </div>
            
            <hr className="border-black border-dashed my-1" />
            
            {sale.payments.map((p, i) => (
                <div key={i} className="flex justify-between">
                    <span>{p.method}:</span>
                    <span>{formatCurrency(p.amount, pharmacy.currency)}</span>
                </div>
            ))}
            
            <hr className="border-black border-dashed my-1" />

            <div className="text-center mt-2">
                <p>Thank you for your patronage!</p>
                <p className="text-[8px]">Powered by SecurePharm</p>
            </div>
        </div>
    );
    
    const container = document.getElementById('printable-receipt');
    if (container) {
        const root = createRoot(container);
        root.render(ReceiptComponent);
        setTimeout(() => {
            window.print();
            root.unmount(); // Clean up after printing
        }, 100);
    }
};

const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    currency: string;
    onProcessSale: (payments: Payment[]) => void;
}> = ({ isOpen, onClose, totalAmount, currency, onProcessSale }) => {
    const [payments, setPayments] = useState<Payment[]>([{ method: PaymentMethod.CASH, amount: 0 }]);
    const [cashTendered, setCashTendered] = useState(0);

    const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
    const balance = totalAmount - totalPaid;
    const change = cashTendered > totalPaid ? cashTendered - totalPaid : 0;

    const handlePaymentChange = (index: number, field: 'method' | 'amount', value: string | number) => {
        const newPayments = [...payments];
        const currentTotalOfOtherMethods = newPayments.reduce((sum, p, i) => i === index ? sum : sum + p.amount, 0);

        if (field === 'amount') {
            newPayments[index][field] = Number(value);
        } else {
            const newMethod = value as PaymentMethod;
            newPayments[index].method = newMethod;
            // If credit is selected, auto-fill with the remaining balance
            if (newMethod === PaymentMethod.CREDIT) {
                newPayments[index].amount = totalAmount - currentTotalOfOtherMethods;
            }
        }
        setPayments(newPayments);
    };

    const addPaymentMethod = () => {
        setPayments([...payments, { method: PaymentMethod.CASH, amount: 0 }]);
    };

    const removePaymentMethod = (index: number) => {
        setPayments(payments.filter((_, i) => i !== index));
    };

    const handleProcess = () => {
        if (balance > 0) {
            alert("Total paid is less than the total amount.");
            return;
        }
        onProcessSale(payments);
    };
    
    useEffect(() => {
        if (isOpen) {
            // Auto-fill first payment method with total amount
            setPayments([{ method: PaymentMethod.CASH, amount: totalAmount }]);
            setCashTendered(totalAmount);
        } else {
            // Reset state on close
            setPayments([{ method: PaymentMethod.CASH, amount: 0 }]);
            setCashTendered(0);
        }
    }, [isOpen, totalAmount]);


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment">
            <div className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Due</p>
                    <p className="text-4xl font-bold">{formatCurrency(totalAmount, currency)}</p>
                </div>

                {payments.map((p, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Select value={p.method} onChange={(e) => handlePaymentChange(index, 'method', e.target.value)} className="w-1/3">
                            {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                        </Select>
                        <Input type="number" value={p.amount} onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)} className="w-2/3" />
                        {payments.length > 1 && <Button variant="danger" onClick={() => removePaymentMethod(index)} className="!p-2"><IconX className="w-4 h-4" /></Button>}
                    </div>
                ))}
                
                <Button variant="secondary" onClick={addPaymentMethod} className="w-full text-sm !font-normal">
                    <IconPlus className="w-4 h-4 mr-2" />Add another payment method
                </Button>
                
                 <hr className="dark:border-slate-600"/>

                <div className="grid grid-cols-2 gap-4 text-center">
                     <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Paid</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid, currency)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
                        <p className={`text-xl font-bold ${balance > 0 ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>{formatCurrency(balance, currency)}</p>
                    </div>
                </div>

                 {payments.some(p => p.method === PaymentMethod.CASH) && (
                    <div>
                        <Label htmlFor="cash-tendered">Cash Tendered</Label>
                        <Input id="cash-tendered" type="number" value={cashTendered} onChange={(e) => setCashTendered(Number(e.target.value))} />
                        {change > 0 && (
                            <p className="text-center mt-2">Change: <span className="font-bold">{formatCurrency(change, currency)}</span></p>
                        )}
                    </div>
                )}


                <div className="pt-4 flex justify-end">
                    <Button onClick={handleProcess} disabled={balance > 0} className="w-full">
                        Process Sale
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const FinancialSummary: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [summary, setSummary] = useState<PharmacyFinanceSummary | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (pharmacy.id) {
            api.getPharmacyFinanceSummary(pharmacy.id).then(setSummary);
        }
    }, [pharmacy.id]);

    const chartTooltipProps = {
        wrapperStyle: {
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#d1d5db'}`,
            borderRadius: '0.5rem',
        },
        contentStyle: { backgroundColor: 'transparent', border: 'none' },
        labelStyle: { color: theme === 'dark' ? '#f1f5f9' : '#334155' },
        itemStyle: { fontWeight: 'bold' },
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

    if (!summary) return <Card>Loading financial data...</Card>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancialStatCard
                    title="Total Revenue"
                    value={formatCurrency(summary.totalRevenue, pharmacy.currency)}
                    icon={<IconTrendingUp className="w-6 h-6" />}
                    color="green"
                />
                <FinancialStatCard
                    title="Total Expenses"
                    value={formatCurrency(summary.totalExpenses, pharmacy.currency)}
                    icon={<IconTrendingDown className="w-6 h-6" />}
                    color="red"
                />
                <FinancialStatCard
                    title="Net Profit"
                    value={formatCurrency(summary.netProfit, pharmacy.currency)}
                    icon={<IconDollarSign className="w-6 h-6" />}
                    color="blue"
                />
            </div>
            <Card>
                <h3 className="text-lg font-bold mb-4">Monthly Performance</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.monthlyData}>
                        <CartesianGrid {...chartGridProps} />
                        <XAxis dataKey="month" {...chartAxisProps} />
                        <YAxis {...chartAxisProps} />
                        <Tooltip {...chartTooltipProps} />
                        <Legend wrapperStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#334155' }} />
                        <Bar dataKey="revenue" fill="#4ade80" name="Revenue" />
                        <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

const PharmacyDashboard: React.FC<{ user: User; pharmacy: Pharmacy, navigateTo: (view: string, params?: Record<string, any>) => void }> = ({ user, pharmacy, navigateTo }) => {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    
    useEffect(() => {
        api.getPharmacyDashboardStats(pharmacy.id).then(setStats);
        api.getRecentPharmacyActivity(pharmacy.id).then(setRecentActivity);
    }, [pharmacy.id]);

    if (!stats) {
        return <Card>Loading dashboard...</Card>;
    }

    const {
        users, expired, outOfStock, invoices, medicines, customers, suppliers, stores,
        expiredToday, unit, type, category, receivable, expenses, todaySales, revenue
    } = stats;
    
    const hasFinancePermission = [Role.PHARMACY_ADMIN, Role.SUB_ADMIN, Role.MANAGER].includes(user.role);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialStatCard title="Today's Sales" value={formatCurrency(todaySales, pharmacy.currency)} icon={<IconShoppingCart className="w-6 h-6" />} color="blue" />
                <FinancialStatCard title="Total Revenue" value={formatCurrency(revenue, pharmacy.currency)} icon={<IconTrendingUp className="w-6 h-6" />} color="green" />
                <FinancialStatCard title="Total Receivable" value={formatCurrency(receivable, pharmacy.currency)} icon={<IconCreditCard className="w-6 h-6" />} color="orange" />
                <FinancialStatCard title="Total Expenses" value={formatCurrency(expenses, pharmacy.currency)} icon={<IconTrendingDown className="w-6 h-6" />} color="red" />
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DashboardStatCard title="Total Medicines" value={medicines} icon={<IconPill className="w-6 h-6" />} color="blue" onClick={() => navigateTo('medicines')} />
                        <DashboardStatCard title="Out of Stock" value={outOfStock} icon={<IconXCircle className="w-6 h-6" />} color="orange" onClick={() => navigateTo('medicines', { medicinesFilter: 'out_of_stock' })} />
                        <DashboardStatCard title="Expired" value={expired} icon={<IconAlertTriangle className="w-6 h-6" />} color="red" onClick={() => navigateTo('medicines', { medicinesFilter: 'expired' })} />
                        <DashboardStatCard title="Total Staff" value={users} icon={<IconUsers className="w-6 h-6" />} color="green" onClick={() => navigateTo('staff')} />
                    </div>
                    {hasFinancePermission && <FinancialSummary pharmacy={pharmacy} />}
                </div>

                 <Card>
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map(activity => (
                             <div key={activity.id} className="flex items-start text-sm">
                                <div className={`p-2 rounded-full mr-3 ${activity.type === 'Sale' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {activity.type === 'Sale' 
                                        ? <IconShoppingCart className="w-5 h-5 text-green-500" />
                                        : <IconTrendingDown className="w-5 h-5 text-red-500" />
                                    }
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.description}</p>
                                    <p className="text-slate-600 dark:text-slate-400">{formatCurrency(activity.amount, pharmacy.currency)}</p>
                                    <p className="text-xs text-slate-400">{formatDateTime(activity.createdAt)}</p>
                                </div>
                            </div>
                        )) : <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CashierDashboard: React.FC<{ user: User, pharmacy: Pharmacy }> = ({ user, pharmacy }) => {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

    useEffect(() => {
        api.getCashierDashboardStats(pharmacy.id, user.id).then(setStats);
        api.getRecentPharmacyActivity(pharmacy.id, user.id).then(setRecentActivity);
    }, [pharmacy.id, user.id]);

    if (!stats) return <Card>Loading dashboard...</Card>;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinancialStatCard title="Today's Sales" value={formatCurrency(stats.salesToday, pharmacy.currency)} icon={<IconShoppingCart className="w-6 h-6" />} color="blue" />
                <FinancialStatCard title="This Week's Sales" value={formatCurrency(stats.salesThisWeek, pharmacy.currency)} icon={<IconActivity className="w-6 h-6" />} color="green" />
                <FinancialStatCard title="This Month's Sales" value={formatCurrency(stats.salesThisMonth, pharmacy.currency)} icon={<IconTrendingUp className="w-6 h-6" />} color="orange" />
                <FinancialStatCard title="This Year's Sales" value={formatCurrency(stats.salesThisYear, pharmacy.currency)} icon={<IconServer className="w-6 h-6" />} color="red" />
            </div>
             <Card>
                <h3 className="text-lg font-bold mb-4">Your Recent Activity</h3>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map(activity => (
                         <div key={activity.id} className="flex items-start text-sm">
                            <div className={`p-2 rounded-full mr-3 ${activity.type === 'Sale' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                {activity.type === 'Sale' 
                                    ? <IconShoppingCart className="w-5 h-5 text-green-500" />
                                    : <IconTrendingDown className="w-5 h-5 text-red-500" />
                                }
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.description}</p>
                                <p className="text-slate-600 dark:text-slate-400">{formatCurrency(activity.amount, pharmacy.currency)}</p>
                                <p className="text-xs text-slate-400">{formatDateTime(activity.createdAt)}</p>
                            </div>
                        </div>
                    )) : <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>}
                </div>
            </Card>
        </div>
    );
};

const POS: React.FC<{ user: User, pharmacy: Pharmacy }> = ({ user, pharmacy }) => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [heldSales, setHeldSales] = useState<Sale[]>([]);
    const [activeHeldSaleId, setActiveHeldSaleId] = useState<string | null>(null);

    const refreshHeldSales = useCallback(() => api.getHeldSales(pharmacy.id).then(setHeldSales), [pharmacy.id]);

    useEffect(() => {
        api.getMedicines(pharmacy.id).then(data => setMedicines(data.filter(m => m.branchName === user.branchName)));
        refreshHeldSales();
    }, [pharmacy.id, user.branchName, refreshHeldSales]);

    const filteredMedicines = useMemo(() => {
        if (!searchTerm) return [];
        return medicines.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            m.stockQuantity > 0 &&
            new Date(m.expiryDate) > new Date()
        ).slice(0, 10);
    }, [medicines, searchTerm]);

    const addToCart = (med: Medicine) => {
        const existingItem = cart.find(item => item.medicineId === med.id);
        if (existingItem) {
            if (existingItem.quantity < med.stockQuantity) {
                setCart(cart.map(item => item.medicineId === med.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice } : item));
            } else {
                alert("Cannot add more than available stock.");
            }
        } else {
            setCart([...cart, {
                medicineId: med.id,
                medicineName: med.name,
                medicineCategory: med.category,
                medicineUnit: med.unit,
                medicineType: med.type,
                quantity: 1,
                unitPrice: med.sellingPrice,
                discount: 0,
                total: med.sellingPrice,
            }]);
        }
        setSearchTerm('');
    };

    const updateCartItem = (medId: string, updates: Partial<SaleItem>) => {
        setCart(cart.map(item => {
            if (item.medicineId === medId) {
                const updatedItem = { ...item, ...updates };
                const med = medicines.find(m => m.id === medId);
                if (med && updatedItem.quantity > med.stockQuantity) {
                    alert("Quantity exceeds available stock.");
                    updatedItem.quantity = med.stockQuantity;
                }
                if (updatedItem.quantity < 1) updatedItem.quantity = 1;
                updatedItem.total = (updatedItem.quantity * updatedItem.unitPrice) - updatedItem.discount;
                return updatedItem;
            }
            return item;
        }));
    };

    const removeFromCart = (medId: string) => {
        setCart(cart.filter(item => item.medicineId !== medId));
    };

    const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);

    const resetSale = () => {
        setCart([]);
        setCustomerName('Walk-in Customer');
        setSearchTerm('');
        setActiveHeldSaleId(null);
    };

    const processSale = async (payments: Payment[]) => {
        const saleData = {
            pharmacyId: pharmacy.id,
            branchName: user.branchName!,
            staffId: user.id,
            staffName: user.name,
            customerName,
            items: cart,
            totalAmount,
            payments,
            status: SaleStatus.COMPLETED,
        };
        try {
            const newSale = await api.recordSale(saleData, activeHeldSaleId || undefined);
            alert("Sale recorded successfully!");
            printReceipt(newSale, pharmacy);
            // Refresh stock quantities
            api.getMedicines(pharmacy.id).then(data => setMedicines(data.filter(m => m.branchName === user.branchName)));
            resetSale();
            setIsPaymentModalOpen(false);
        } catch (error) {
            alert(`Error recording sale: ${(error as Error).message}`);
        }
    };
    
    const handleHoldSale = async () => {
        if (cart.length === 0) {
            alert("Cart is empty.");
            return;
        }
        const saleData = {
            pharmacyId: pharmacy.id,
            branchName: user.branchName!,
            staffId: user.id,
            staffName: user.name,
            customerName,
            items: cart,
            totalAmount,
        };
        await api.holdSale(saleData);
        alert("Sale has been put on hold.");
        resetSale();
        refreshHeldSales();
    };

    const resumeHeldSale = (sale: Sale) => {
        setCart(sale.items);
        setCustomerName(sale.customerName);
        // Fix: Cannot find name 'setTotalAmount'. 'totalAmount' is derived from `cart` and has no setter.
        setActiveHeldSaleId(sale.id);
    };
    
    const handlePaymentClick = () => {
        if (totalAmount < 0) {
            alert("Cannot process a sale with a negative total. Please check cart items and discounts.");
            return;
        }
        setIsPaymentModalOpen(true);
    };


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
            {/* Left side: Cart & Customer */}
            <div className="lg:w-2/3 flex flex-col">
                <Card className="flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Current Sale</h2>
                        <div className="flex items-center space-x-2">
                             <Label htmlFor="customer-name" className="!mb-0">Customer:</Label>
                             <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-48 !mt-0"/>
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto -mx-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                <IconShoppingCart className="w-16 h-16" />
                                <p className="mt-2">Your cart is empty</p>
                            </div>
                        ) : (
                             <table className="w-full text-sm">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Medicine</th>
                                        <th className="px-4 py-2 w-24">Quantity</th>
                                        <th className="px-4 py-2 w-32">Price</th>
                                        <th className="px-4 py-2 w-28">Discount</th>
                                        <th className="px-4 py-2 w-32 text-right">Total</th>
                                        <th className="px-4 py-2 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.medicineId} className="border-b dark:border-slate-700">
                                            <td className="px-4 py-2 font-medium">{item.medicineName}</td>
                                            <td className="px-4 py-2">
                                                <Input type="number" value={item.quantity} onChange={(e) => updateCartItem(item.medicineId, { quantity: parseInt(e.target.value) || 1 })} className="!p-1 text-center"/>
                                            </td>
                                            <td className="px-4 py-2"><Input type="number" value={item.unitPrice} onChange={(e) => updateCartItem(item.medicineId, { unitPrice: parseFloat(e.target.value) || 0 })} className="!p-1"/></td>
                                            <td className="px-4 py-2"><Input type="number" value={item.discount} onChange={(e) => updateCartItem(item.medicineId, { discount: parseFloat(e.target.value) || 0 })} className="!p-1"/></td>
                                            <td className="px-4 py-2 text-right font-semibold">{formatCurrency(item.total, pharmacy.currency)}</td>
                                            <td className="px-4 py-2 text-center">
                                                <Button variant="danger" onClick={() => removeFromCart(item.medicineId)} className="!p-2"><IconX className="w-4 h-4"/></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        )}
                    </div>

                     <div className="mt-4 pt-4 border-t dark:border-slate-700">
                        <div className="flex justify-between items-center text-2xl font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount, pharmacy.currency)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <Button variant="secondary" onClick={handleHoldSale}>Hold Sale</Button>
                            <Button variant="danger" onClick={resetSale}>Clear Sale</Button>
                            <Button onClick={handlePaymentClick} disabled={cart.length === 0}>Payment</Button>
                        </div>
                    </div>

                </Card>
            </div>
            
            {/* Right side: Search & Held Sales */}
             <div className="lg:w-1/3 flex flex-col space-y-4">
                 <Card className="flex-grow flex flex-col">
                     <div className="relative">
                         <Input
                            type="text"
                            placeholder="Search for medicine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                         {filteredMedicines.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                                {filteredMedicines.map(med => (
                                    <div key={med.id} onClick={() => addToCart(med)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                                        <p className="font-semibold">{med.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Stock: {med.stockQuantity} | Price: {formatCurrency(med.sellingPrice, pharmacy.currency)}</p>
                                    </div>
                                ))}
                            </div>
                         )}
                     </div>
                 </Card>
                 <Card className="flex-grow flex flex-col">
                    <h3 className="text-lg font-bold mb-2">Held Sales ({heldSales.length})</h3>
                    <div className="flex-grow overflow-y-auto">
                        {heldSales.map(sale => (
                            <div key={sale.id} onClick={() => resumeHeldSale(sale)} className="p-2 mb-2 rounded-md cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
                                <p className="font-semibold">{sale.customerName}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{sale.items.length} items - {formatCurrency(sale.totalAmount, pharmacy.currency)}</p>
                                <p className="text-xs text-slate-400">{formatDateTime(sale.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                 </Card>
             </div>
             
             <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalAmount={totalAmount}
                currency={pharmacy.currency}
                onProcessSale={processSale}
             />
        </div>
    );
};

const Medicines: React.FC<{ user: User, pharmacy: Pharmacy, initialFilter?: string }> = ({ user, pharmacy, initialFilter }) => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
    const [filter, setFilter] = useState(initialFilter || 'all');
    const [searchTerm, setSearchTerm] = useState('');

    const refreshMedicines = useCallback(() => {
        api.getMedicines(pharmacy.id).then(setMedicines);
    }, [pharmacy.id]);

    useEffect(() => {
        refreshMedicines();
    }, [refreshMedicines]);
    
    const filteredMedicines = useMemo(() => {
        const now = new Date();
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(now.getDate() + 60);

        return medicines
            .filter(m => {
                if (filter === 'all') return true;
                if (filter === 'low_stock') return m.stockQuantity > 0 && m.stockQuantity <= (m.lowStockThreshold || 10);
                if (filter === 'out_of_stock') return m.stockQuantity <= 0;
                if (filter === 'expiring_soon') return new Date(m.expiryDate) > now && new Date(m.expiryDate) <= sixtyDaysFromNow;
                if (filter === 'expired') return new Date(m.expiryDate) <= now;
                return true;
            })
            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [medicines, filter, searchTerm]);

    const handleEdit = (med: Medicine) => {
        setEditingMedicine(med);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingMedicine(null);
        setIsModalOpen(true);
    };
    
    const handleSave = async (medData: any) => {
        const med: Omit<Medicine, 'id' | 'createdAt'> = {
            pharmacyId: pharmacy.id,
            branchName: medData.branchName,
            name: medData.name,
            supplierId: medData.supplierId,
            description: medData.description,
            category: medData.category,
            type: medData.type,
            unit: medData.unit,
            stockQuantity: Number(medData.stockQuantity),
            lowStockThreshold: Number(medData.lowStockThreshold),
            costPrice: Number(medData.costPrice),
            sellingPrice: Number(medData.sellingPrice),
            expiryDate: new Date(medData.expiryDate).toISOString()
        };

        if (editingMedicine) {
            await api.updateMedicine({ ...med, id: editingMedicine.id, createdAt: editingMedicine.createdAt });
        } else {
            await api.addMedicine(med);
        }
        refreshMedicines();
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
             <Card>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Medicines</h2>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Search medicine name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="expiring_soon">Expiring Soon (60 days)</option>
                            <option value="expired">Expired</option>
                        </Select>
                        <Button onClick={handleAdd}><IconPlusCircle className="mr-2 h-5 w-5"/> Add Medicine</Button>
                    </div>
                </div>
            </Card>

            <Table headers={['Name', 'Category', 'Stock', 'Cost Price', 'Selling Price', 'Expiry Date', 'Actions']}>
                 {filteredMedicines.map(med => (
                    <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.category}</TableCell>
                        <TableCell>
                            <span className={med.stockQuantity <= (med.lowStockThreshold || 10) ? 'text-red-500 font-bold' : ''}>
                                {med.stockQuantity} {med.unit}
                            </span>
                        </TableCell>
                        <TableCell>{formatCurrency(med.costPrice, pharmacy.currency)}</TableCell>
                        <TableCell>{formatCurrency(med.sellingPrice, pharmacy.currency)}</TableCell>
                        <TableCell className={new Date(med.expiryDate) < new Date() ? 'text-red-500 font-bold' : ''}>
                            {formatDate(med.expiryDate)}
                        </TableCell>
                        <TableCell>
                             <Button onClick={() => handleEdit(med)} className="!text-xs !py-1 !px-2">Edit</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            {isModalOpen && <MedicineModal user={user} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} medicine={editingMedicine} pharmacy={pharmacy} onSave={handleSave} />}
        </div>
    );
};

const MedicineModal: React.FC<{
    user: User;
    isOpen: boolean;
    onClose: () => void;
    medicine: Medicine | null;
    pharmacy: Pharmacy;
    onSave: (data: any) => void;
}> = ({ user, isOpen, onClose, medicine, pharmacy, onSave }) => {
    const [formData, setFormData] = useState({
        name: medicine?.name || '',
        branchName: medicine?.branchName || user.branchName || '',
        category: medicine?.category || '',
        type: medicine?.type || '',
        unit: medicine?.unit || '',
        stockQuantity: medicine?.stockQuantity || 0,
        lowStockThreshold: medicine?.lowStockThreshold || 10,
        costPrice: medicine?.costPrice || 0,
        sellingPrice: medicine?.sellingPrice || 0,
        expiryDate: medicine?.expiryDate ? medicine.expiryDate.split('T')[0] : '',
        supplierId: medicine?.supplierId || '',
        description: medicine?.description || '',
    });
    const [categories, setCategories] = useState<MedicineCategory[]>([]);
    const [types, setTypes] = useState<MedicineType[]>([]);
    const [units, setUnits] = useState<MedicineUnit[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        api.getMedicineCategories(pharmacy.id).then(setCategories);
        api.getMedicineTypes(pharmacy.id).then(setTypes);
        api.getMedicineUnits(pharmacy.id).then(setUnits);
        api.getSuppliers(pharmacy.id).then(setSuppliers);
    }, [pharmacy.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Get unique branch names from all users in the pharmacy
    const [branchNames, setBranchNames] = useState<string[]>([]);
    useEffect(() => {
        api.getUsersForPharmacy(pharmacy.id).then(users => {
            const uniqueBranches = [...new Set(users.map(u => u.branchName).filter(Boolean) as string[])];
            setBranchNames(uniqueBranches);
        });
    }, [pharmacy.id]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={medicine ? "Edit Medicine" : "Add New Medicine"}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label htmlFor="name">Medicine Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                
                <div><Label htmlFor="category">Category</Label><Select id="category" name="category" value={formData.category} onChange={handleChange} required><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</Select></div>
                <div><Label htmlFor="type">Type</Label><Select id="type" name="type" value={formData.type} onChange={handleChange} required><option value="">Select Type</option>{types.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}</Select></div>
                <div><Label htmlFor="unit">Unit</Label><Select id="unit" name="unit" value={formData.unit} onChange={handleChange} required><option value="">Select Unit</option>{units.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}</Select></div>
                <div><Label htmlFor="supplierId">Supplier</Label><Select id="supplierId" name="supplierId" value={formData.supplierId} onChange={handleChange}><option value="">Select Supplier</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
                
                <div><Label htmlFor="stockQuantity">Stock Quantity</Label><Input id="stockQuantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required /></div>
                <div><Label htmlFor="lowStockThreshold">Low Stock Alert at</Label><Input id="lowStockThreshold" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} required /></div>
                
                <div><Label htmlFor="costPrice">Cost Price</Label><Input id="costPrice" name="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={handleChange} required /></div>
                <div><Label htmlFor="sellingPrice">Selling Price</Label><Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={handleChange} required /></div>
                
                <div><Label htmlFor="expiryDate">Expiry Date</Label><Input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required /></div>
                <div><Label htmlFor="branchName">Branch</Label><Select id="branchName" name="branchName" value={formData.branchName} onChange={handleChange} required><option value="">Select Branch</option>{branchNames.map(b => <option key={b} value={b}>{b}</option>)}</Select></div>

                <div className="md:col-span-2"><Label htmlFor="description">Description</Label><textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"></textarea></div>

                <div className="md:col-span-2 flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save Medicine</Button></div>
            </form>
        </Modal>
    );
};

const PrescriptionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    prescription: Prescription | null;
    pharmacy: Pharmacy;
    onSave: (data: any, isNew: boolean) => void;
}> = ({ isOpen, onClose, prescription, pharmacy, onSave }) => {
    const [formData, setFormData] = useState({
        patientName: prescription?.patientName || '',
        doctorName: prescription?.doctorName || '',
        prescriptionDate: prescription?.prescriptionDate ? prescription.prescriptionDate.split('T')[0] : new Date().toISOString().split('T')[0],
        refillsAllowed: prescription?.refillsAllowed || 0,
    });
    const [items, setItems] = useState<PrescriptionItem[]>(prescription?.items || []);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.getMedicines(pharmacy.id).then(setMedicines);
    }, [pharmacy.id]);

    const filteredMedicines = useMemo(() => {
        if (!searchTerm) return [];
        const itemIds = items.map(i => i.medicineId);
        return medicines.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !itemIds.includes(m.id)
        ).slice(0, 5);
    }, [medicines, searchTerm, items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index: number, field: keyof Omit<PrescriptionItem, 'medicineId' | 'medicineName'>, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addMedicineToItems = (med: Medicine) => {
        setItems([...items, { medicineId: med.id, medicineName: med.name, dosage: '', quantity: 1 }]);
        setSearchTerm('');
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('Please add at least one medicine to the prescription.');
            return;
        }

        const prescriptionData = {
            ...formData,
            id: prescription?.id,
            pharmacyId: pharmacy.id,
            items: items,
            refillsAllowed: Number(formData.refillsAllowed),
            refillsRemaining: prescription ? Math.min(Number(formData.refillsAllowed), prescription.refillsRemaining) : Number(formData.refillsAllowed),
            status: prescription?.status || PrescriptionStatus.ACTIVE,
        };
        onSave(prescriptionData, !prescription);
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={prescription ? "Edit Prescription" : "New Prescription"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="patientName">Patient Name</Label><Input id="patientName" name="patientName" value={formData.patientName} onChange={handleChange} required /></div>
                    <div><Label htmlFor="doctorName">Doctor Name</Label><Input id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleChange} required /></div>
                    <div><Label htmlFor="prescriptionDate">Date</Label><Input id="prescriptionDate" name="prescriptionDate" type="date" value={formData.prescriptionDate} onChange={handleChange} required /></div>
                    <div><Label htmlFor="refillsAllowed">Refills Allowed</Label><Input id="refillsAllowed" name="refillsAllowed" type="number" value={formData.refillsAllowed} onChange={handleChange} required min="0" /></div>
                </div>

                <div className="pt-4 border-t dark:border-slate-700">
                    <h4 className="font-semibold mb-2">Medicines</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.medicineName}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Input placeholder="Dosage" value={item.dosage} onChange={e => handleItemChange(index, 'dosage', e.target.value)} className="w-full !text-sm !py-1"/>
                                        <Input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-20 !text-sm !py-1" min="1" />
                                    </div>
                                </div>
                                <Button type="button" variant="danger" onClick={() => removeItem(index)} className="!p-2"><IconX className="w-4 h-4"/></Button>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-2">
                        <Input 
                            type="text" 
                            placeholder="Search to add medicine..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {filteredMedicines.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md shadow-lg mt-1 z-10 max-h-48 overflow-y-auto">
                                {filteredMedicines.map(med => (
                                    <div key={med.id} onClick={() => addMedicineToItems(med)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer text-sm">
                                        {med.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Prescription</Button>
                </div>
            </form>
        </Modal>
    );
};

const Prescriptions: React.FC<{ user: User, pharmacy: Pharmacy }> = ({ user, pharmacy }) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

    const refreshPrescriptions = useCallback(() => {
        api.getPrescriptions(pharmacy.id).then(setPrescriptions);
    }, [pharmacy.id]);
    
    useEffect(() => {
        refreshPrescriptions();
    }, [refreshPrescriptions]);

    const handleDispense = async (p: Prescription) => {
        if(window.confirm(`Dispense prescription for ${p.patientName}? This will deduct stock and create a sale record.`)) {
            try {
                await api.dispensePrescription(p.id, user);
                refreshPrescriptions();
                alert("Prescription dispensed.");
            } catch (e) {
                alert(`Error: ${(e as Error).message}`);
            }
        }
    };
    
    const handleAdd = () => {
        setEditingPrescription(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (p: Prescription) => {
        setEditingPrescription(p);
        setIsModalOpen(true);
    };
    
    const handleSave = async (data: any, isNew: boolean) => {
        if (isNew) {
            await api.addPrescription(data);
        } else {
            await api.updatePrescription(data);
        }
        refreshPrescriptions();
        setIsModalOpen(false);
    };

    return (
         <div className="space-y-4">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Prescriptions</h2>
                    <Button onClick={handleAdd}><IconPlusCircle className="mr-2 h-5 w-5" /> Add Prescription</Button>
                </div>
                <Table headers={['Date', 'Patient', 'Doctor', 'Status', 'Items', 'Refills', 'Actions']}>
                    {prescriptions.map(p => (
                        <TableRow key={p.id}>
                            <TableCell>{formatDate(p.prescriptionDate)}</TableCell>
                            <TableCell className="font-medium">{p.patientName}</TableCell>
                            <TableCell>{p.doctorName}</TableCell>
                            <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPrescriptionStatusColor(p.status)}`}>{p.status}</span></TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside text-xs">
                                    {p.items.map(item => <li key={item.medicineId}>{item.medicineName} ({item.quantity}) - {item.dosage}</li>)}
                                </ul>
                            </TableCell>
                            <TableCell>{p.refillsRemaining} / {p.refillsAllowed}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                     <Button onClick={() => handleEdit(p)} className="!text-xs !py-1 !px-2">Edit</Button>
                                    <Button onClick={() => handleDispense(p)} disabled={p.refillsRemaining <= 0} className="!text-xs !py-1 !px-2">Dispense</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </Card>
            {isModalOpen && <PrescriptionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                prescription={editingPrescription} 
                pharmacy={pharmacy} 
                onSave={handleSave} 
            />}
        </div>
    );
};

// Fix: Add StockReport component to resolve "Cannot find name 'StockReport'" error.
const StockReport: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [reportData, setReportData] = useState<StockReportItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.getStockReport(pharmacy.id).then(setReportData);
    }, [pharmacy.id]);

    const filteredData = useMemo(() => {
        return reportData.filter(item =>
            item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.medicineCategory.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [reportData, searchTerm]);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Stock Report</h2>
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                />
            </div>
            <Table headers={['Medicine', 'Category', 'Branch', 'Stock', 'Cost Price', 'Selling Price', 'Total Cost', 'Total Selling Price']}>
                {filteredData.map(item => (
                    <TableRow key={item.medicineId}>
                        <TableCell className="font-medium">{item.medicineName}</TableCell>
                        <TableCell>{item.medicineCategory}</TableCell>
                        <TableCell>{item.branchName}</TableCell>
                        <TableCell>{item.stockQuantity} {item.medicineUnit}</TableCell>
                        <TableCell>{formatCurrency(item.costPrice, pharmacy.currency)}</TableCell>
                        <TableCell>{formatCurrency(item.sellingPrice, pharmacy.currency)}</TableCell>
                        <TableCell>{formatCurrency(item.totalCostPrice, pharmacy.currency)}</TableCell>
                        <TableCell>{formatCurrency(item.totalSellingPrice, pharmacy.currency)}</TableCell>
                    </TableRow>
                ))}
            </Table>
        </Card>
    );
};

const Reports: React.FC<{ user: User, pharmacy: Pharmacy }> = ({ user, pharmacy }) => {
    const [activeTab, setActiveTab] = useState('detailed_sales');

    const canViewFinanceReports = [Role.PHARMACY_ADMIN, Role.SUB_ADMIN].includes(user.role);

    const tabs = [
        { id: 'detailed_sales', label: 'Detailed Sales', permission: true },
        { id: 'medicine_sales', label: 'Medicine Sales', permission: true },
        { id: 'stock_report', label: 'Stock Report', permission: true },
        { id: 'stock_history', label: 'Stock History', permission: canViewFinanceReports },
        { id: 'inventory_levels', label: 'Inventory Levels', permission: canViewFinanceReports },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'detailed_sales': return <DetailedSalesReport pharmacy={pharmacy} />;
            case 'medicine_sales': return <MedicineSalesReport pharmacy={pharmacy} />;
            case 'stock_report': return <StockReport pharmacy={pharmacy} />;
            default: return null;
        }
    };

    return (
         <div className="space-y-4">
            <div className="flex space-x-2 border-b dark:border-slate-700 pb-2 overflow-x-auto">
                {tabs.filter(t => t.permission).map(tab => (
                    <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </TabButton>
                ))}
            </div>
            <div>{renderTabContent()}</div>
        </div>
    );
};

const DetailedSalesReport: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [reportData, setReportData] = useState<DetailedSaleReportItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof DetailedSaleReportItem; direction: 'asc' | 'desc' } | null>({ key: 'dateTime', direction: 'desc' });

    useEffect(() => {
        api.getDetailedSalesReport(pharmacy.id).then(setReportData);
    }, [pharmacy.id]);

    const requestSort = (key: keyof DetailedSaleReportItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredData = useMemo(() => {
        const filtered = reportData.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                } else {
                    const strA = String(aValue).toLowerCase();
                    const strB = String(bValue).toLowerCase();
                    if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [reportData, searchTerm, sortConfig]);
    
    const grandTotals = useMemo(() => {
        return sortedAndFilteredData.reduce((acc, item) => ({
            quantity: acc.quantity + item.quantity,
            totalCostPrice: acc.totalCostPrice + item.totalCostPrice,
            totalSalePrice: acc.totalSalePrice + item.totalSalePrice,
            discount: acc.discount + item.discount,
            profit: acc.profit + item.profit,
        }), { quantity: 0, totalCostPrice: 0, totalSalePrice: 0, discount: 0, profit: 0 });
    }, [sortedAndFilteredData]);

    const exportToCsv = () => {
        const headers = [
            "S/N", "Pharmacy Name", "Branch", "Cashier", "Medicine", "Customer",
            "Category", "Type", "Unit", "Qty Sold", "Qty Rem", "Cost Price",
            "Total Cost", "Selling Price", "Total Sale", "Discount", "Profit", "Date/Time"
        ];
        
        const rows = sortedAndFilteredData.map((item, index) => [
            index + 1,
            item.pharmacyName,
            item.branchName,
            item.cashierName,
            item.medicineName,
            item.customerName,
            item.medicineCategory,
            item.medicineType,
            item.medicineUnit,
            item.quantity,
            item.remainingQuantity,
            item.unitCostPrice,
            item.totalCostPrice,
            item.unitSalePrice,
            item.totalSalePrice,
            item.discount,
            item.profit,
            formatDateTime(item.dateTime)
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `detailed_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const headerConfig: { label: string; key: keyof DetailedSaleReportItem | null; sortable: boolean }[] = [
        { label: "S/N", key: null, sortable: false },
        { label: "Branch", key: "branchName", sortable: true },
        { label: "Cashier", key: "cashierName", sortable: true },
        { label: "Medicine", key: "medicineName", sortable: true },
        { label: "Customer", key: "customerName", sortable: true },
        { label: "Category", key: "medicineCategory", sortable: true },
        { label: "Type", key: "medicineType", sortable: true },
        { label: "Unit", key: "medicineUnit", sortable: true },
        { label: "Qty Sold", key: "quantity", sortable: true },
        { label: "Qty Rem", key: "remainingQuantity", sortable: true },
        { label: "Cost Price", key: "unitCostPrice", sortable: true },
        { label: "Total Cost", key: "totalCostPrice", sortable: true },
        { label: "Selling Price", key: "unitSalePrice", sortable: true },
        { label: "Total Sale", key: "totalSalePrice", sortable: true },
        { label: "Discount", key: "discount", sortable: true },
        { label: "Profit", key: "profit", sortable: true },
        { label: "Date/Time", key: "dateTime", sortable: true }
    ];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Detailed Sales Report</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing all individual sale items.</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search report..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                    <Button onClick={exportToCsv} variant="secondary">
                        <IconDownload className="mr-2 h-4 w-4"/> Export CSV
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            {headerConfig.map(header => (
                                <th key={header.label} scope="col" className="px-3 py-3 whitespace-nowrap">
                                    <button
                                        className="flex items-center space-x-1"
                                        disabled={!header.sortable}
                                        onClick={() => header.key && requestSort(header.key)}
                                    >
                                        <span>{header.label}</span>
                                        {header.sortable && (
                                        <span className="opacity-50">
                                            {sortConfig?.key === header.key
                                            ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                                            : <IconArrowUpDown className="w-3 h-3" />}
                                        </span>
                                        )}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredData.map((item, index) => (
                             <TableRow key={item.saleId + item.medicineName + index}>
                                <TableCell className="px-3 py-2">{index + 1}</TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap">{item.branchName}</TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap">{item.cashierName}</TableCell>
                                <TableCell className="px-3 py-2 font-medium whitespace-nowrap">{item.medicineName}</TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap">{item.customerName}</TableCell>
                                <TableCell className="px-3 py-2">{item.medicineCategory}</TableCell>
                                <TableCell className="px-3 py-2">{item.medicineType}</TableCell>
                                <TableCell className="px-3 py-2">{item.medicineUnit}</TableCell>
                                <TableCell className="px-3 py-2 text-center">{item.quantity}</TableCell>
                                <TableCell className="px-3 py-2 text-center">{item.remainingQuantity}</TableCell>
                                <TableCell className="px-3 py-2 text-right">{formatCurrency(item.unitCostPrice, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 text-right">{formatCurrency(item.totalCostPrice, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 text-right">{formatCurrency(item.unitSalePrice, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 text-right">{formatCurrency(item.totalSalePrice, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 text-right">{formatCurrency(item.discount, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 text-right font-bold">{formatCurrency(item.profit, pharmacy.currency)}</TableCell>
                                <TableCell className="px-3 py-2 whitespace-nowrap">{formatDateTime(item.dateTime)}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">
                        <tr>
                            <TableCell colSpan={8} className="text-right px-3 py-2">Grand Totals</TableCell>
                            <TableCell className="text-center px-3 py-2">{grandTotals.quantity}</TableCell>
                            <TableCell className="px-3 py-2"></TableCell>
                            <TableCell className="px-3 py-2"></TableCell>
                            <TableCell className="text-right px-3 py-2">{formatCurrency(grandTotals.totalCostPrice, pharmacy.currency)}</TableCell>
                            <TableCell className="px-3 py-2"></TableCell>
                            <TableCell className="text-right px-3 py-2">{formatCurrency(grandTotals.totalSalePrice, pharmacy.currency)}</TableCell>
                            <TableCell className="text-right px-3 py-2">{formatCurrency(grandTotals.discount, pharmacy.currency)}</TableCell>
                            <TableCell className="text-right px-3 py-2">{formatCurrency(grandTotals.profit, pharmacy.currency)}</TableCell>
                            <TableCell className="px-3 py-2"></TableCell>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
    );
};

// Fix: Re-implement the incomplete MedicineSalesReport component.
const MedicineSalesReport: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [reportData, setReportData] = useState<MedicineSalesReportItem[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof MedicineSalesReportItem; direction: 'asc' | 'desc' } | null>({ key: 'totalRevenue', direction: 'desc' });

    useEffect(() => {
        api.getMedicineSalesReport(pharmacy.id).then(setReportData);
    }, [pharmacy.id]);

    const requestSort = (key: keyof MedicineSalesReportItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        const sortableItems = [...reportData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                } else {
                    const strA = String(aValue).toLowerCase();
                    const strB = String(bValue).toLowerCase();
                    if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [reportData, sortConfig]);

    const headerConfig: { label: string; key: keyof MedicineSalesReportItem; sortable: boolean }[] = [
        { label: "Medicine", key: "medicineName", sortable: true },
        { label: "Quantity Sold", key: "quantitySold", sortable: true },
        { label: "Total Revenue", key: "totalRevenue", sortable: true },
        { label: "Total Profit", key: "totalProfit", sortable: true },
    ];

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">Medicine Sales Report</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            {headerConfig.map(header => (
                                <th key={header.key} scope="col" className="px-3 py-3 whitespace-nowrap">
                                    <button className="flex items-center space-x-1" onClick={() => requestSort(header.key)}>
                                        <span>{header.label}</span>
                                        <span className="opacity-50">
                                            {sortConfig?.key === header.key
                                                ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                                                : <IconArrowUpDown className="w-3 h-3" />}
                                        </span>
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item) => (
                            <TableRow key={item.medicineId}>
                                <TableCell className="font-medium">{item.medicineName}</TableCell>
                                <TableCell>{item.quantitySold}</TableCell>
                                <TableCell>{formatCurrency(item.totalRevenue, pharmacy.currency)}</TableCell>
                                <TableCell>{formatCurrency(item.totalProfit, pharmacy.currency)}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const getSidebarItems = (role: Role) => {
    const allItems = [
        { view: 'dashboard', label: 'Dashboard', icon: <IconHome />, roles: Object.values(Role) },
        // Super Admin
        { view: 'pharmacies', label: 'Pharmacies', icon: <IconBuilding />, roles: [Role.SUPER_ADMIN] },
        { view: 'billing', label: 'Billing', icon: <IconCreditCard />, roles: [Role.SUPER_ADMIN] },
        { view: 'support', label: 'Support Tickets', icon: <IconLifeBuoy />, roles: [Role.SUPER_ADMIN] },
        { view: 'staff', label: 'Platform Staff', icon: <IconUsers />, roles: [Role.SUPER_ADMIN] },
        { view: 'user_activity', label: 'User Activity', icon: <IconEye />, roles: [Role.SUPER_ADMIN] },
        { view: 'system_health', label: 'System Health', icon: <IconServer />, roles: [Role.SUPER_ADMIN] },
        // Pharmacy
        { view: 'pos', label: 'POS', icon: <IconShoppingCart />, roles: [Role.PHARMACY_ADMIN, Role.SUB_ADMIN, Role.MANAGER, Role.CASHIER] },
        { view: 'medicines', label: 'Medicines', icon: <IconPill />, roles: [Role.PHARMACY_ADMIN, Role.SUB_ADMIN, Role.MANAGER] },
        { view: 'prescriptions', label: 'Prescriptions', icon: <IconClipboardList />, roles: [Role.PHARMACY_ADMIN, Role.SUB_ADMIN, Role.MANAGER] },
        { view: 'reports', label: 'Reports', icon: <IconFileText />, roles: [Role.PHARMACY_ADMIN, Role.SUB_ADMIN, Role.MANAGER] },
        { view: 'finances', label: 'Finances', icon: <IconCalculator />, roles: [Role.PHARMACY_ADMIN, Role.SUB_ADMIN] },
        { view: 'settings', label: 'Settings', icon: <IconSettings />, roles: [Role.SUPER_ADMIN, Role.PHARMACY_ADMIN] },
    ];
    return allItems.filter(item => item.roles.includes(role));
};

const Header: React.FC<{
    user: User;
    brandingSettings?: PlatformBranding | null;
    onLogout: () => void;
    onToggleTheme: () => void;
    onBellClick: () => void;
    onMenuClick: () => void;
}> = ({ user, brandingSettings, onLogout, onToggleTheme, onBellClick, onMenuClick }) => {
    const { theme } = useTheme();
    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-between items-center z-10 flex-shrink-0 border-b dark:border-slate-700">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="lg:hidden mr-4 text-slate-500 dark:text-slate-400">
                    <IconMenu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                    {brandingSettings?.name || 'SecurePharm'}
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <DigitalClock className="hidden md:block text-slate-600 dark:text-slate-400" />
                <button onClick={onToggleTheme}>
                    {theme === 'light' ? <IconMoon className="w-5 h-5 text-slate-500" /> : <IconSun className="w-5 h-5 text-yellow-400" />}
                </button>
                <button onClick={onBellClick} className="relative">
                    <IconBell className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
                </button>
                <div className="flex items-center space-x-2">
                    <img src={user.pictureUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                    <button onClick={onLogout} title="Logout">
                        <IconLogOut className="w-5 h-5 text-slate-500 hover:text-red-500" />
                    </button>
                </div>
            </div>
        </header>
    );
};

const Sidebar: React.FC<{
    // Fix: Specified the props type for the icon to allow className to be passed via cloneElement.
    items: { view: string; label: string; icon: ReactElement<{ className?: string }> }[];
    activeView: string;
    navigateTo: (view: string) => void;
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
}> = ({ items, activeView, navigateTo, isMobileOpen, setMobileOpen }) => {
    const SidebarContent = () => (
        <div className="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex flex-col flex-shrink-0 h-full">
            <div className="p-4 border-b dark:border-slate-700">
                <div className="flex items-center">
                    <IconPill className="w-8 h-8 text-indigo-600" />
                    <span className="text-lg font-bold ml-2">SecurePharm</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {items.map(item => (
                    <a
                        key={item.view}
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigateTo(item.view); }}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === item.view
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    );
    
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block flex-shrink-0">
                <SidebarContent />
            </div>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)}>
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
             <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
                <SidebarContent />
             </div>
        </>
    );
};

// --- START: PHARMACY SETTINGS COMPONENTS ---

const PharmacyInfoSettings: React.FC<{ pharmacy: Pharmacy; onUpdate: (pharmacy: Pharmacy) => void }> = ({ pharmacy, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: pharmacy.name,
        logo: pharmacy.logo || '',
        contact: pharmacy.contact,
        address: pharmacy.address,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccess('');
        try {
            const updatedPharmacy = await api.updatePharmacyInformation(pharmacy.id, formData);
            onUpdate(updatedPharmacy);
            setSuccess('Your changes have been submitted for approval.');
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
        }
        setIsSubmitting(false);
    };
    
    const hasPendingChanges = pharmacy.updateStatus === 'pending_approval';

    return (
        <SettingsFormWrapper title="Pharmacy Information" subtitle="Update your pharmacy's public details.">
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-md dark:bg-green-900/30 dark:text-green-300 mb-4">{success}</div>}
            
            {hasPendingChanges && (
                <div className="p-3 bg-yellow-100 text-yellow-700 rounded-md dark:bg-yellow-900/30 dark:text-yellow-300 mb-4">
                    <p className="font-bold">You have changes pending approval.</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                        {Object.entries(pharmacy.pendingChanges || {}).map(([key, value]) => (
                            <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
                        ))}
                    </ul>
                </div>
            )}

            {pharmacy.updateStatus === 'rejected' && (
                 <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-300 mb-4">
                    <p className="font-bold">Your last update was rejected.</p>
                    <p className="text-sm mt-1">Reason: {pharmacy.rejectionReason}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div><Label htmlFor="name">Pharmacy Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div><Label htmlFor="logo">Logo URL</Label><Input id="logo" name="logo" value={formData.logo} onChange={handleChange} /></div>
                <div><Label htmlFor="contact">Contact Phone</Label><Input id="contact" name="contact" value={formData.contact} onChange={handleChange} required /></div>
                <div><Label htmlFor="address">Address</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} required /></div>
                <Button type="submit" disabled={isSubmitting || hasPendingChanges}>
                    {isSubmitting ? 'Submitting...' : (hasPendingChanges ? 'Pending Approval' : 'Save & Submit for Approval')}
                </Button>
            </form>
        </SettingsFormWrapper>
    );
};

const PharmacyStaff: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [staff, setStaff] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<User | null>(null);

    const refreshStaff = useCallback(() => {
        api.getStaff(pharmacy.id).then(setStaff);
    }, [pharmacy.id]);

    useEffect(() => {
        refreshStaff();
    }, [refreshStaff]);
    
    const handleEdit = (user: User) => {
        setEditingStaff(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };
    
    const handleSave = async (data: any, isNew: boolean) => {
        if (isNew) {
            await api.addPharmacyStaff({ ...data, pharmacyId: pharmacy.id });
        } else {
            const { password, ...staffData } = data;
            await api.updatePlatformStaff(staffData as User, password);
        }
        refreshStaff();
        setIsModalOpen(false);
    };

    const handleStatusToggle = async (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'reactivate' : 'suspend'} ${user.name}?`)) {
            await api.updateUserStatus(user.id, newStatus);
            refreshStaff();
        }
    };


    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Manage Staff</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, and manage your pharmacy's staff members.</p>
                </div>
                <Button onClick={handleAdd}><IconPlusCircle className="mr-2 h-5 w-5"/> Add Staff</Button>
            </div>

            <Table headers={['Name', 'Email', 'Role', 'Branch', 'Status', 'Actions']}>
                {staff.map(user => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.branchName}</TableCell>
                        <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusColor(user.status)}`}>{user.status}</span></TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleEdit(user)} className="!text-xs !py-1 !px-2">Edit</Button>
                                <Button onClick={() => handleStatusToggle(user)} variant={user.status === 'active' ? 'danger' : 'secondary'} className="!text-xs !py-1 !px-2">{user.status === 'active' ? 'Suspend' : 'Reactivate'}</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>

            {isModalOpen && <PharmacyStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} staff={editingStaff} pharmacy={pharmacy} onSave={handleSave} />}
        </div>
    );
};

const PharmacyStaffModal: React.FC<{isOpen: boolean; onClose: () => void; staff: User | null; pharmacy: Pharmacy; onSave: (data: any, isNew: boolean) => void}> = ({isOpen, onClose, staff, pharmacy, onSave}) => {
    const [name, setName] = useState(staff?.name || '');
    const [email, setEmail] = useState(staff?.email || '');
    const [role, setRole] = useState(staff?.role || Role.CASHIER);
    const [branchName, setBranchName] = useState(staff?.branchName || '');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            id: staff?.id,
            name,
            email,
            role,
            branchName,
            username: email.split('@')[0],
            password: password || undefined,
        };
        onSave(data, !staff);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={staff ? "Edit Staff" : "Add New Staff"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="staff-name">Full Name</Label><Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div><Label htmlFor="staff-email">Email</Label><Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div><Label htmlFor="staff-branch">Branch Name</Label><Input id="staff-branch" value={branchName} onChange={(e) => setBranchName(e.target.value)} required /></div>
                <div>
                    <Label htmlFor="staff-role">Role</Label>
                    <Select id="staff-role" value={role} onChange={e => setRole(e.target.value as Role)} required>
                        <option value={Role.CASHIER}>Cashier</option>
                        <option value={Role.MANAGER}>Manager</option>
                        <option value={Role.SUB_ADMIN}>Sub-Admin</option>
                        <option value={Role.PHARMACY_ADMIN}>Pharmacy Admin</option>
                    </Select>
                </div>
                <div><Label htmlFor="staff-password">Password</Label><Input id="staff-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={staff ? "Leave blank to keep current" : "Required"} required={!staff} /></div>
                <div className="flex justify-end space-x-2 pt-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save Staff</Button></div>
            </form>
        </Modal>
    )
};

const DefinitionManager: React.FC<{
    title: string;
    items: { id: string; name: string }[];
    onAdd: (name: string) => Promise<any>;
    onUpdate: (item: { id: string; name: string }) => Promise<any>;
    onDelete: (id: string) => Promise<void>;
}> = ({ title, items, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ id: string; name: string } | null>(null);
    const [name, setName] = useState('');

    const handleOpenModal = (item: {id: string; name: string} | null = null) => {
        setEditingItem(item);
        setName(item?.name || '');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        if (editingItem) {
            await onUpdate({ ...editingItem, name });
        } else {
            await onAdd(name);
        }
        setIsModalOpen(false);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{title}</h3>
                <Button onClick={() => handleOpenModal()}><IconPlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
                {items.map(item => (
                    <li key={item.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                        <span>{item.name}</span>
                        <div className="flex space-x-2">
                            <Button className="!py-1 !px-2 !text-xs" onClick={() => handleOpenModal(item)}>Edit</Button>
                            <Button variant="danger" className="!py-1 !px-2 !text-xs" onClick={() => onDelete(item.id)}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? `Edit ${title}` : `Add New ${title}`}>
                <div className="space-y-4">
                    <Label htmlFor="def-name">Name</Label>
                    <Input id="def-name" value={name} onChange={e => setName(e.target.value)} />
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

const PharmacyDefinitions: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [categories, setCategories] = useState<MedicineCategory[]>([]);
    const [types, setTypes] = useState<MedicineType[]>([]);
    const [units, setUnits] = useState<MedicineUnit[]>([]);

    const refresh = useCallback(() => {
        api.getMedicineCategories(pharmacy.id).then(setCategories);
        api.getMedicineTypes(pharmacy.id).then(setTypes);
        api.getMedicineUnits(pharmacy.id).then(setUnits);
    }, [pharmacy.id]);

    useEffect(() => { refresh() }, [refresh]);

    return (
        <div className="space-y-4">
             <div>
                <h2 className="text-xl font-bold">Definitions</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage categories, types, and units for medicines in your pharmacy.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DefinitionManager title="Categories" items={categories} 
                    onAdd={async (name) => { await api.addMedicineCategory({ pharmacyId: pharmacy.id, name }); refresh(); }}
                    // Fix: Pass pharmacyId along with item to match the expected type for update API.
                    onUpdate={async (item) => { await api.updateMedicineCategory({ ...item, pharmacyId: pharmacy.id }); refresh(); }}
                    onDelete={async (id) => { await api.deleteMedicineCategory(id); refresh(); }}
                />
                <DefinitionManager title="Types" items={types} 
                    onAdd={async (name) => { await api.addMedicineType({ pharmacyId: pharmacy.id, name }); refresh(); }}
                    // Fix: Pass pharmacyId along with item to match the expected type for update API.
                    onUpdate={async (item) => { await api.updateMedicineType({ ...item, pharmacyId: pharmacy.id }); refresh(); }}
                    onDelete={async (id) => { await api.deleteMedicineType(id); refresh(); }}
                />
                 <DefinitionManager title="Units" items={units} 
                    onAdd={async (name) => { await api.addMedicineUnit({ pharmacyId: pharmacy.id, name }); refresh(); }}
                    // Fix: Pass pharmacyId along with item to match the expected type for update API.
                    onUpdate={async (item) => { await api.updateMedicineUnit({ ...item, pharmacyId: pharmacy.id }); refresh(); }}
                    onDelete={async (id) => { await api.deleteMedicineUnit(id); refresh(); }}
                />
            </div>
        </div>
    );
};

const PharmacyBilling: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlanDetails[]>([]);
    const [settings, setSettings] = useState<PlatformSettings | null>(null);

    useEffect(() => {
        api.getPharmacyPaymentTransactions(pharmacy.id).then(setTransactions);
        api.getSubscriptionPlans().then(setPlans);
        api.getPlatformSettings().then(setSettings);
    }, [pharmacy.id]);
    
    const currentPlan = plans.find(p => p.name === pharmacy.subscriptionPlan);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Payment History</h2>
                        <Table headers={['Date', 'Plan', 'Amount', 'Method', 'Status']}>
                            {transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                                    <TableCell>{tx.plan}</TableCell>
                                    <TableCell>{formatCurrency(tx.amount, tx.currency)}</TableCell>
                                    <TableCell>{tx.paymentMethod}</TableCell>
                                    <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(tx.status)}`}>{tx.status}</span></TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </Card>
                </div>
                <div>
                     <Card className="mb-6">
                        <h3 className="text-lg font-bold mb-2">Current Plan</h3>
                        {currentPlan && (
                            <>
                                <p className="text-2xl font-bold">{currentPlan.name}</p>
                                <p>{formatCurrency(currentPlan.price, 'USD')} / month</p>
                                <Button className="w-full mt-4">Upgrade Plan</Button>
                            </>
                        )}
                    </Card>
                    <Card>
                        <h3 className="text-lg font-bold