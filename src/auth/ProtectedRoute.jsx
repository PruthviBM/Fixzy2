import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children, onRedirect }) {
  const { user, isReady } = useAuth();
  useEffect(() => {
    if (isReady && !user) onRedirect('/login', true);
  }, [isReady, user, onRedirect]);
  if (!isReady) return null;
  return user ? children : null;
}
