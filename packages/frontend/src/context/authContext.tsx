'use client';

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie } from 'cookies-next';
import useLocalStorage from '@/hooks/useLocalStorage';
import { User } from '@/types';
 
export const SessionContext = createContext({token: null, user: null} as {token: string | null, user: User | null});
 
export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
  }) {
  const [token, setToken] = useState<string | null>(null);
  const [user] = useLocalStorage('user', null) as [User | null];

  useEffect(() => {
    async function getAndSetSessionToken() {
      const token = getCookie('token');
      setToken(token || null);
    }
    getAndSetSessionToken();
  }, []);
  return <SessionContext.Provider value={{token, user}}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const session = useContext(SessionContext);
  return session;
}