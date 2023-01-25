import { useState } from 'react';
import useSessionStorage from './useSessionStorage';

const [sessionTimeStart, setSessionTimeStart] = useSessionStorage('sessionTimeStart', 0);
const [sessionTimeEnd, setSessionTimeEnd] = useSessionStorage('sessionTimeEnd', 0);
const [sessionTime, setSessionTime] = useState(0);

// start the timer
function startSessionTimer(session) {
  const sessionTimeStartTemp = Date.now();
  if (session !== null) {
    setSessionTimeStart(sessionTimeStartTemp);
  }
}

// calculate the time

function calculateSessionTime(session) {
  const sessionTimeTemp = sessionTimeEnd - sessionTimeStart;
  if (session !== null) {
    setSessionTime(sessionTimeTemp);
  }
}

// stop the timer

function stopSessionTimer(session) {
  const sessionTimeEndTemp = Date.now();
  if (session !== null) {
    setSessionTimeEnd(sessionTimeEndTemp);
  }
  calculateSessionTime(session);
}

export {
  startSessionTimer, stopSessionTimer, calculateSessionTime, sessionTime,
};
