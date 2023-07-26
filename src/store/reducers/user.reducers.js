import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      console.log("payload")
      console.log(action.payload)
      return action.payload; // Update the user state with the payload
    },
    setUserName: (state, action) => {
      if (state) {
        // Update the user's name with the value from the payload
        state.nickname = action.payload;
      }
    },
    clearUser: (state) => {
      return null; // Clear the user state
    },
  },
});

export const { setUser, clearUser,setUserName } = userSlice.actions;
export default userSlice.reducer;
