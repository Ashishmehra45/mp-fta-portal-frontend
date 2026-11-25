const API_URL: string =
  import.meta.env.MODE === 'production'
    ? 'https://mptradeportal.org/api'
    : 'http://localhost:5000/api';

export default API_URL;