import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    {
      id: 100,
      business_ID: 100000,
      fullName: '鈴木 浩太',
      username: 'suzukouta',
      password: 'sainta',
      permissions: 'admin',
      firstLogin: false,
      isLoggedIn: false,
      // For example, can be "invoices", ... etc
      // This is useful so I can autoselect properties and auto-navigate upon navigating to a component
      selectedItem: {
        menu: null, // ex: 'invoices'
        selected_id: null, // ex: 1
      },
    },
    {
      id: 104,
      business_ID: 100000,
      fullName: '松本 雅人',
      username: 'matsumotomasato',
      password: 'sainta',
      permissions: 'moderator',
      firstLogin: false,
      isLoggedIn: false,
      selectedItem: {
        menu: null, // ex: 'invoices'
        selected_id: null, // ex: 1
      },
    },
    {
      id: 109,
      business_ID: 100000,
      fullName: '岩見 美沙子',
      username: 'iwamimisako',
      password: 'sainta',
      permissions: 'moderator',
      firstLogin: false,
      isLoggedIn: false,
      selectedItem: {
        menu: null, // ex: 'invoices'
        selected_id: null, // ex: 1
      },
    },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const newUser = { ...action.payload };
      state.users.push(newUser);
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const selectAllusers = state => state.user.users;

export const { addUser, updateUsers } = userSlice.actions;
export default userSlice.reducer;
