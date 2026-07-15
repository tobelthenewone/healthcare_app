// Starting point of the application's login page component, which handles user authentication and navigation after successful login. It uses React hooks for state management and Next.js routing for navigation. The component also includes error handling for failed login attempts.
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import PublicRoute from "@/components/auth/public-route";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [typedText, setTypedText] = useState("");
  const fullText = "A healthier life starts with smart connection.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const firstPart = typedText.slice(0, 30);
  const secondPart = typedText.slice(30);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
        {/* Left Side - Visual Splash & Brand (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 relative overflow-hidden flex-col justify-between p-12 text-white">
          {/* Ambient Glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-drift-slow" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-drift-slow" />

          {/* Logo & Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <svg className="w-8 h-8 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 4A17.926 17.926 0 003 12c0 2.871.67 5.585 1.871 8m14.13 0a17.93 17.93 0 001.87-8c0-2.871-.67-5.585-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.513.692l-1.17 1.4a2 2 0 01-3.07 0l-1.17-1.4A2 2 0 006.58 8H6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              HealthSync
            </span>
          </div>

          {/* Core App Showcase / Features */}
          <div className="relative z-10 my-auto max-w-md space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                Workspace Portal
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl min-h-[6.5rem] lg:min-h-[7.5rem]">
                {firstPart}
                {secondPart && (
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    {secondPart}
                  </span>
                )}
                <span className="text-emerald-400 animate-ping">|</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Connect seamlessly with top medical professionals, manage your appointments, and track your clinical history in one integrated platform.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div>
                <p className="text-3xl font-bold text-white">99.9%</p>
                <p className="text-sm text-slate-400 mt-1">Booking Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-sm text-slate-400 mt-1">Professional Care</p>
              </div>
            </div>
          </div>

          {/* Testimonial card */}
          <div className="relative z-10 bg-slate-800/40 border border-slate-700/30 backdrop-blur-md p-6 rounded-2xl max-w-md shadow-2xl">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              &ldquo;HealthSync has revolutionized how we orchestrate scheduling and care plans. The transition was flawless, and patient feedback has been outstanding.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-emerald-500/20">
                EV
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Dr. Elizabeth Vance</h4>
                <p className="text-xs text-emerald-400">Chief Medical Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
          {/* Subtle mobile glows */}
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl lg:hidden" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl lg:hidden" />

          <div className="w-full max-w-md bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-emerald-500/5 transition-all duration-500">
            
            {/* Mobile Logo Branding */}
            <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 4A17.926 17.926 0 003 12c0 2.871.67 5.585 1.871 8m14.13 0a17.93 17.93 0 001.87-8c0-2.871-.67-5.585-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.513.692l-1.17 1.4a2 2 0 01-3.07 0l-1.17-1.4A2 2 0 006.58 8H6" />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-slate-800 dark:text-slate-100">
                HealthSync
              </span>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Please enter your credentials to access your workspace
              </p>
            </div>

            {/* Error Message alert block */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-start gap-3 animate-headShake">
                <svg className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-rose-800 dark:text-rose-300">
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 012.224-3.224m2.441-2.441A9.973 9.973 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-3.411-3.411l-3.59-3.59" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 text-sm mt-8 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Don&apos;t have an account? </span>
              <Link href="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline transition">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}

