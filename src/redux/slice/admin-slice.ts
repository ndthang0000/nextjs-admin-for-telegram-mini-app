import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  "role": "",
  "isEmailVerified": true,
  "isBlock": false,
  "name": "",
  "email": "",
  "createdAt": "",
  "updatedAt": "",
  "id": ""
}


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: initialState,
    isLoading: true,
  },
  reducers: {
    setAdmin: (state, action: PayloadAction<any>) => {
      state.admin = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.admin = initialState;
      state.isLoading = false;
    }
    // Additional reducers can be added here (e.g., removePost, updatePost)
  },
});

export const { setAdmin, logout: logoutAction } = adminSlice.actions;

export default adminSlice;