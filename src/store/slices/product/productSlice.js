import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    {
      id: 1,
      business_ID: 100000,
      productName: '卵焼き',
      productType: '消耗品',
      productDescription: '卵を焼いたもの',
      productCost: null,
      autoSetCost: true,
      productPrice: 300.0,
      taxTotal: 10,
      taxType: 'percentage',
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [
        {
          id: 1,
          volumeUsed: 151.5,
          volumeUnit: 'g',
        },
        {
          id: 2,
          volumeUsed: 15,
          volumeUnit: 'g',
        },
        {
          id: 3,
          volumeUsed: 6,
          volumeUnit: 'g',
        },
        {
          id: 4,
          volumeUsed: 5.5,
          volumeUnit: 'g',
        },
        {
          id: 5,
          volumeUsed: 1.25,
          volumeUnit: 'g',
        },
      ],
    },
    {
      id: 3,
      business_ID: 100000,
      productName: '豚骨ラーメン',
      productType: '消耗品',
      productDescription: '豚骨スープのラーメン',
      productCost: null,
      taxTotal: 10,
      taxType: 'percentage',
      autoSetCost: true,
      productPrice: 1480.0,
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [
        {
          id: 6,
          volumeUsed: 750,
          volumeUnit: 'g',
        },
        {
          id: 7,
          volumeUsed: 200,
          volumeUnit: 'g',
        },
        {
          id: 8,
          volumeUsed: 350,
          volumeUnit: 'g',
        },
        {
          id: 9,
          volumeUsed: 60,
          volumeUnit: 'g',
        },
        {
          id: 10,
          volumeUsed: 40,
          volumeUnit: 'g',
        },
        {
          id: 11,
          volumeUsed: 40,
          volumeUnit: 'g',
        },
        {
          id: 12,
          volumeUsed: 15,
          volumeUnit: 'g',
        },
        {
          id: 13,
          volumeUsed: 10,
          volumeUnit: 'g',
        },
        {
          id: 14,
          volumeUsed: 5,
          volumeUnit: 'g',
        },
        {
          id: 15,
          volumeUsed: 25,
          volumeUnit: 'g',
        },
      ],
    },
    {
      id: 4,
      business_ID: 100000,
      productName: 'コーラハイボール',
      productType: '消耗品',
      productDescription: 'コーラとウイスキーのハイボール',
      productCost: null,
      autoSetCost: true,
      taxTotal: 10,
      taxType: 'percentage',
      productPrice: 550.0,
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [
        {
          id: 16,
          volumeUsed: 300,
          volumeUnit: 'ml',
        },
        {
          id: 17,
          volumeUsed: 100,
          volumeUnit: 'ml',
        },
      ],
    },
    {
      id: 5,
      business_ID: 100000,
      productName: 'レモンサワー',
      productType: '消耗品',
      productDescription: 'レモンと焼酎のサワー',
      productCost: null,
      autoSetCost: true,
      productPrice: 500.0,
      taxTotal: 10,
      taxType: 'percentage',
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [
        {
          id: 18,
          volumeUsed: 90,
          volumeUnit: 'g',
        },
        {
          id: 19,
          volumeUsed: 75,
          volumeUnit: 'ml',
        },
        {
          id: 20,
          volumeUsed: 180,
          volumeUnit: 'ml',
        },
      ],
    },
    {
      id: 6,
      business_ID: 100000,
      productName: '桜サワー',
      productType: '消耗品',
      productDescription: '桜と焼酎のサワー',
      productCost: null,
      autoSetCost: true,
      productPrice: 550.0,
      taxTotal: 10,
      taxType: 'percentage',
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [
        {
          id: 19,
          volumeUsed: 90,
          volumeUnit: 'g',
        },
        {
          id: 20,
          volumeUsed: 200,
          volumeUnit: 'ml',
        },
        {
          id: 21,
          volumeUsed: 100,
          volumeUnit: 'ml',
        },
      ],
    },
    {
      // service product (so no products)
      id: 7,
      business_ID: 100000,
      productName: 'プライベートチェフ',
      productType: 'サービス商品',
      productDescription: 'プライベートチェフ',
      productCost: 10000.0,
      autoSetCost: false, // can't auto-set anyway.
      productPrice: 20000.0,
      taxTotal: 10,
      taxType: 'percentage',
      totalSales: null,
      salesWeek: {
        '2023-12-11': 10,
        '2023-12-18': 15,
        '2023-12-25': 20,
      },
      totalRevenue: null,
      profitWeek: {},
      inventoryUsed: [],
    },
  ],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const selectAllproducts = state => state.product.products;

export const { updateProducts } = productSlice.actions;
export default productSlice.reducer;
