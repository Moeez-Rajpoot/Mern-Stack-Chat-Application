import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: JSON.parse(localStorage.getItem('userData')) || {}, 
};

export const UserSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    // New reducer to set user data
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
      console.log('SetUserData : User data stored in Redux store:', action.payload);
    },
    clearUserData: (state) => {
      state.userData = {};
      localStorage.removeItem('userData');
      console.log('ClearUserData : User data cleared from Redux store');
    },
  },
});

// Export the actions
export const { setUserData, clearUserData } = UserSlice.actions;

export default UserSlice.reducer;