import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  isPaid: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setPaidStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bioscan_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bioscan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bioscan_user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      email,
      name: name || email.split('@')[0],
      isPaid: localStorage.getItem(`paid_${email}`) === 'true',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const setPaidStatus = (status: boolean) => {
    if (user) {
      const updated = { ...user, isPaid: status };
      localStorage.setItem(`paid_${user.email}`, status ? 'true' : 'false');
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setPaidStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
