'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AdminLoginProps {
    onLogin: () => void;
}

// Check mobile once at module level (runs on client only)
const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

export function AdminLogin({ onLogin }: AdminLoginProps) {
    // Capture mobile state once on first render - never changes to avoid re-render blink
    const isMobileRef = useRef<boolean | null>(null);
    if (isMobileRef.current === null) {
        isMobileRef.current = getIsMobile();
    }
    const isMobile = isMobileRef.current;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Container animation with stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    // Blur fade up animation - blur only on desktop
    const blurFadeUpVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: isMobile ? 'blur(0px)' : 'blur(12px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Line reveal animation
    const lineVariants = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                delay: 0.4,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Login successful
            onLogin();
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 gradient-warm pointer-events-none" />

            {/* Background decorative element */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: isMobile ? 'blur(0px)' : 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
                <span className="text-[20rem] font-serif leading-none select-none text-foreground/[0.02]">
                    JG
                </span>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-10 shadow-xl">
                    {/* Editorial Header */}
                    <motion.div variants={blurFadeUpVariants} className="mb-10">
                        {/* Editorial label */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                                Admin
                            </span>
                            <div className="h-px w-12 bg-primary/40" />
                        </div>

                        {/* Logo */}
                        <div className="mb-6">
                            <span className="text-5xl font-serif tracking-tight">
                                JG
                                <span className="text-primary">.</span>
                            </span>
                        </div>

                        {/* Decorative line */}
                        <motion.div
                            variants={lineVariants}
                            className="decorative-line w-16 mb-6 origin-left"
                        />

                        <h1 className="text-2xl font-serif tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground text-refined leading-relaxed">
                            Enter your credentials to access the dashboard.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        variants={blurFadeUpVariants}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-xs font-medium tracking-[0.15em] uppercase text-primary mb-3"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                className="w-full px-4 py-3.5 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/60"
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium tracking-[0.15em] uppercase text-primary mb-3"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3.5 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/60"
                                placeholder="Enter password"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, filter: isMobile ? 'blur(0px)' : 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-foreground text-background rounded-xl font-medium tracking-wide hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all disabled:opacity-50 mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </motion.form>

                    {/* Footer */}
                    <motion.p
                        variants={blurFadeUpVariants}
                        className="text-center text-xs text-muted-foreground mt-8 tracking-wide"
                    >
                        Protected area. Unauthorized access is prohibited.
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
