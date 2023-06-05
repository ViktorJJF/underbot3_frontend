const isDev: boolean =
  window.location.hostname === 'localhost' || !window.location.hostname;

const BACKEND_BASE_URL: string = isDev
  ? 'http://localhost:9090'
  : 'https://rasaia.databot.cl';

const DATABOT_BOT_URL: string = 'https://databot-api.herokuapp.com';
const DATABOT_DASHBOARD_BACKEND_URL: string = 'https://api.databot.cl';

export default {
  BACKEND_BASE_URL,
  DATABOT_BOT_URL,
  DATABOT_DASHBOARD_BACKEND_URL,
};
