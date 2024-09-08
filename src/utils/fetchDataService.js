import axios from 'axios';

export const fetchData = async (endpoint, params) => {
  try {
    const res = await axios.get(endpoint, params);
    if (res.status === 200) {
      return res.data;
    } else {
      console.error('Non-successful status code:', res.status);
      throw new Error(`Non-successful status code: ${res.status}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
