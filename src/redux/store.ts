import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { loginSlice } from '@/redux/services/admin-slice'
import adminSlice from '@/redux/slice/admin-slice'
import { userSlice } from '@/redux/services/user-slice'

export const store = configureStore({
  reducer: {
    [loginSlice.reducerPath]: loginSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    admin: adminSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginSlice.middleware).concat(userSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// Infer the type of makeStore
// Infer the `RootState` and `AppDispatch` types from the store itself
setupListeners(store.dispatch)