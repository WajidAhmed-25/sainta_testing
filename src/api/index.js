import { DataService } from './Axios';

const apiCalls = {
  logOut: () => DataService.get('user/logout'),
  login: data => DataService.post('user/login', data),
  signUp: data => DataService.post('user/signup', data),
  fetchAllCustomers: () => DataService.get('customer/fetch-all-customers'),
  createCustomer: data => DataService.post('customer/create-customer', data),
};

export default apiCalls;
