import { LucideIcon } from "lucide-react";

export type SettingsTabId = "profile" | "appearance" | "security" | "notifications" | "data" | "api";

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: Date;
  loginSessions: LoginSession[];
  trustedDevices: TrustedDevice[];
}

export interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  addedDate: Date;
  lastUsed: Date;
}

export interface NotificationSettings {
  email: {
    messages: boolean;
    mentions: boolean;
    updates: boolean;
    marketing: boolean;
  };
  push: {
    messages: boolean;
    mentions: boolean;
    updates: boolean;
  };
  desktop: {
    messages: boolean;
    mentions: boolean;
  };
}

export interface DataSettings {
  storageUsed: number;
  storageLimit: number;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup?: Date;
}

export interface ApiSettings {
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  rateLimits: RateLimit;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdDate: Date;
  lastUsed?: Date;
  isActive: boolean;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdDate: Date;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  currentUsage: {
    minute: number;
    hour: number;
    day: number;
  };
}