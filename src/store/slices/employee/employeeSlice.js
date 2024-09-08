import { createSlice } from '@reduxjs/toolkit';
import { formatDateFromString } from '../../../utils/utilityFunctions';

const initialState = {
  departments: [
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
  ],
  employees: [
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
  ],
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addDepartment: (state, action) => {
      const newDepartment = { ...action.payload };
      state.departments.push(newDepartment);
    },
    updateDepartments: (state, action) => {
      state.departments = action.payload;
    },
    addEmployee: (state, action) => {
      const newEmployee = { ...action.payload };
      state.employees.push(newEmployee);
    },
    updateEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const selectAlldepartments = state => state.employee.departments;
export const selectAllemployees = state => state.employee.employees;

export const {
  addDepartment,
  addEmployee,
  updateEmployees,
  updateDepartments,
} = employeeSlice.actions;
export default employeeSlice.reducer;
