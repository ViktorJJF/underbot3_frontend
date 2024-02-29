import io from 'socket.io-client';
import config from '@/config';

const socketUrl = config.BACKEND_BASE_URL;
const socket = io(socketUrl);
import store from '@/store/index';

socket.on('CONNECTED', (socketId) => {
  console.log('CONECTADO!: ', socketId);
});

socket.on('NEW_ODD', (data) => {
  console.log('LLego nuevo odd: ', data);
});

export default socket;
