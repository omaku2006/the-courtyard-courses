import { configureStore } from '@reduxjs/toolkit';
import { themeReducer } from '../features/themes/themeSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: { theme: themeReducer, auth: authReducer },
});

store.subscribe(() => {
  const theme = store.getState().theme.mode;
  localStorage.setItem('theme', theme);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
