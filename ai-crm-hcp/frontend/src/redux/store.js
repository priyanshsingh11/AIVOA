import { configureStore } from '@reduxjs/toolkit';
import crmReducer from './slices/crmSlice';

export const store = configureStore({
  reducer: {
    crm: crmReducer,
  },
});
