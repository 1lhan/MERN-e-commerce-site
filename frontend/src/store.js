import { configureStore } from '@reduxjs/toolkit'
import product from './Slices/ProductSlice'
import auth from './Slices/AuthSlice'

export const store = configureStore({
    reducer: { product, auth }
})