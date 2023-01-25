import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBFXI88w_YtNZOwiUxZ-kU8RclocKdRtPQ',
  authDomain: 'projet-odd.firebaseapp.com',
  projectId: 'projet-odd',
  storageBucket: 'projet-odd.appspot.com',
  messagingSenderId: '559952560648',
  appId: '1:559952560648:web:8b3a7a0369dcd5f938c7bd',
  measurementId: 'G-C9QNQ4V9P1',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
