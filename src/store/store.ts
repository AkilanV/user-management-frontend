import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './feaures/loading/loaderSetUpSlice';

const store = configureStore({
  reducer: {
    loaderState: loaderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
