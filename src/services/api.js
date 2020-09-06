import axios from 'axios';

const api = axios.create({
  baseURL: 'https://desafio-final-igti-backend.herokuapp.com/api/transaction',
});

export default api;
