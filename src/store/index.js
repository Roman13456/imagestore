import { configureStore } from '@reduxjs/toolkit'
import imageReducer from './reducers/images.reducers'
import userReducer from './reducers/user.reducers'
import shoppingcartReducer from './reducers/shoppingcart.reducers'
export const store = configureStore({
  reducer: {
    IMAGES: imageReducer,
    USER: userReducer,
    CART:shoppingcartReducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
}),
  devTools: process.env.NODE_ENV !== 'production',
})