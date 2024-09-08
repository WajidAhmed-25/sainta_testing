import axios from 'axios';

const baseURL = {
  local: process.env.REACT_APP_LOCAL_API,
  prod: process.env.REACT_APP_PROD_API,
};

const client = axios.create({
  baseURL:
    process.env.REACT_APP_NODE_ENV === 'DEV' ? baseURL.local : baseURL.prod,
  withCredentials: true,
});

class DataService {
  static get(path = '') {
    return client({
      method: 'GET',
      url: path,
    });
  }

  static post(path = '', data = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
    });
  }

  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
    });
  }

  static put(path = '', data = {}) {
    return client({
      method: 'PUT',
      url: path,
      data: JSON.stringify(data),
    });
  }
}

export { DataService };
