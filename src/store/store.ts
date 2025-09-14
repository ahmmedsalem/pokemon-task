import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './pokemonApi';

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: [pokemonApi.reducerPath],
      },
    }).concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;