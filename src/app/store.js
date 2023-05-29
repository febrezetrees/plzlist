//DONE 8 APRIL
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/auth/authSlice'
import registerReducer from '../features/register/registerSlice'

export const store = configureStore({ //configureStore automatically handles combination of reducers for me, into a rootReducer
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        register: registerReducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true //to go false on production
})

setupListeners(store.dispatch)

