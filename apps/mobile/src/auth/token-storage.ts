import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'mesura.accessToken';
const API_URL_KEY = 'mesura.apiUrl';
const webMemory = new Map<string, string>();

/** Keychain / Keystore on device. On web (dev only) values live in memory. */
function secureItem(key: string) {
  return {
    async get(): Promise<string | null> {
      if (Platform.OS === 'web') return webMemory.get(key) ?? null;
      return SecureStore.getItemAsync(key);
    },
    async set(value: string): Promise<void> {
      if (Platform.OS === 'web') {
        webMemory.set(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    },
    async clear(): Promise<void> {
      if (Platform.OS === 'web') {
        webMemory.delete(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    },
  };
}

export const tokenStorage = secureItem(TOKEN_KEY);
/** Sandbox API server chosen on the login screen (null = build default). */
export const apiUrlStorage = secureItem(API_URL_KEY);
