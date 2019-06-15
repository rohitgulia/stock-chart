import axios from 'axios';

export default axios.create({
  baseURL: 'https://cloud.iexapis.com/stable/stock/market/batch',
});
