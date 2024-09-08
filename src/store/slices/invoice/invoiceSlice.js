import { createSlice } from '@reduxjs/toolkit';
import { formatDateFromString } from '../../../utils/utilityFunctions';

const initialState = {
  invoices: [
    {
      id: 100,
      business_ID: 100000,
      customer_id: 1,
      invoice_date: formatDateFromString('2023年09月02日'),
      due_date: formatDateFromString('2023年10月02日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Unpaid',
      invoice_items: [
        {
          product_id: 1,
          invoice_id: 100,
          quantity: 3,
          unit_price: null,
          line_total: null,
          male_count: 2,
          female_count: 1,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 3,
          invoice_id: 100,
          quantity: 3,
          unit_price: null,
          line_total: null,
          male_count: 2,
          female_count: 1,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 4,
          invoice_id: 100,
          quantity: 2,
          unit_price: null,
          line_total: null,
          male_count: 2,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 6,
          invoice_id: 100,
          quantity: 2,
          unit_price: null,
          line_total: null,
          male_count: 1,
          female_count: 1,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
    {
      id: 101,
      business_ID: 100000,
      customer_id: 1,
      invoice_date: formatDateFromString('2023年09月03日'),
      due_date: formatDateFromString('2023年10月03日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Paid',
      invoice_items: [
        {
          product_id: 3,
          invoice_id: 101,
          quantity: 12,
          unit_price: null,
          line_total: null,
          male_count: 8,
          female_count: 4,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 5,
          invoice_id: 101,
          quantity: 20,
          unit_price: null,
          line_total: null,
          male_count: 16,
          female_count: 4,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 4,
          invoice_id: 101,
          quantity: 5,
          unit_price: null,
          male_count: 5,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 6,
          invoice_id: 101,
          quantity: 3,
          unit_price: null,
          male_count: 1,
          female_count: 2,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
    {
      id: 102,
      business_ID: 100000,
      customer_id: 2,
      invoice_date: formatDateFromString('2023年09月13日'),
      due_date: formatDateFromString('2023年10月13日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Paid',
      invoice_items: [
        {
          product_id: 1,
          invoice_id: 102,
          quantity: 20,
          unit_price: null,
          line_total: null,
          male_count: 8,
          female_count: 12,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 3,
          invoice_id: 102,
          quantity: 20,
          unit_price: null,
          male_count: 8,
          female_count: 12,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 4,
          invoice_id: 102,
          quantity: 10,
          male_count: 5,
          female_count: 5,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 5,
          invoice_id: 102,
          quantity: 20,
          unit_price: null,
          male_count: 8,
          female_count: 12,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 6,
          invoice_id: 102,
          quantity: 4,
          male_count: 0,
          female_count: 4,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
    {
      id: 103,
      business_ID: 100000,
      customer_id: 1,
      invoice_date: formatDateFromString('2023年09月20日'),
      due_date: formatDateFromString('2023年10月20日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Paid',
      invoice_items: [
        {
          product_id: 3,
          invoice_id: 103,
          quantity: 17,
          unit_price: null,
          line_total: null,
          male_count: 10,
          female_count: 7,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 5,
          invoice_id: 103,
          quantity: 20,
          unit_price: null,
          male_count: 20,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 6,
          invoice_id: 103,
          quantity: 12,
          unit_price: null,
          male_count: 5,
          female_count: 7,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 4,
          invoice_id: 103,
          quantity: 15,
          male_count: 15,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 1,
          invoice_id: 103,
          quantity: 4,
          male_count: 1,
          female_count: 3,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
    {
      id: 104,
      business_ID: 100000,
      customer_id: 1,
      invoice_date: formatDateFromString('2023年09月27日'),
      due_date: formatDateFromString('2023年10月27日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Paid',
      invoice_items: [
        {
          product_id: 1,
          invoice_id: 104,
          quantity: 30,
          unit_price: null,
          male_count: 14,
          female_count: 16,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 3,
          invoice_id: 104,
          quantity: 30,
          male_count: 14,
          female_count: 16,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 4,
          invoice_id: 104,
          quantity: 10,
          male_count: 10,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 6,
          invoice_id: 104,
          quantity: 13,
          male_count: 1,
          female_count: 12,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 5,
          invoice_id: 104,
          quantity: 25,
          male_count: 23,
          female_count: 2,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
    {
      id: 105,
      business_ID: 100000,
      customer_id: 1,
      invoice_date: formatDateFromString('2023年9月27日'),
      due_date: formatDateFromString('2023年10月27日'),
      subtotal: null,
      taxes: null,
      total_amount: null,
      status: 'Paid',
      invoice_items: [
        {
          product_id: 1,
          invoice_id: 105,
          quantity: 30,
          male_count: 14,
          female_count: 16,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
        {
          product_id: 7,
          invoice_id: 105,
          quantity: 1,
          male_count: 1,
          female_count: 0,
          auto_tax: true,
          tax_amount: 0,
          tax_type: 'percentage', // percentage or fixed
        },
      ],
    },
  ],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      const present = state.invoices.find(
        invoice => invoice.id === action.payload.id,
      );
      if (!present) {
        state.invoices.push(action.payload);
      }
    },
    updateInvoice: (state, action) => {
      const present = state.invoices.find(
        invoice => invoice.id === action.payload.id,
      );
      if (present) {
        const index = state.invoices.findIndex(
          invoice => invoice.id === action.payload.id,
        );
        state.invoices.splice(index, 1, action.payload);
      }
    },
    removeInvoice: (state, action) => {},
  },
});

export const { addInvoice, updateInvoice, removeInvoice } =
  invoiceSlice.actions;
export default invoiceSlice.reducer;
