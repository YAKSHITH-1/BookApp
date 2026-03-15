import { Platform } from 'react-native';

const DEFAULT_HOST = 'https://bookapp-qkkt.onrender.com';
const DEFAULT_PORT = '3000';

let host = DEFAULT_HOST;
if (Platform.OS === 'android') {
  // Android emulators map host machine's 127.0.0.1 to 10.0.2.2
  host = "https://bookapp-qkkt.onrender.com" || '10.0.2.2';
}

export const API_URL = `http://${host}:${DEFAULT_PORT}`;

// If you need to override host for a physical device, set API_HOST env var in dev or replace constants/api.js
