


import React, { useState, useMemo, useCallback, useContext, createContext, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
// Fix: Changed to a default import of Dashboard to resolve a circular dependency issue.
import Dashboard from './pages/Dashboard';
import { User, Role, PlatformSettings } from './types';
import { api } from './services/api';
import { IconAlertTriangle, IconPill, IconShieldOff } from './components/Icons';

// --- App Context ---
interface AppContextType {
  currentUserIP: string;
  setCurrentUserIP: React.Dispatch<React.SetStateAction<string>>;
}
const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUserIP, setCurrentUserIP] = useState('127.0.0.1');
    const value = useMemo(() => ({ currentUserIP, setCurrentUserIP }), [currentUserIP]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


// --- Theme Context ---
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  // Fix: Corrected typo in the closing tag for ThemeContext.Provider.
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  originalUser: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void;
  impersonate: (targetUser: User) => void;
  stopImpersonating: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, pass: string) => {
    // Note: Maintenance check is now handled by the API itself
    const loggedInUser = await api.login(email, pass);
    if (loggedInUser) {
        setUser(loggedInUser);
        return loggedInUser;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    setOriginalUser(null);
  }, []);
  
  const updateUserContext = useCallback((updatedUser: User) => {
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : updatedUser);
  }, []);

  const impersonate = useCallback((targetUser: User) => {
    if (user && user.role === Role.SUPER_ADMIN && !originalUser) {
        setOriginalUser(user);
        setUser(targetUser);
    } else {
        console.error("Impersonation is only available for Super Admins and not while already impersonating.");
    }
  }, [user, originalUser]);

  const stopImpersonating = useCallback(() => {
    if (originalUser) {
        setUser(originalUser);
        setOriginalUser(null);
    }
  }, [originalUser]);


  const value = useMemo(() => ({ user, originalUser, login, logout, updateUserContext, impersonate, stopImpersonating }), [user, originalUser, login, logout, updateUserContext, impersonate, stopImpersonating]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Maintenance Page Component ---
const MaintenancePage: React.FC<{ settings: PlatformSettings | null }> = ({ settings }) => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-full max-w-lg p-8 text-center">
            <IconAlertTriangle className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Under Maintenance</h1>
            <p className="text-slate-600 dark:text-slate-400">
                {settings?.maintenance.message || 'The platform is currently unavailable. Please check back later.'}
            </p>
        </div>
    </div>
);

// --- Blocked Page Component ---
const BlockedPage: React.FC<{ settings: PlatformSettings | null }> = ({ settings }) => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-full max-w-lg p-8 text-center">
            <IconShieldOff className="mx-auto w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h1>
            <p className="text-slate-600 dark:text-slate-400">
                Your IP address has been blocked from accessing this platform for security reasons.
            </p>
            {settings?.branding.contactEmail && (
                 <p className="mt-4 text-sm text-slate-500">
                    If you believe this is an error, please contact support at{' '}
                    <a href={`mailto:${settings.branding.contactEmail}`} className="font-medium text-indigo-600 hover:underline">
                        {settings.branding.contactEmail}
                    </a>
                </p>
            )}
        </div>
    </div>
);


function App() {
  return (
    <AppProvider>
        <ThemeProvider>
          <AuthProvider>
            <Main />
          </AuthProvider>
        </ThemeProvider>
    </AppProvider>
  );
}

function Main() {
    const { user, originalUser } = useAuth();
    const { currentUserIP } = useApp();
    const [settings, setSettings] = useState<PlatformSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getPlatformSettings().then(data => {
            setSettings(data);
            setIsLoading(false);

            // Apply branding color
            const color = data.branding.primaryColor || '#4f46e5';
            const style = document.createElement('style');
            style.innerHTML = `
                :root { --primary-color: ${color}; }
                .bg-indigo-600 { background-color: var(--primary-color) !important; }
                .hover\\:bg-indigo-700:hover { background-color: var(--primary-color) !important; filter: brightness(0.9); }
                .focus\\:ring-indigo-500:focus { --tw-ring-color: var(--primary-color) !important; }
                .text-indigo-600 { color: var(--primary-color) !important; }
                .text-indigo-700 { color: var(--primary-color) !important; }
                .bg-indigo-50 { background-color: ${color}1A !important; }
                .border-indigo-500 { border-color: var(--primary-color) !important; }
            `;
            document.head.appendChild(style);
        }).catch(err => {
            console.error("Failed to load platform settings", err);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <IconPill className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }
    
    // IP Block Check
    const isIpBlocked = settings?.ipBlacklist.some(ip => ip.ipAddress === currentUserIP);
    if (isIpBlocked) {
        return <BlockedPage settings={settings} />;
    }

    const isMaintenance = settings?.maintenance.isEnabled;
    const canBypassMaintenance = user?.role === Role.SUPER_ADMIN || !!originalUser;

    if (isMaintenance && !canBypassMaintenance) {
        return <MaintenancePage settings={settings} />;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            {user ? <Dashboard user={user} brandingSettings={settings?.branding} /> : <LoginPage brandingSettings={settings?.branding} />}
        </div>
    );
}

export default App;