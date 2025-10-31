

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { Button, Input, Label } from '../components/ui';
import { IconAlertTriangle, IconPill } from '../components/Icons';
import { PlatformBranding } from '../types';

const LoginPage: React.FC<{ brandingSettings?: PlatformBranding | null }> = ({ brandingSettings }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;

        const content = panel.querySelector<HTMLDivElement>('.levitate-content');
        const shape1 = panel.querySelector<HTMLDivElement>('.levitate-shape-1');
        const shape2 = panel.querySelector<HTMLDivElement>('.levitate-shape-2');
        
        if (!content || !shape1 || !shape2) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = panel.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            
            const mouseX = (x / width - 0.5) * -1; // Invert for natural movement
            const mouseY = (y / height - 0.5) * -1;

            content.style.transform = `translate3d(${mouseX * 15}px, ${mouseY * 20}px, 0)`;
            shape1.style.transform = `translate3d(${mouseX * 35}px, ${mouseY * 45}px, 0)`;
            shape2.style.transform = `translate3d(${mouseX * 25}px, ${mouseY * 35}px, 0)`;
        };

        const handleMouseLeave = () => {
            content.style.transform = 'translate3d(0,0,0)';
            shape1.style.transform = 'translate3d(0,0,0)';
            shape2.style.transform = 'translate3d(0,0,0)';
        };

        panel.addEventListener('mousemove', handleMouseMove);
        panel.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            panel.removeEventListener('mousemove', handleMouseMove);
            panel.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError((err as Error).message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (userEmail: string, userPass: string) => {
        setEmail(userEmail);
        setPassword(userPass);
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-900">
            {/* Left Branding Column */}
            <div ref={panelRef} className="hidden lg:flex w-1/2 bg-indigo-600 text-white flex-col items-center justify-center p-12 text-center relative overflow-hidden" style={{ perspective: '1000px' }}>
                <div className="z-10 levitate-content transition-transform duration-300 ease-out">
                    <div className="flex justify-center items-center mb-6">
                        {brandingSettings?.logoUrl ? (
                            <img src={brandingSettings.logoUrl} alt={`${brandingSettings.name} Logo`} className="h-12" />
                        ) : (
                            <IconPill className="w-12 h-12" />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">{brandingSettings?.name || 'SecurePharm'}</h1>
                    <p className="mt-4 text-lg text-indigo-200">Revolutionizing Pharmacy Management.</p>
                </div>
                {/* Abstract background shapes */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-700/50 rounded-full -translate-x-1/2 -translate-y-1/2 levitate-shape-1 transition-transform duration-300 ease-out"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-700/50 rounded-full translate-x-1/2 translate-y-1/2 levitate-shape-2 transition-transform duration-300 ease-out"></div>
            </div>

            {/* Right Form Column */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back!</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Sign in to continue to {brandingSettings?.name || 'SecurePharm'}.
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email-address">Email address</Label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-start space-x-3 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30">
                                <IconAlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        )}

                        <div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-50 dark:bg-slate-900 text-slate-500">Quick Logins</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button type="button" variant="secondary" className="w-full !font-normal" onClick={() => handleQuickLogin('pharmacyadmin@pharmaone.com', '12345')}>
                            Pharmacy Admin
                        </Button>
                        <Button type="button" variant="secondary" className="w-full !font-normal" onClick={() => handleQuickLogin('subadmin@pharmaone.com', '12345')}>
                            Sub-Admin
                        </Button>
                        <Button type="button" variant="secondary" className="w-full !font-normal" onClick={() => handleQuickLogin('manager@pharmaone.com', '12345')}>
                            Manager
                        </Button>
                        <Button type="button" variant="secondary" className="w-full !font-normal" onClick={() => handleQuickLogin('cashier@pharmaone.com', '12345')}>
                            Cashier
                        </Button>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4">
                        © {new Date().getFullYear()} {brandingSettings?.name || 'SecurePharm'}. Developed by Jadan TECHNOLOGIES.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;