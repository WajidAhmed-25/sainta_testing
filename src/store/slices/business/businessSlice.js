import { createSlice } from '@reduxjs/toolkit';
import { formatDateFromString } from '../../../utils/utilityFunctions';

const initialState = {
  businessSettings: [
    {
      businessID: 100000,
      name: '株式会社サインタ',
      plan: 'コ', // 'ko, ki, ka'
      registrationDate: formatDateFromString('2023年12月11日'),
      billingCycle: '年', // '月', '年'
      registrationEnd: formatDateFromString('2024年12月11日'), // say year term
      address: '東京都渋谷区渋谷1-5-10',
      firstUsage: true,
    },
    {
      businessID: 100001,
      name: '株式会社カズノリ',
      plan: 'コ', // 'ko, ki, ka'
      registrationDate: formatDateFromString('2023年12月11日'),
      billingCycle: '年', // '月', '年'
      registrationEnd: formatDateFromString('2024年12月11日'), // say year term
      address: '東京都渋谷区渋谷1-5-10',
      firstUsage: true,
    },
  ],
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
});

export default businessSlice.reducer;
