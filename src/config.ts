// const isDev: boolean = import.meta.env.DEV;
const IS_DEV: boolean = window.location.hostname === 'localhost';

const BACKEND_BASE_URL: string = IS_DEV
  ? 'http://localhost:3000'
  : 'https://api-underbot.legimus.ai';

const DASHBOARD_BASE_URL: string = IS_DEV
  ? 'http://localhost:3000'
  : 'https://api-underbot.legimus.ai';

export default {
  BACKEND_BASE_URL,
  DASHBOARD_BASE_URL,
  IS_DEV,
};
