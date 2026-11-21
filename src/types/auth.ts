export type AuthProvider = 'vk' | 'telegram';

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  avatar: string;
  provider: AuthProvider;
  bio?: string;
  verified?: boolean;
  joinedDate: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuthToast {
  id: string;
  title: string;
  message: string;
  code?: string;
  provider: AuthProvider;
  timestamp: number;
}
