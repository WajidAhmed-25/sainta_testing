import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user/userSlice';
import saleReducer from './slices/sales/salesSlice';
import productReducer from './slices/product/productSlice';
import invoiceReducer from './slices/invoice/invoiceSlice';
import employeeReducer from './slices/employee/employeeSlice';
import customerReducer from './slices/customer/customerSlice';
import inventoryReducer from './slices/inventory/inventorySlice';
import notificationReducer from './slices/notification/notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    sale: saleReducer,
    invoice: invoiceReducer,
    product: productReducer,
    customer: customerReducer,
    employee: employeeReducer,
    inventory: inventoryReducer,
    notification: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
