// const isDev: boolean = import.meta.env.DEV;
const isDev: boolean = import.meta.env.DEV;
const isDevLocal: boolean = window.location.hostname === 'localhost';
console.log('🚀 Aqui *** -> isDev ENV VARIABLE:', isDev);
console.log('🚀 Aqui *** -> isDevLocal :', isDevLocal);

const BACKEND_BASE_URL: string = isDev
  ? 'http://localhost:9090'
  : 'https://rasaia.databot.cl';

const DATABOT_BOT_URL: string =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://databot-api.herokuapp.com';
const DATABOT_DASHBOARD_BACKEND_URL: string = isDev
  ? 'http://localhost:3000'
  : 'https://api.databot.cl';
export default {
  BACKEND_BASE_URL,
  DATABOT_BOT_URL,
  DATABOT_DASHBOARD_BACKEND_URL,
  isDev,
};
