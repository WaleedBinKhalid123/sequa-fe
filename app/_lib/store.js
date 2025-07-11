import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/app/_lib/features/user/userSlice';
import appReducer from '@/app/_lib/features/app/appSlice';
import userFavoriteAppReducer from '@/app/_lib/features/userFavoriteApp/userFavoriteAppSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    userFavoriteApp: userFavoriteAppReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(customMiddleware),
});
