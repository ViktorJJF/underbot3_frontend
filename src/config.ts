// const isDev: boolean = import.meta.env.DEV;
const isDev: boolean = window.location.hostname === 'localhost';

const BACKEND_BASE_URL: string = isDev
  ? 'http://localhost:9090'
  : 'https://rasaia2.databot.cl';

const DATABOT_BOT_URL: string = isDev
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
