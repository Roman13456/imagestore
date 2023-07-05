import { configureStore } from '@reduxjs/toolkit'
import imageReducer from './reducers/images.reducers'

export const store = configureStore({
  reducer: {
    IMAGES: imageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
}),
  devTools: process.env.NODE_ENV !== 'production',
})