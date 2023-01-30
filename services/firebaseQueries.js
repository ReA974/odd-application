/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import {
  collection, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

export async function getImageByPOI(id) {
  let URI = '';
  const referenceToImage = ref(storage, `POI/${id}`);
  // Get the download URL
  URI = await getDownloadURL(referenceToImage).catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
  return URI;
}

export function getPhoneNumber(user) {
  if (user) {
    return `0${user.phoneNumber.slice(3)}`;
  }
  return null;
}

export async function getVisitedPOI(user) {
  const POIVisitedArray = [];
  const phoneNumber = getPhoneNumber(user);
  const result = await getDocs(collection(db, 'GROUP', phoneNumber, 'VISIT'));
  result.forEach((resDoc) => {
    POIVisitedArray.push(resDoc.id);
  });
  return POIVisitedArray;
}

export async function getStartDate(user) {
  let startSession;
  let endSession;
  const phoneNumber = getPhoneNumber(user);
  const tempDoc = await getDoc(doc(db, 'GROUP', phoneNumber));
  if (tempDoc) {
    startSession = tempDoc.data().startSession;
    if (tempDoc.data().endSession) {
      endSession = tempDoc.data().endSession;
    }
  }
  return [startSession.seconds, endSession];
}

export async function getAllPOI() {
  const POIArray = [];
  const tempCollection = [];
  const querySnapshot = await getDocs(collection(db, 'POI'));

  querySnapshot.forEach((tempDoc) => {
    const object = tempDoc.data();
    object.id = tempDoc.id;
    tempCollection.push(object);
  });

  for (const doc1 of tempCollection) {
    const object = doc1;
    const url = await getImageByPOI(object.id);
    object.imageURL = url;
    POIArray.push(object);
  }
  return POIArray;
}
