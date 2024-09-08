import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {
  faCity,
  faTimes,
  faCircleUser,
  faEnvelopeOpen,
  faRightFromBracket,
  faEnvelopeOpenText,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// css and image
import './assets/css/Modals.css';
import saintaLogo from './assets/images/saintaLOGO.png';

// components
import Payment from './components/payment/Payment';
import Landing from './components/landing/Landing';
import RegistrationNew from './components/registration/RegistrationNew';

// route & private route & other helpers
import apiCalls from './api';
import storage from './auth/storage';
import { route } from './routes/route';
import PrivateRoute from './routes/PrivateRoute';
import { useNotification } from './hooks/useNotification';
import { formatDateFromString } from './utils/utilityFunctions';
import Notification from './components/notification/Notification';

export default function App() {
  // Defining the registration Business settings, etc. what plan, how long, etc.
  const [businessSettings, setBusinessSettings] = useState([
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
  ]);

  // For currentBusiness, state should be the business ID
  const [currentBusiness, setCurrentBusiness] = useState(1); // The ID of the business

  // For login, logout, and authentication
  // Linked to Employees
  const [users, setUsers] = useState([
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
  ]);

  // Now currentUser (just for debug and test purposes)
  const [currentUser, setCurrentUser] = useState(() =>
    users && users.length > 0 ? users[0] : null,
  );

  const [customers, setCustomers] = useState([
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
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      business_ID: 100000,
      name: '管理',
      description: '管理部門',
    },
    {
      id: 2,
      business_ID: 100000,
      name: '営業',
      description: '営業部門',
    },
    {
      id: 3,
      business_ID: 100000,
      name: '人事',
      description: '人事部門',
    },
    {
      id: 4,
      business_ID: 100000,
      name: '経理',
      description: '経理部門',
    },
  ]);

  const [employees, setEmployees] = useState([
    {
      id: 100,
      business_ID: 100000, // What business linked to
      fullName: '鈴木 浩太',
      furigana: 'すずき こうた',
      gender: '男性',
      dateOfBirth: formatDateFromString('1984年06月11日'),
      nationality: '日本',
      telephone: '03-1948-1003',
      email: 'suzukouta@sainta.co.jp',
      address: '東京都渋谷区渋谷1-5-10',
      department: '管理',
      employmentType: '正社員',
      position: '社長',
      dateOfJoining: formatDateFromString('2004年11月05日'),
      salaryAmount: 1030000,
      salaryInterval: '月',
      salaryDayOfWeek: '金曜日',
      taxDeductionRate: 33,
      totalDeduction: 4130250,
      payRaiseHistory: '',
      healthInsuranceNumber: '15789236457',
      welfarePensionInsuranceNumber: '80958765432',
      employmentInsuranceNumber: '29573810465',
      daysPresent: 194,
      daysAbsent: 4,
      absenceInstances: '',
      performanceRating: 10,
      employeementContract: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      resume: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      identityDocument: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      lastMeeting: formatDateFromString('2023年05月12日'),
      otherNotes: '',
      checkIn: null,
      checkOut: null,
      hoursOfRest: null,
      todayHours: 0,
      dailyHours: {
        '2023年12月11日': 7.5,
        '2023年12月12日': 8,
      },
      username: 'suzukouta',
      password: 'sainta',
    },
    {
      id: 104,
      business_ID: 100000, // What business linked to
      fullName: '松本 雅人',
      furigana: 'まつもと まさと',
      gender: '男性',
      dateOfBirth: formatDateFromString('1993年09月17日'),
      nationality: '日本',
      telephone: '(03) 2468-1357',
      email: 'matsumoto.masato@example.com',
      address: '東京都港区六本木3-8-9',
      department: '営業',
      employmentType: '正社員',
      position: '営業担当',
      dateOfJoining: formatDateFromString('2018年06月01日'),
      salaryAmount: 710000,
      salaryDayOfWeek: '木曜日',
      salaryInterval: '月',
      taxDeductionRate: 23,
      totalDeduction: 1250100,
      payRaiseHistory: '2020年: 昇給あり',
      healthInsuranceNumber: '34567891234',
      welfarePensionInsuranceNumber: '65432109876',
      employmentInsuranceNumber: '98765432109',
      daysPresent: 230,
      daysAbsent: 12,
      absenceInstances: '2021年04月01日 - 風邪',
      performanceRating: 8,
      lastMeeting: formatDateFromString('2023年06月20日'),
      employeementContract: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      resume: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      identityDocument: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      otherNotes: '',
      checkIn: null,
      checkOut: null,
      hoursOfRest: null,
      todayHours: 0,
      dailyHours: {
        '2023年12月11日': 7.5,
        '2023年12月12日': 8,
      },
      weeklyHours: {},
      username: 'matsumotomasato',
      password: 'sainta',
    },
    {
      id: 109,
      business_ID: 100000, // What business linked to
      fullName: '岩見 美沙子',
      furigana: 'いわみ みさこ',
      gender: '女性',
      dateOfBirth: formatDateFromString('1998年02月08日'),
      nationality: '日本',
      telephone: '080-9876-5432',
      email: 'iwami.misako@example.com',
      address: '東京都新宿区新宿2-5-14',
      department: '人事',
      employmentType: '正社員',
      position: '人事担当',
      dateOfJoining: formatDateFromString('2020年04月15日'),
      salaryAmount: 350000,
      salaryDayOfWeek: '月曜日',
      salaryInterval: '時間',
      taxDeductionRate: 20,
      totalDeduction: 520000,
      payRaiseHistory: '',
      healthInsuranceNumber: '45678912345',
      welfarePensionInsuranceNumber: '76543210987',
      employmentInsuranceNumber: '09876543210',
      daysPresent: 202,
      daysAbsent: 3,
      absenceInstances: '',
      performanceRating: 9,
      lastMeeting: formatDateFromString('2023年07月10日'),
      employeementContract: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      resume: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      identityDocument: {
        filetype: 'pdf',
        filename: null,
        file: null,
        url: null,
      },
      otherNotes: '',
      checkIn: null,
      checkOut: null,
      hoursOfRest: null,
      todayHours: 0,
      dailyHours: {
        '2023年12月11日': 7.5,
        '2023年12月12日': 8,
      },
      weeklyHours: {},

      username: 'iwamimisako',
      password: 'sainta',
    },
  ]);

  const [inventoryTypes, setInventoryTypes] = useState([
    {
      id: 1,
      business_ID: 100000,
      name: '食品',
      description:
        'おつまみ、主食、缶詰、生鮮食品など、さまざまな種類の食用品。',
    },
    {
      id: 2,
      business_ID: 100000,
      name: '野菜',
      description: '葉物野菜、根菜類、季節の野菜など、新鮮な野菜と冷凍野菜。',
    },
    {
      id: 3,
      business_ID: 100000,
      name: '果物',
      description: '季節の果物、冷凍果物、果物の缶詰など。',
    },
    {
      id: 4,
      business_ID: 100000,
      name: '肉',
      description: '牛肉、豚肉、鶏肉、その他の肉類。',
    },
    {
      id: 5,
      business_ID: 100000,
      name: '魚',
      description: '魚介類、海藻類、その他の魚介類。',
    },
    {
      id: 6,
      business_ID: 100000,
      name: '調味料',
      description: '醤油、味醂、酢、塩、砂糖、胡椒、その他の調味料。',
    },
    {
      id: 7,
      business_ID: 100000,
      name: 'アルコール',
      description:
        'ビール、ワイン、ウイスキー、焼酎、日本酒、その他のアルコール飲料。',
    },
    {
      id: 8,
      business_ID: 100000,
      name: '麺',
      description: 'ラーメン麺、そば麺、うどん麺、その他の麺類。',
    },
    {
      id: 9,
      business_ID: 100000,
      name: '飲料',
      description: '水、お茶、ジュース、ソーダ、その他の飲料。',
    },
    {
      id: 10,
      business_ID: 100000,
      name: 'その他',
      description: 'その他の食材。',
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      business_ID: 100000,
      inventoryType: '食品',
      itemName: '卵',
      stockQuantity: 100,
      volumePerItem: 400.0,
      volumeUnit: 'g',
      costPrice: 200.0,
      supplierDetails: '株式会社卵最高',
      lastOrdered: formatDateFromString('2023年12月20日'),
    },
    {
      id: 2,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '砂糖',
      stockQuantity: 5,
      volumePerItem: 0.8,
      volumeUnit: 'kg',
      costPrice: 250.0,
      supplierDetails: '株式会社砂糖ラバーズ',
      lastOrdered: formatDateFromString('2023年05月05日'),
    },
    {
      id: 3,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '醤油',
      stockQuantity: 10,
      volumePerItem: 500,
      volumeUnit: 'ml',
      costPrice: 285.0,
      supplierDetails: '株式会社醤油マスター',
      lastOrdered: formatDateFromString('2023年08月29日'),
    },
    {
      id: 4,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '味醂',
      stockQuantity: 5,
      volumePerItem: 500,
      volumeUnit: 'ml',
      costPrice: 550.0,
      supplierDetails: '株式会社味醂王様',
      lastOrdered: formatDateFromString('2023年12月29日'),
    },
    {
      id: 5,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '塩',
      stockQuantity: 20,
      volumePerItem: 1,
      volumeUnit: 'kg',
      costPrice: 140.0,
      supplierDetails: '株式会社塩ベスト',
      lastOrdered: formatDateFromString('2023年10月14日'),
    },
    {
      id: 6,
      business_ID: 100000,
      inventoryType: '肉',
      itemName: '豚骨',
      stockQuantity: 25,
      volumePerItem: 12.5,
      volumeUnit: 'kg',
      costPrice: 10000.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年10月12日'),
    },
    {
      id: 7,
      business_ID: 100000,
      inventoryType: '肉',
      itemName: '豚バラ',
      stockQuantity: 40,
      volumePerItem: 12.5,
      volumeUnit: 'kg',
      costPrice: 14000.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年10月12日'),
    },
    {
      id: 8,
      business_ID: 100000,
      inventoryType: '麺',
      itemName: 'ラーメン麺',
      stockQuantity: 50,
      volumePerItem: 4.5,
      volumeUnit: 'kg',
      costPrice: 1500.0,
      supplierDetails: '株式会社ラーメン麺',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 9,
      business_ID: 100000,
      inventoryType: '野菜',
      itemName: 'ネギ',
      stockQuantity: 100,
      volumePerItem: 1,
      volumeUnit: 'kg',
      costPrice: 400.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年11月15日'),
    },
    {
      id: 10,
      business_ID: 100000,
      inventoryType: '野菜',
      itemName: '大蒜',
      stockQuantity: 100,
      volumePerItem: 1,
      volumeUnit: 'kg',
      costPrice: 500.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年11月15日'),
    },
    {
      id: 11,
      business_ID: 100000,
      inventoryType: '野菜',
      itemName: '生姜',
      stockQuantity: 100,
      volumePerItem: 1,
      volumeUnit: 'kg',
      costPrice: 600.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年11月30日'),
    },
    {
      id: 12,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: 'ごま油',
      stockQuantity: 100,
      volumePerItem: 750,
      volumeUnit: 'ml',
      costPrice: 800.0,
      supplierDetails: '岩見商店',
      lastOrdered: formatDateFromString('2023年11月30日'),
    },
    {
      id: 13,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '海苔',
      stockQuantity: 50,
      volumePerItem: 20,
      volumeUnit: 'g',
      costPrice: 400.0,
      supplierDetails: '岩見商店',
      lastOrdered: formatDateFromString('2024年1月01日'),
    },
    {
      id: 14,
      business_ID: 100000,
      inventoryType: '調味料',
      itemName: '黒胡椒',
      stockQuantity: 100,
      volumePerItem: 400,
      volumeUnit: 'g',
      costPrice: 600.0,
      supplierDetails: '岩見商店',
      lastOrdered: formatDateFromString('2023年11月30日'),
    },
    {
      id: 15,
      business_ID: 100000,
      inventoryType: '野菜',
      itemName: 'もやし',
      stockQuantity: 100,
      volumePerItem: 120,
      volumeUnit: 'g',
      costPrice: 300.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 16,
      business_ID: 100000,
      inventoryType: '飲料',
      itemName: 'コーラ',
      stockQuantity: 100,
      volumePerItem: 2,
      volumeUnit: 'L',
      costPrice: 200.0,
      supplierDetails: 'ファマリー・マート',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 17,
      business_ID: 100000,
      inventoryType: 'アルコール',
      itemName: 'ウイスキー',
      stockQuantity: 20,
      volumePerItem: 750,
      volumeUnit: 'ml',
      costPrice: 2750.0,
      supplierDetails: '渡辺お酒屋',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 18,
      business_ID: 100000,
      inventoryType: '果物',
      itemName: 'レモン',
      stockQuantity: 150,
      volumePerItem: 100,
      volumeUnit: 'g',
      costPrice: 100.0,
      supplierDetails: '田中家族ファーム',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 19,
      business_ID: 100000,
      inventoryType: 'アルコール',
      itemName: '焼酎',
      stockQuantity: 20,
      volumePerItem: 750,
      volumeUnit: 'ml',
      costPrice: 2300.0,
      supplierDetails: '渡辺お酒屋',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 20,
      business_ID: 100000,
      inventoryType: '飲料',
      itemName: 'ソーダ水',
      stockQuantity: 100,
      volumePerItem: 1,
      volumeUnit: 'L',
      costPrice: 120.0,
      supplierDetails: 'ファマリー・マート',
      lastOrdered: formatDateFromString('2023年12月10日'),
    },
    {
      id: 21,
      business_ID: 100000,
      inventoryType: '飲料',
      itemName: 'ザクロジュース',
      stockQuantity: 100,
      volumePerItem: 1,
      volumeUnit: 'L',
      costPrice: 250.0,
      supplierDetails: 'ファマリー・マート',
      lastOrdered: formatDateFromString('2024年01月10日'),
    },
  ]);

  const [products, setProducts] = useState([
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
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    '旅費交通',
    '事務用品',
    '広告宣伝',
    '施設費',
    'その他',
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      business_ID: 100000,
      name: '大阪出張',
      cost: 34500,
      fullPayment: true,
      paidAmount: 34500,
      incurredDate: formatDateFromString('2023年12月11日'),
      dueDate: formatDateFromString('2023年12月18日'),
      settlementDate: formatDateFromString('2023年12月18日'),
      category: '旅費交通',
      taxInformation: '消費税 10%',
      receipt: null,
      approver: 109,
      reimbursable: true,
      remarks: '大阪出張の交通費',
    },
    {
      id: 2,
      business_ID: 100000,
      name: 'オッフィス用品購入',
      cost: 12000.0,
      fullPayment: false,
      paidAmount: 4000.0,
      incurredDate: formatDateFromString('2023年12月15日'),
      dueDate: formatDateFromString('2024年1月8日'),
      settlementDate: null,
      category: '事務用品',
      taxInformation: '消費税 10%',
      receipt: null,
      approver: 109,
      reimbursable: true,
      remarks: 'オッフィス用品の購入',
    },
    {
      id: 3,
      business_ID: 100000,
      name: '新聞広告',
      cost: 50000,
      fullPayment: true,
      paidAmount: 50000,
      incurredDate: formatDateFromString('2024年1月5日'),
      dueDate: formatDateFromString('2024年1月12日'),
      settlementDate: formatDateFromString('2024年1月6日'),
      category: '広告宣伝',
      taxInformation: '消費税 10%',
      receipt: null,
      approver: 109,
      reimbursable: true,
      remarks: '新聞広告',
    },
  ]);

  const [invoices, setInvoices] = useState([
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
  ]);

  // For business/sales management (eigyoukanri)
  const [leadInfo, setLeadInfo] = useState([
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
  ]);

  // Now we're going to make mail
  // To make threads, we will use parentID which will be like a linked list
  // For example if parentID === null, then it is the first message in the thread
  // But if parentID === 1, then 1=>id of the message
  const [mail, setMail] = useState([
    {
      id: 1,
      parentID: null,
      business_ID: 100000,
      sender_ID: 100,
      recipient_IDS: [104, 109],
      subject: '大切なお知らせ',
      body: 'サインタの新しい機能が追加されました。ぜひご覧ください。いろんな機能がありますので、ぜひご活用ください。僕はこの機能が一番好きです。 \n\n見てくれてありがとうございます。お疲れ様でした！',
      dateSent: formatDateFromString('2023年12月11日'),
      timeSent: '12:00',
      isRead: {
        100: true,
        104: false,
        109: false,
      },
    },
    {
      id: 2,
      parentID: 1,
      business_ID: 100000,
      sender_ID: 104,
      recipient_IDS: [100, 109],
      subject: null, // Takes the subject of the parent (RE: <>)
      body: 'メールをありがとうございます。サインタの新しい機能を確認しました。',
      dateSent: formatDateFromString('2023年12月11日'),
      timeSent: '12:05',
      isRead: {
        100: false,
        104: true,
        109: false,
      },
    },
  ]);

  // A boolean if the currentUser has unread mail
  const currentUserUnreadMail = () => {
    // Get all the mail that currentUser is a recipient of
    const currentUserMail = mail.filter(message =>
      message.recipient_IDS.includes(currentUser.id),
    );
    // Get all the mail that currentUser has not read
    const currentUserUnreadMail = currentUserMail.filter(
      message => !message.isRead[currentUser.id],
    );
    // Return true if there is at least one unread mail
    return currentUserUnreadMail.length > 0;
  };

  // All the Navbars
  function TopNavbar() {
    return (
      <div className="topNavbar">
        <img src={saintaLogo} alt="Sainta Logo" className="saintaLogo" />
      </div>
    );
  }

  function BottomNavbar() {
    const navigate = useNavigate();
    const { displayNotification } = useNotification();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBusinessSettingsClick = () => {
      // Create a modal to handle the businessSettings
      setIsModalVisible(true);
    };

    const handleLogout = async () => {
      // Update the list of all user's isLoggedIn that matches currentUser.id to false
      const updatedUsers = users.map(user => {
        if (user.id === currentUser?.id) {
          return { ...user, isLoggedIn: false };
        }
        return user;
      });
      setUsers(updatedUsers);
      // Set currentUser to null
      setCurrentUser(null);
      try {
        const res = await apiCalls.logOut();
        if (res) {
          if (res.status === 200 && res.data.success === 1) {
            console.log(res.data);
            storage.remove('sainta-auth-token');
            displayNotification({
              message: res.data.message,
              type: 'success',
            });
            setTimeout(() => {
              navigate('/');
            }, 0);
          } else if (res.status === 400 && res.data.success === 0) {
            displayNotification({
              message: res?.data?.message,
              type: 'error',
            });
          } else if (res.status === 500 && res.data.success === 0) {
            displayNotification({
              message: res?.data?.message,
              type: 'error',
            });
          }
        }
      } catch (err) {
        console.log(err);
        if (err.message === 'Network Error') {
          displayNotification({
            message: 'Network Error',
            type: 'error',
          });
        } else {
          displayNotification({
            message: err?.response?.data?.message,
            type: 'error',
          });
        }
      }
    };

    const handleUserClick = () => {
      // navigate to the employees section and set selectedEmployee to currentUser using id matching
      // Set selector of currentUser to "employees" & currentUser.id
      setCurrentUser(currentUser => {
        const updatedUser = { ...currentUser };
        updatedUser.selectedItem = {
          menu: 'employees',
          selected_id: currentUser.id,
        };
        return updatedUser;
      });
      navigate('/employee-management');
    };

    const currentBusinessData = businessSettings.find(
      business => business.businessID === currentBusiness,
    );

    return (
      <>
        {isModalVisible &&
          createPortal(
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <button
                    className="close-button"
                    onClick={() => setIsModalVisible(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="modal-body">
                  <h1 className="modal-body-header">
                    {currentBusinessData && currentBusinessData.name}{' '}
                    <span
                      style={{
                        color: '#858585',
                        fontSize: '0.6em',
                        marginLeft: '10px',
                      }}
                    >
                      {currentBusinessData && currentBusinessData.businessID}
                    </span>
                  </h1>
                  <p className="modal-body-text">
                    利用プラン:{' '}
                    {currentBusinessData && currentBusinessData.plan}
                  </p>
                  <p className="modal-body-text">
                    利用開始日:{' '}
                    {format(
                      currentBusinessData &&
                        currentBusinessData.registrationDate,
                      'yyyy年MM月dd日',
                      { locale: ja },
                    )}
                  </p>
                  <p className="modal-body-text">
                    利用終了日:{' '}
                    {format(
                      currentBusinessData &&
                        currentBusinessData.registrationEnd,
                      'yyyy年MM月dd日',
                      { locale: ja },
                    )}
                  </p>
                  <p className="modal-body-text">
                    利用期間:{' '}
                    {currentBusinessData && currentBusinessData.billingCycle}
                  </p>
                  <p className="modal-body-text">
                    住所: {currentBusinessData && currentBusinessData.address}
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )}

        <div className="bottomNavbar">
          <div
            className="bottomNavbarSelectable"
            onClick={handleBusinessSettingsClick}
          >
            <FontAwesomeIcon className="bottomNavbarIcon" icon={faCity} />
            <span>{currentBusinessData && currentBusinessData.name}</span>
          </div>
          <div className="bottomNavbarSelectable" onClick={handleUserClick}>
            <FontAwesomeIcon className="bottomNavbarIcon" icon={faCircleUser} />{' '}
            {currentUser.fullName}{' '}
            <span
              style={{ color: '#858585', fontSize: '0.8em', marginLeft: '8px' }}
            >
              ({currentUser.username})
            </span>
          </div>
          {/* if the user has mail, use faEnvelopeOpenText, otherwise just faEnvelopeOpen */}
          <div
            className="bottomNavbarSelectable"
            onClick={() => navigate('/mail')}
          >
            <FontAwesomeIcon
              className="bottomNavbarIcon"
              icon={
                currentUserUnreadMail() ? faEnvelopeOpenText : faEnvelopeOpen
              }
            />
            <span>メール</span>
          </div>
          <div className="bottomNavbarSelectable">
            <FontAwesomeIcon
              className="bottomNavbarIcon"
              icon={faRightFromBracket}
              onClick={handleLogout}
            />
            <span onClick={handleLogout}>ログアウト</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Notification />
      <TopNavbar />
      <Routes>
        <Route
          index
          element={
            <Landing
              users={users}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              businessSettings={businessSettings}
              setBusinessSettings={setBusinessSettings}
              currentBusiness={currentBusiness}
              setCurrentBusiness={setCurrentBusiness}
            />
          }
        />
        <Route path="/registration" element={<RegistrationNew />} />
        <Route path="/payment" element={<Payment />} />

        <Route element={<PrivateRoute />}>
          {route?.map((value, index) => (
            <Route
              key={index}
              path={value.path}
              element={
                <value.components
                  users={users}
                  setUsers={setUsers}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  businessSettings={businessSettings}
                  setBusinessSettings={setBusinessSettings}
                  currentBusiness={currentBusiness}
                  setCurrentBusiness={setCurrentBusiness}
                  customers={customers}
                  setCustomers={setCustomers}
                  employees={employees}
                  setEmployees={setEmployees}
                  products={products}
                  setProducts={setProducts}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  leadInfo={leadInfo}
                  setLeadInfo={setLeadInfo}
                  departments={departments}
                  setDepartments={setDepartments}
                  mail={mail}
                  setMail={setMail}
                  inventory={inventory}
                  setInventory={setInventory}
                  inventoryTypes={inventoryTypes}
                  setInventoryTypes={setInventoryTypes}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  expenseCategories={expenseCategories}
                  setExpenseCategories={setExpenseCategories}
                />
              }
            />
          ))}
        </Route>
      </Routes>
      {currentUser && (
        <BottomNavbar
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          businessSettings={businessSettings}
          setBusinessSettings={setBusinessSettings}
          currentBusiness={currentBusiness}
          setCurrentBusiness={setCurrentBusiness}
        />
      )}
    </BrowserRouter>
  );
}
