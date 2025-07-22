import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Token } from '../../appTypes/DatasTypes';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: Token | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: Token }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    authError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, authError } = authSlice.actions;
export default authSlice.reducer; 