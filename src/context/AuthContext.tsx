import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthProvider, AuthToast } from '../types/auth';

interface AuthContextType {
  user: User | null;
  theme: 'light' | 'dark';
  currentProvider: AuthProvider;
  toasts: AuthToast[];
  pendingCode: { phone: string; code: string; provider: AuthProvider } | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentProvider: (provider: AuthProvider) => void;
  sendVerificationCode: (phone: string, provider: AuthProvider) => string;
  verifyAndLogin: (phone: string, code: string, provider: AuthProvider) => { success: boolean; error?: string };
  loginWithQr: (provider: AuthProvider) => void;
  loginDemo: (type: 'durov' | 'ivan') => void;
  logout: () => void;
  dismissToast: (id: string) => void;
  fillCodeDirectly: (code: string) => void;
  prefilledCodeInput: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vk_tg_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('vk_tg_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'light';
  });

  const [currentProvider, setCurrentProvider] = useState<AuthProvider>('vk');
  const [toasts, setToasts] = useState<AuthToast[]>([]);
  const [pendingCode, setPendingCode] = useState<{ phone: string; code: string; provider: AuthProvider } | null>(null);
  const [prefilledCodeInput, setPrefilledCodeInput] = useState<string>('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('vk_tg_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vk_tg_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vk_tg_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fillCodeDirectly = (code: string) => {
    setPrefilledCodeInput(code);
  };

  const sendVerificationCode = (phone: string, provider: AuthProvider): string => {
    // Generate a clean 6-digit random code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingCode({ phone, code: generatedCode, provider });
    setPrefilledCodeInput('');

    const newToast: AuthToast = {
      id: Math.random().toString(36).substring(7),
      title: provider === 'vk' ? 'VK ID: Проверочный код' : 'Telegram: Код авторизации',
      message:
        provider === 'vk'
          ? `Никому не сообщайте код: ${generatedCode}. Вход с браузера Chrome на Windows.`
          : `Код для входа: ${generatedCode}. Если вы не запрашивали вход, проигнорируйте это уведомление.`,
      code: generatedCode,
      provider,
      timestamp: Date.now(),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]);
    return generatedCode;
  };

  const verifyAndLogin = (
    phone: string,
    code: string,
    provider: AuthProvider
  ): { success: boolean; error?: string } => {
    if (!pendingCode || pendingCode.provider !== provider) {
      // Allow demo shortcut if code is 123456 or matches
      if (code !== '123456' && (!pendingCode || pendingCode.code !== code)) {
        return { success: false, error: 'Код не был запрошен или истек' };
      }
    }

    if (pendingCode && pendingCode.code !== code && code !== '123456') {
      return { success: false, error: 'Неверный код подтверждения' };
    }

    // Success login: create user based on phone & provider
    const cleanPhone = phone.trim();
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+7 ${cleanPhone}`;
    const newUser: User = {
      id: `${provider}_${Math.floor(100000 + Math.random() * 900000)}`,
      name: provider === 'vk' ? 'Пользователь ВКонтакте' : 'Telegram Пользователь',
      username: provider === 'vk' ? `vk_user_${Math.floor(1000 + Math.random() * 9000)}` : `tg_${Math.floor(1000 + Math.random() * 9000)}`,
      phone: formattedPhone,
      avatar:
        provider === 'vk'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      provider,
      bio: provider === 'vk' ? 'Аккаунт подтвержден через VK ID' : 'Аккаунт подключен через Telegram Web',
      verified: true,
      joinedDate: 'Ноябрь 2026',
    };

    setUser(newUser);
    setPendingCode(null);
    setPrefilledCodeInput('');
    return { success: true };
  };

  const loginWithQr = (provider: AuthProvider) => {
    const newUser: User = {
      id: `${provider}_qr_${Math.floor(100000 + Math.random() * 900000)}`,
      name: provider === 'vk' ? 'Александр Волков' : 'Павел Дуров',
      username: provider === 'vk' ? 'alex_volkov' : 'durov',
      phone: '+7 999 777-88-99',
      avatar:
        provider === 'vk'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      provider,
      bio: provider === 'vk' ? 'Вход по QR-коду через приложение VK' : 'Быстрый вход через QR-код Telegram',
      verified: true,
      joinedDate: 'Октябрь 2024',
    };
    setUser(newUser);
  };

  const loginDemo = (type: 'durov' | 'ivan') => {
    if (type === 'durov') {
      setUser({
        id: 'tg_durov',
        name: 'Павел Дуров',
        username: 'durov',
        phone: '+7 999 123-45-67',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        provider: 'telegram',
        bio: 'Building the future of communication. Freedom & Speed.',
        verified: true,
        joinedDate: '14 августа 2013',
      });
      setCurrentProvider('telegram');
    } else {
      setUser({
        id: 'vk_ivan',
        name: 'Иван Иванов',
        username: 'ivan_ivanov',
        phone: '+7 916 555-01-99',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        provider: 'vk',
        bio: 'Разработчик интерфейсов, фотограф и меломан.',
        verified: true,
        joinedDate: '10 октября 2006',
      });
      setCurrentProvider('vk');
    }
  };

  const logout = () => {
    setUser(null);
    setPendingCode(null);
    setPrefilledCodeInput('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        theme,
        currentProvider,
        toasts,
        pendingCode,
        setTheme,
        setCurrentProvider,
        sendVerificationCode,
        verifyAndLogin,
        loginWithQr,
        loginDemo,
        logout,
        dismissToast,
        fillCodeDirectly,
        prefilledCodeInput,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderContext');
  }
  return context;
};
