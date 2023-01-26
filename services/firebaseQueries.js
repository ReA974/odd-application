/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { collection, getDocs } from 'firebase/firestore';
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

export async function getAllPOI() {
  const POIArray = [];
  const tempCollection = [];
  const querySnapshot = await getDocs(collection(db, 'POI'));

  querySnapshot.forEach((doc) => {
    const object = doc.data();
    object.id = doc.id;
    tempCollection.push(object);
  });

  for (const doc of tempCollection) {
    const object = doc;
    const url = await getImageByPOI(object.id);
    object.imageURL = url;
    POIArray.push(object);
  }
  return POIArray;
}
