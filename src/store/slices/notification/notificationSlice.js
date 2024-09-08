import { createSlice } from '@reduxjs/toolkit';

export const notificationState = {
  open: false,
  type: 'info',
  message: '',
  timeout: 5000,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: notificationState,
  reducers: {
    addNotification: (state, action) => ({
      ...state,
      ...action.payload,
      open: true,
    }),
    clearNotification: (state, action) => ({ ...state, open: false }),
  },
});

export const NotificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
