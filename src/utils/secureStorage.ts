/**
 * SECURITY FIX: Secure client-side storage with encryption
 * Replaces plain localStorage with encrypted storage for sensitive data
 */

import CryptoJS from 'crypto-js';

// Generate a key from user session or use a default (in production, use proper key management)
const getEncryptionKey = (): string => {
  // In production, derive this from user session or secure key management
  return 'toolsweneed-secure-key-2025'; // This should be dynamic in production
};

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(serialized, getEncryptionKey()).toString();
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, getEncryptionKey());
      const serialized = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!serialized) return null;
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  },

  clear: (): void => {
    // Only clear items that start with 'secure_'
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Session-only storage for temporary sensitive data
export const sessionSecureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(serialized, getEncryptionKey()).toString();
      sessionStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to store encrypted session data:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      const encrypted = sessionStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, getEncryptionKey());
      const serialized = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!serialized) return null;
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to retrieve encrypted session data:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    sessionStorage.removeItem(`secure_${key}`);
  },

  clear: (): void => {
    // Only clear items that start with 'secure_'
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

// Utility to check if data should be encrypted
export const isSensitiveData = (key: string): boolean => {
  const sensitiveKeys = [
    'payment',
    'stripe',
    'user_data',
    'session',
    'auth',
    'token',
    'key',
    'secret'
  ];
  
  return sensitiveKeys.some(sensitiveKey => 
    key.toLowerCase().includes(sensitiveKey)
  );
};