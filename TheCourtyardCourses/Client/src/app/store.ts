import { configureStore } from '@reduxjs/toolkit';
import { themeReducer, authReducer } from '../features/themes/themeSlice';

export const store = configureStore({
  reducer: { theme: themeReducer, auth: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
