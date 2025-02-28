// const isDev: boolean = import.meta.env.DEV;
const IS_DEV: boolean = window.location.hostname === 'localhost';

const BACKEND_BASE_URL: string = IS_DEV
  ? 'http://localhost:3000'
  : 'http://138.199.210.57:3000';

const DASHBOARD_BASE_URL: string = IS_DEV
  ? 'http://localhost:3000'
  : 'https://underbot2.herokuapp.com';

export default {
  BACKEND_BASE_URL,
  DASHBOARD_BASE_URL,
  IS_DEV,
};
