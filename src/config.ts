const isDev: boolean =
  window.location.hostname === 'localhost' || !window.location.hostname;

const BACKEND_BASE_URL: string = isDev
  ? 'http://localhost:9090'
  : 'https://rasaia.databot.cl';

export default { BACKEND_BASE_URL };
