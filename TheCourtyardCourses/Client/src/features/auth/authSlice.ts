import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ImageRef {
  url: string | null;
  publicId: string | null;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatarImage: ImageRef | null;
  headerImage: ImageRef | null;
  password: string;
  role: string;
  occupation: string;
  experience: number;
  subjects: string[];
  description: string;
  badges?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
