import axios from 'axios';
import env from 'env';

const request = () => {
  const defaultOptions = {
    baseURL: env.weatherApi.url,
    headers: {
      'Content-Type': 'application/json; application/ld+json; text/html; charset=utf-8'
    }
  };

  const instance = axios.create(defaultOptions);

  return instance;
};

export default request();
