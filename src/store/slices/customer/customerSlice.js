import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { formatDateFromString } from '../../../utils/utilityFunctions';
import apiCalls from '../../../api';

const initialState = {
  customers: [
    {
      id: 1,
      business_ID: 100000,
      // personal details/basic info pg1
      name: '未知顧客（男）',
      furigana: '',
      phone: '',
      email: '',
      // reconnaisance details 1 pg1
      address: '',
      company: '',
      position: '',
      // reconnaisance details 2 pg1
      dateMet: formatDateFromString('1969年12月31日'),
      lastContact: formatDateFromString('1969年12月31日'),
      nextContact: formatDateFromString('1969年12月31日'),
      // cultural details pg2
      dayBirth: formatDateFromString('1969年12月31日'),
      languagePreference: '日本語',
      preferredContactMethod: '電話',
      // support details pg2
      supportRequired: 'なし',
      supportDetails: '',
      supportSatisfaction: 0,
      // more details, how met, hear about pg2
      methodMet: '紹介',
      hearAbout: '紹介',
      notes: '男性の顧客の詳細が不明な場合に使用する',
    },
    {
      id: 2,
      business_ID: 100000,
      // personal details/basic info pg1
      name: '未知顧客（女）',
      furigana: '',
      phone: '',
      email: '',
      // reconnaisance details 1 pg1
      address: '',
      company: '',
      position: '',
      // reconnaisance details 2 pg1
      dateMet: formatDateFromString('1969年12月31日'),
      lastContact: formatDateFromString('1969年12月31日'),
      nextContact: formatDateFromString('1969年12月31日'),
      // cultural details pg2
      dayBirth: formatDateFromString('1969年12月31日'),
      languagePreference: '日本語',
      preferredContactMethod: '電話',
      // support details pg2
      supportRequired: 'なし',
      supportDetails: '',
      supportSatisfaction: 0,
      // more details, how met, hear about pg2
      methodMet: '紹介',
      hearAbout: '紹介',
      notes: '女性の顧客の詳細が不明な場合に使用する',
    },
    {
      id: 3,
      business_ID: 100000,
      // personal details/basic info pg1
      name: '高橋 大輔',
      furigana: 'たかはし だいすけ',
      phone: '070-7891-2210',
      email: 'daihashi@max.co.jp',
      // reconnaisance details 1 pg1
      address: '愛知名古屋市中区栄 3-6-15',
      company: '株式会社マックス',
      position: '営業担当',
      // reconnaisance details 2 pg1
      dateMet: formatDateFromString('2018年08月28日'),
      lastContact: formatDateFromString('2023年03月15日'),
      nextContact: formatDateFromString('2024年02月10日'),
      // cultural details pg2
      dayBirth: formatDateFromString('1983年02月03日'),
      languagePreference: '日本語',
      preferredContactMethod: 'メール',
      // support details pg2
      supportRequired: 'なし',
      supportDetails: '',
      supportSatisfaction: 0,
      // more details, how met, hear about pg2
      methodMet: '訪問',
      hearAbout: '紹介',
      notes: '',
    },
    {
      id: 4,
      business_ID: 100000,
      // personal details/basic info pg1
      name: '山田 花子',
      furigana: 'やまだ はなこ',
      phone: '090-1405-5108',
      email: 'hanakoya@mmc.co.jp',
      // reconnaisance details 1 pg1
      address: '東京都港区六本木 3-8-9',
      company: '三菱マテリアル株式会社',
      position: '経理担当',
      // reconnaisance details 2 pg1
      dateMet: formatDateFromString('2019年11月20日'),
      lastContact: formatDateFromString('2023年03月15日'),
      nextContact: formatDateFromString('2024年01月05日'),
      // cultural details pg2
      dayBirth: formatDateFromString('1990年01月10日'),
      languagePreference: '日本語',
      preferredContactMethod: '電話',
      // support details pg2
      supportRequired: 'あり',
      supportDetails: '経理担当者の連絡先',
      supportSatisfaction: 10,
      // more details, how met, hear about pg2
      methodMet: '訪問',
      hearAbout: 'ネット',
      notes: '',
    },
  ],
};

// Action creators thunks
export const getAllCustomers = createAsyncThunk(
  'customer/getAllCustomers',
  async () => {
    const response = await apiCalls.fetchAllCustomers();
    return response.data.data;
  },
);

export const addCustomerToDb = createAsyncThunk(
  'customer/addCustomerToDb',
  async param => {
    const response = await apiCalls.createCustomer(param);
    return response.data.data;
  },
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      const customer = { ...action.payload };
      state.customers.push(customer);
    },
    updateCustomers: (state, action) => {
      state.customers = action.payload;
    },
    removeCustomer: (state, action) => {
      state.customers = state.customers.filter(
        customer => customer.id !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllCustomers.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.customers = [...state.customers, ...action.payload];
        state.pending = false;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message;
      })
      .addCase(addCustomerToDb.pending, (state, action) => {
        state.pending = true;
      })
      .addCase(addCustomerToDb.fulfilled, (state, action) => {
        state.customers = [...state.customers, action.payload];
        state.pending = false;
      })
      .addCase(addCustomerToDb.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message;
      });
  },
});

export const selectAllcustomers = state => state.customer.customers;

export const { addCustomer, updateCustomers, removeCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
