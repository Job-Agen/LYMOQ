import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'po.accessToken';
let webMemoryToken: string | null = null;

/** Keychain / Keystore on device. On web (dev only) the token lives in memory. */
export const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') return webMemoryToken;
    return SecureStore.getItemAsync(KEY);
  },
  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      webMemoryToken = token;
      return;
    }
    await SecureStore.setItemAsync(KEY, token);
  },
  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      webMemoryToken = null;
      return;
    }
    await SecureStore.deleteItemAsync(KEY);
  },
};
