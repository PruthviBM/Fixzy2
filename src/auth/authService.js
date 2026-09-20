const USER_KEY = 'fixzy_user';
const ACCOUNTS_KEY = 'fixzy_accounts';
const SESSION_KEY = 'fixzy_session';

const readJson = (storage, key, fallback) => {
  try {
    return JSON.parse(storage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const getAccounts = () => readJson(localStorage, ACCOUNTS_KEY, {});

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const saveSession = (user, rememberMe) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSessionStorage = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  const session = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || localStorage.getItem(USER_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    clearSessionStorage();
    return null;
  }
};

export const login = async ({ email, password, rememberMe = false }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getAccounts();
  const account = accounts[normalizedEmail];
  const passwordHash = await hashPassword(password);
  const isDemoAccount = normalizedEmail === 'demo@fixzy.ai' && password === 'demo1234';

  if (!isDemoAccount && (!account || account.passwordHash !== passwordHash)) {
    throw new Error('The email or password is incorrect.');
  }

  const user = isDemoAccount
    ? {
        id: 'demo-user',
        fullName: 'Demo Analyst',
        company: 'Fixzy Demo Workspace',
        email: normalizedEmail,
        role: 'Product Analyst',
        createdAt: '2025-01-15',
        isDemo: true,
      }
    : { ...account, passwordHash: undefined, isDemo: false };

  delete user.passwordHash;
  saveSession(user, rememberMe);
  return user;
};

export const register = async ({ fullName, company, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getAccounts();
  if (accounts[normalizedEmail]) {
    throw new Error('An account with this email already exists.');
  }

  accounts[normalizedEmail] = {
    id: `user-${Date.now()}`,
    fullName: fullName.trim(),
    company: company.trim(),
    email: normalizedEmail,
    role: 'Workspace member',
    createdAt: new Date().toISOString().slice(0, 10),
    passwordHash: await hashPassword(password),
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const logout = () => {
  clearSessionStorage();
};
