/* eslint-disable import/prefer-default-export */
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function getAllPOI() {
  const POIArray = [];
  const querySnapshot = await getDocs(collection(db, 'POI'));
  querySnapshot.forEach((doc) => {
    POIArray.push(doc.data());
  });
  return POIArray;
}
