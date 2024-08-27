import { configureStore } from '@reduxjs/toolkit'
import LoginReducer from './Reducers/Loginstate'
import UserReducer from './Reducers/UserData'
export const store = configureStore({
    reducer: {
        Login: LoginReducer,
        UserData: UserReducer
      },
})