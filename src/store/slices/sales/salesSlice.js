import { createSlice } from '@reduxjs/toolkit';
import { formatDateFromString } from '../../../utils/utilityFunctions';

const initialState = {
  leads: [
    {
      id: 1, // id of the lead itself
      business_ID: 100000, // business this lead is linked to
      customer_id: 3, // customer this lead is linked to
      employee_id: 104, // employee this lead is linked to (salesperson)
      status: '見込み客',
      dateGenerated: formatDateFromString('2023年09月02日'),
      expectedCloseDate: formatDateFromString('2023年10月02日'),
      products_of_interest: [
        {
          product_id: 7,
          quantity: 2,
        },
      ],
      linked_invoice_id: null, // can be created when lead is converted to invoice, and then updated here
      notes: '見込み客のノート',
    },
    {
      id: 2,
      business_ID: 100000,
      customer_id: 4,
      employee_id: 104,
      status: '見込み客',
      dateGenerated: formatDateFromString('2023年11月05日'),
      expectedCloseDate: formatDateFromString('2023年12月05日'),
      products_of_interest: [
        {
          product_id: 7,
          quantity: 2,
        },
      ],
      linked_invoice_id: null,
      notes: '見込み客のノート',
    },
  ],
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addLead: (state, action) => {
      state.leadInfo = action.payload;
    },
    removeLead: (state, action) => {
      state.leadInfo = action.payload;
    },
  },
});

export const { addLead, removeLead } = salesSlice.actions;
export default salesSlice.reducer;
