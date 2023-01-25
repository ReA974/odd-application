/* eslint-disable import/prefer-default-export */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
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
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Gets methods to certains collection :
