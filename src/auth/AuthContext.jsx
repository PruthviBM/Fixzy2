import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login, logout, register } from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsReady(true);
  }, []);

  const signIn = async (credentials) => {
    const nextUser = await login(credentials);
    setUser(nextUser);
    setActivity((current) => [{ action: 'Logged in', status: 'Success', date: new Date().toISOString() }, ...current]);
    return nextUser;
  };

  const signUp = async (details) => register(details);

  const signOut = () => {
    if (user) {
      setActivity((current) => [{ action: 'Logged out', status: 'Success', date: new Date().toISOString() }, ...current]);
    }
    logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    const nextUser = { ...user, ...updates };
    localStorage.setItem('fixzy_user', JSON.stringify(nextUser));
    setUser(nextUser);
    setActivity((current) => [{ action: 'Profile updated', status: 'Success', date: new Date().toISOString() }, ...current]);
  };

  const recordActivity = (action, status = 'Success') => {
    if (user?.isDemo) return;
    setActivity((current) => [{ action, status, date: new Date().toISOString() }, ...current]);
  };

  return (
    <AuthContext.Provider value={{ user, isReady, activity, signIn, signUp, signOut, updateUser, recordActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
