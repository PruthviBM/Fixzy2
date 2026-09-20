import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLoader, FiZap } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from './AuthLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupPage({ navigate }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', company: '', email: '', password: '', confirmPassword: '', terms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.company.trim() || !form.email.trim() || !form.password || !form.confirmPassword) return setError('Complete all required fields.');
    if (!emailPattern.test(form.email.trim())) return setError('Enter a valid work email.');
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) return setError('Password must be at least 8 characters and include a number and uppercase letter.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (!form.terms) return setError('Accept the terms and privacy policy to continue.');
    setIsLoading(true);
    try { await signUp(form); navigate('/login'); } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  };

  return (
    <AuthLayout onBack={() => navigate('/')}>
      <div className="flex items-center gap-2 mb-6 lg:hidden"><div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><FiZap /></div><strong>Fixzy</strong></div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">Create workspace</p>
      <h2 className="text-3xl font-bold tracking-tight">Start finding friction</h2>
      <p className="mt-2 text-sm text-light-textMuted dark:text-dark-textMuted">Set up your Fixzy workspace in a minute.</p>
      <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-4" noValidate>
        {[['fullName', 'Full name', 'Alex Morgan'], ['company', 'Company / organization', 'Acme Product'], ['email', 'Work email', 'you@company.com']].map(([key, label, placeholder]) => <label key={key} className="block text-sm font-medium sm:col-span-1">{label}<input value={form[key]} onChange={(e) => update(key, e.target.value)} type={key === 'email' ? 'email' : 'text'} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surfaceAlt px-3.5 py-3 outline-none focus:border-indigo-500" /></label>)}
        <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4"><label className="block text-sm font-medium">Password<div className="relative mt-2"><input value={form.password} onChange={(e) => update('password', e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="8+ characters" className="w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surfaceAlt px-3.5 py-3 pr-11 outline-none focus:border-indigo-500" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-light-textMuted" aria-label="Toggle password visibility">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div></label><label className="block text-sm font-medium">Confirm password<input value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Repeat password" className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surfaceAlt px-3.5 py-3 outline-none focus:border-indigo-500" /></label></div>
        <label className="sm:col-span-2 flex items-start gap-2 text-sm text-light-textMuted dark:text-dark-textMuted"><input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} className="mt-1 accent-indigo-600" /> <span>I agree to the Fixzy <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms</button> and <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</button>.</span></label>
        {error && <p role="alert" className="sm:col-span-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        <button disabled={isLoading} className="sm:col-span-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 flex items-center justify-center gap-2">{isLoading && <FiLoader className="animate-spin" />} {isLoading ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-light-textMuted dark:text-dark-textMuted">Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Log in</button></p>
    </AuthLayout>
  );
}
