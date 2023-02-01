import {
  doc, setDoc, Timestamp, updateDoc, deleteField, getDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
// Querry to store data in a group and find that by phone number at the start of the session
async function startTimer(user) {
  const phoneNumber = `0${user.phoneNumber.substring(3)}`;
  const start = Timestamp.fromDate(new Date());
  await setDoc(doc(db, 'GROUP', phoneNumber), {
    startSession: start,
  }, { merge: true });
  await updateDoc(doc(db, 'GROUP', phoneNumber), {
    endSession: deleteField(),
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
  let Delta = 0;
  const phoneNumber = `0${user.phoneNumber.substring(3)}`;
  const docRef = doc(db, 'GROUP', phoneNumber);
  setTimeout(async () => {
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const start = data.startSession;
    const end = data.endSession;
    const delta = end - start;
    Delta = delta / 60;
  }, 200);
  return Delta;
}

export { startTimer, stopTimer, getDeltaTime };
