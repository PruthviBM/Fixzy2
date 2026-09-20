import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLoader, FiZap } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from './AuthLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ navigate }) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!emailPattern.test(form.email.trim())) return setError('Enter a valid work email.');
    if (!form.password) return setError('Enter your password.');
    setIsLoading(true);
    try {
      await signIn(form);
      navigate('/setup', true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@fixzy.ai', password: 'demo1234', rememberMe: false });

  return (
    <AuthLayout onBack={() => navigate('/')}>
      <div className="flex items-center gap-2 mb-8 lg:hidden"><div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><FiZap /></div><strong>Fixzy</strong></div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">Welcome back</p>
      <h2 className="text-3xl font-bold tracking-tight">Sign in to your workspace</h2>
      <p className="mt-2 text-sm text-light-textMuted dark:text-dark-textMuted">Continue your product diagnosis work, or create an account to connect your own data.</p>
      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <label className="block text-sm font-medium">Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" autoComplete="email" placeholder="you@company.com" className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surfaceAlt px-3.5 py-3 outline-none focus:border-indigo-500" /></label>
        <label className="block text-sm font-medium">Password<div className="relative mt-2"><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surfaceAlt px-3.5 py-3 pr-11 outline-none focus:border-indigo-500" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-3.5 text-light-textMuted">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div></label>
        <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-light-textMuted dark:text-dark-textMuted"><input type="checkbox" checked={form.rememberMe} onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })} className="accent-indigo-600" /> Remember me</label><button type="button" onClick={() => setError('Password reset is available when your workspace email provider is connected.')} className="text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</button></div>
        {error && <p role="alert" className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        <button disabled={isLoading} className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 flex items-center justify-center gap-2">{isLoading && <FiLoader className="animate-spin" />} {isLoading ? 'Signing in...' : 'Log in'}</button>
      </form>
      <button onClick={fillDemo} className="mt-4 w-full rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/30 py-2.5 text-sm font-medium text-indigo-700 dark:text-indigo-300">Use Demo Login</button>
      <p className="mt-7 text-center text-sm text-light-textMuted dark:text-dark-textMuted">Don't have an account? <button onClick={() => navigate('/signup')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign up</button></p>
    </AuthLayout>
  );
}
