import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem('user') === 'true' ? true : false,
}

export const LoginSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    LoginState: (state) => {
      state.value = true  
      localStorage.setItem('user', state.value);
      console.log("LoginState : User Logged in", state.value);
    },
    LogOutState: (state) => {
      state.value = false
      localStorage.setItem('user', state.value); 
      console.log("LogOutState : User Logged out", state.value);
    },
  },
})

export const { LoginState, LogOutState } = LoginSlice.actions

export default LoginSlice.reducer