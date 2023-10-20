// const isDev: boolean = import.meta.env.DEV;
const isDev: boolean = window.location.hostname === 'localhost';

const BACKEND_BASE_URL: string = isDev
  ? 'http://localhost:3000'
  : 'https://api.backend.com';


export default {
  BACKEND_BASE_URL,
  isDev,
};
