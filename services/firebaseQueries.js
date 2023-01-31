/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import {
  collection, getDocs, getDoc, doc, updateDoc, increment,
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

export async function getImageForChallenge(url) {
  let URI = '';
  const referenceToImage = ref(storage, url);
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

export async function getAllPOI() {
  const POIArray = [];
  const tempCollection = [];
  const querySnapshot = await getDocs(collection(db, 'POI'));

  querySnapshot.forEach((doc1) => {
    const object = doc1.data();
    object.id = doc1.id;
    tempCollection.push(object);
  });

  for (const doc2 of tempCollection) {
    const object = doc2;
    const url = await getImageByPOI(object.id);
    object.imageURL = url;
    POIArray.push(object);
  }
  return POIArray;
}

export async function getActivity(id) {
  const activityArray = [];
  const tempCollection = [];
  const result = await getDoc(doc(db, 'POI', id));
  if (result.exists()) {
    const activity = result.data();
    activityArray.push(activity);
  }

  for (const doc1 of activityArray) {
    const object = doc1;
    const url = await getImageForChallenge(object.challenge.image);
    object.challenge.imageURL = url;
    tempCollection.push(object);
  }
  return tempCollection;
}

export async function addAnswer(user, goodAnswer) {
  const phoneNumber = getPhoneNumber(user);
  const docRef = doc(db, 'GROUP', phoneNumber);
  if (goodAnswer === true) {
    await updateDoc(docRef, {
      goodAnswer: increment(1),
      answer: increment(1),
    });
  } else {
    await updateDoc(docRef, {
      answer: increment(1),
    });
  }
}
