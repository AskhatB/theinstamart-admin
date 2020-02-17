import axios from 'axios';
const URL = 'https://api.theinstamart.com/';

const instance = axios.create({
  baseURL: URL
});

export default instance;
