import { Platform } from 'react-native';

const DEFAULT_HOST = '192.168.1.6';
const DEFAULT_PORT = '3000';

let host = DEFAULT_HOST;
if (Platform.OS === 'android') {
  host ="https://bookapp-qkkt.onrender.com"
}

export const API_URL = `http://${host}:${DEFAULT_PORT}`;

