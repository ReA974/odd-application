/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import {
  collection, getDocs, getDoc, doc, updateDoc, increment, setDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
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

export async function getActivity(id) {
  const activityArray = [];
  const result = await getDoc(doc(db, 'POI', id));
  if (result.exists()) {
    const activity = result.data();
    activityArray.push(activity);
  }
  if (activityArray[0].challenge.image !== undefined) {
    const url = await getImageForChallenge(activityArray[0].challenge.image);
    if (url !== undefined) {
      activityArray[0].challenge.imageURL = url;
    }
  }
  if (activityArray[0].challenge.goodAnswer !== undefined) {
    // check if goodAnswer is an image in string
    if (activityArray[0].challenge.goodAnswer.includes('CHALLENGE')) {
      const url = await getImageForChallenge(activityArray[0].challenge.goodAnswer);
      if (url !== undefined) {
        activityArray[0].challenge.goodAnswerUrl = url;
      }
    }
  }
  activityArray[0].MarkerId = id;
  return activityArray;
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
// eslint-disable-next-line max-len
export async function updateUserVisitedMarker(user, markerId, tempChallengeAnswer, tempQuestionAnswer, choosedODD) {
  const phoneNumber = getPhoneNumber(user);
  const challengeAnswer = tempChallengeAnswer === undefined ? '' : tempChallengeAnswer;
  const questionAnswer = tempQuestionAnswer === undefined ? '' : tempQuestionAnswer;
  await setDoc(doc(db, 'GROUP', phoneNumber, 'VISIT', markerId), {
    challengeAnswer,
    questionAnswer,
    choosedODD,
    timestamp: new Date(),
  }, { merge: true });
}

// upload image to firebase storage
export const setResponsePicture = async (user, markerId, image) => {
  const response = await fetch(image);
  const blobFile = await response.blob();
  const phoneNumber = getPhoneNumber(user);
  const storageRef = ref(storage, `GROUP/${phoneNumber}/VISIT/${markerId}`);
  uploadBytes(storageRef, blobFile);
  const imageURL = await uploadBytes(storageRef, image);
  return imageURL.metadata.fullPath;
};
