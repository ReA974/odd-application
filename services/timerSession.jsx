import {
  doc, setDoc, Timestamp, getDocs, collection,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
// Querry to store data in a group and find that by phone number at the start of the session
async function startTimer(user) {
  const phoneNumber = `0${user.phoneNumber.substring(3)}`;
  const start = Timestamp.fromDate(new Date());
  await setDoc(doc(db, 'GROUP', phoneNumber), {
    startSession: start,
  });
}

// Store data at the end of the session and calculate the time
async function stopTimer(user) {
  const phoneNumber = `0${user.phoneNumber.substring(3)}`;
  const stop = Timestamp.fromDate(new Date());
  await setDoc(doc(db, 'GROUP', phoneNumber), {
    endSession: stop,
  }, { merge: true });
}

// Get the time of the last session
async function getDeltaTime(user) {
  let Delta;
  const phoneNumber = `0${user.phoneNumber.substring(3)}`;
  const querySnapshot = await getDocs(collection(db, 'GROUP'));
  querySnapshot.forEach((doc1) => {
    if (doc1.id === phoneNumber) {
      const start = doc1.data().startSession;
      const end = doc1.data().endSession;
      const delta = end - start;
      Delta = delta / 60;
    }
  });
  await setDoc(doc(db, 'GROUP', phoneNumber), {
    deltaSession: Delta,
  }, { merge: true });
}

export { startTimer, stopTimer, getDeltaTime };
