import React, { useState } from 'react';
import { FiActivity, FiCalendar, FiCheckCircle, FiGlobe, FiLock, FiLogOut, FiMail, FiMoon, FiSave, FiShield, FiSun, FiUser } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../context/AppContext';

const demoActivity = [
  ['Demo mode started', 'Today, 10:42 AM', 'Demo'],
  ['Diagnosis generated', 'Today, 10:46 AM', 'Demo'],
  ['Experiment created', 'Yesterday, 4:18 PM', 'Demo'],
];

export function ProfileView({ navigate }) {
  const { user: authUser, activity, updateUser, signOut } = useAuth();
  const user = authUser || { fullName: 'Demo Analyst', company: 'Fixzy Demo Workspace', email: 'demo@fixzy.ai', role: 'Product Analyst', createdAt: 'Sample account', isDemo: true };
  const { theme, setTheme } = useTheme();
  const [section, setSection] = useState('profile');
  const [name, setName] = useState(user.fullName);
  const [company, setCompany] = useState(user.company);
  const realActivity = activity.map((item) => [item.action, new Date(item.date).toLocaleString(), item.status]);
  const entries = user.isDemo ? demoActivity : realActivity;

  const saveProfile = () => updateUser({ fullName: name, company });
  const logout = () => { signOut(); navigate('/login', true); };

  return <div className="max-w-6xl mx-auto pb-12">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7"><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Account</p><h1 className="text-3xl font-bold text-light-text dark:text-dark-text mt-1">Profile & settings</h1><p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-2">Manage your identity, workspace, and account activity.</p></div><button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:underline"><FiLogOut /> Log out</button></div>
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      <nav className="glass-panel rounded-xl p-2 h-fit">{[['profile', FiUser, 'Personal information'], ['security', FiShield, 'Account & security'], ['preferences', FiSun, 'Preferences'], ['workspace', FiGlobe, 'Workspace'], ['activity', FiActivity, 'Activity history']].map(([key, Icon, label]) => <button key={key} onClick={() => setSection(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm ${section === key ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-light-textMuted dark:text-dark-textMuted hover:bg-light-surfaceAlt dark:hover:bg-dark-surfaceAlt'}`}><Icon className="w-4 h-4" />{label}</button>)}</nav>
      <section className="glass-panel rounded-xl p-5 sm:p-7">
        {section === 'profile' && <><div className="flex items-center gap-4 pb-6 border-b border-light-border dark:border-dark-border"><div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">{user.fullName?.[0]}</div><div><h2 className="text-xl font-bold">{user.fullName}</h2><p className="text-sm text-light-textMuted dark:text-dark-textMuted">{user.role}</p></div></div><div className="grid sm:grid-cols-2 gap-5 mt-6"><label className="text-sm font-medium">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-transparent px-3 py-2.5" /></label><label className="text-sm font-medium">Email<input value={user.email} readOnly className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceAlt dark:bg-dark-surfaceAlt px-3 py-2.5 text-light-textMuted" /></label><label className="text-sm font-medium">Company / organization<input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2 w-full rounded-lg border border-light-border dark:border-dark-border bg-transparent px-3 py-2.5" /></label><Info label="Role" value={user.role} /><Info label="Account created" value={user.createdAt} /></div><button onClick={saveProfile} className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold"><FiSave /> Save profile</button></>}
        {section === 'security' && <SettingSection title="Account & security"><Info icon={FiMail} label="Login email" value={user.email} /><Info icon={FiLock} label="Password" value="••••••••  Change password" /><Info icon={FiCalendar} label="Last login" value={user.isDemo ? 'Demo session · Today' : 'This session'} /><Info icon={FiShield} label="Active session" value="Current browser · Active" /><button onClick={logout} className="mt-5 flex items-center gap-2 text-sm font-semibold text-rose-600"><FiLogOut /> Log out of this session</button></SettingSection>}
        {section === 'preferences' && <SettingSection title="Preferences"><div className="flex items-center justify-between py-4 border-b border-light-border dark:border-dark-border"><div><p className="font-semibold text-sm">Theme</p><p className="text-xs text-light-textMuted mt-1">Choose how Fixzy looks in this browser.</p></div><div className="flex gap-1 rounded-lg bg-light-surfaceAlt dark:bg-dark-surfaceAlt p-1">{[['light', FiSun], ['dark', FiMoon]].map(([value, Icon]) => <button key={value} onClick={() => setTheme(value)} className={`p-2 rounded-md ${theme === value ? 'bg-white dark:bg-dark-surface text-indigo-600 shadow-sm' : 'text-light-textMuted'}`} title={value}>{<Icon />}</button>)}</div></div><Info label="Notifications" value="Product updates and workspace alerts" /><Info label="Language" value="English (US)" /><Info label="Timezone" value="Local browser timezone" /></SettingSection>}
        {section === 'workspace' && <SettingSection title="Workspace"><Info label="Workspace / company" value={user.company} /><Info label="Project" value="Checkout Experience" /><Info label="Connected website" value="checkout.fixzy-demo.com" /><Info label="Data source" value="Demo dataset · Ready" /><Info label="Current plan" value="Product team · Trial" /></SettingSection>}
        {section === 'activity' && <SettingSection title="Activity history"><p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-5">{user.isDemo ? 'Demo Activity · examples from the Fixzy walkthrough' : 'Real activity from this browser session'}</p><div className="space-y-3">{entries.length ? entries.map(([action, date, status], index) => <div key={`${action}-${index}`} className="flex items-center gap-3 rounded-lg border border-light-border dark:border-dark-border p-3"><FiCheckCircle className="text-emerald-500 shrink-0" /><div className="flex-1"><p className="text-sm font-semibold">{action}</p><p className="text-xs text-light-textMuted mt-1">{date}</p></div><span className="text-xs font-medium text-emerald-600">{status}</span></div>) : <p className="text-sm text-light-textMuted">No activity recorded yet.</p>}</div></SettingSection>}
      </section>
    </div>
  </div>;
}

function Info({ icon: Icon, label, value }) { return <div className="flex items-start gap-3 py-3 border-b border-light-border dark:border-dark-border"><div className="text-light-textMuted dark:text-dark-textMuted mt-0.5">{Icon ? <Icon /> : null}</div><div><p className="text-xs text-light-textMuted dark:text-dark-textMuted">{label}</p><p className="text-sm font-medium mt-1">{value}</p></div></div>; }
function SettingSection({ title, children }) { return <><h2 className="text-xl font-bold mb-5">{title}</h2><div>{children}</div></>; }
