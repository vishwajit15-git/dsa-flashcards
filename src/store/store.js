import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { STORAGE_KEY } from '../config.js';
import cardsReducer, { hydrate } from './cardsSlice.js';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
  },
});

let isReady = false;

store.subscribe(() => {
  if (!isReady) return;
  try {
    const state = store.getState().cards;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  } catch {
    // Ignore serialization failures
  }
});

export const loadStore = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      store.dispatch(hydrate(JSON.parse(raw)));
    }
  } catch {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  } finally {
    isReady = true;
  }
};
