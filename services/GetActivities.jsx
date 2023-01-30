import { useState, useEffect } from 'react';
import { getActivity } from './firebaseQueries';

function GetActivities(id) {
  const [activities, setActivities] = useState(null);
  useEffect(() => {
    (async () => {
      const tempActivities = await getActivity(id);
      setActivities(tempActivities);
    })();
  }, []);
  return activities;
}

export default GetActivities;
