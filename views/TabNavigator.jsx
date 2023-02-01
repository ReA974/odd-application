/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthState } from 'react-firebase-hooks/auth';
import HomeScreen from './HomeScreen';
import { auth } from '../services/firebaseConfig';
import ODDScreen from './ODDScreen';
import Map from './Map';
import { getStartDate } from '../services/firebaseQueries';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [user] = useAuthState(auth);
  const [intervalID, setIntervalID] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigation = useNavigation();

  const getTime = (tempValueStart, tempValueEnd) => {
    if (tempValueStart && tempValueEnd === undefined) {
      const time = Date.now() - tempValueStart * 1000;
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  function clear() {
    if (endDate === undefined) {
      setEndDate(Timestamp.fromDate(new Date()).seconds);
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    clearInterval(intervalID);
  }
  async function startTimer(flagFirstLaunch, tempDate) {
    const tempValueEnd = undefined;
    let tempValueStart;
    setEndDate(tempValueEnd);
    if (flagFirstLaunch && tempDate !== undefined) {
      tempValueStart = tempDate;
    } else {
      tempValueStart = Timestamp.fromDate(new Date()).seconds;
    }
    setStartDate(tempValueStart);
    const ID = setInterval(() => getTime(tempValueStart, tempValueEnd), 1000);
    setIntervalID(ID);
  }

  useEffect(() => {
    (async () => {
      const [tempStartDate, tempEndDate] = await getStartDate(user);
      if (tempEndDate !== undefined) {
        setEndDate(tempEndDate.seconds);
      }
      if (tempStartDate !== undefined) {
        setStartDate(tempStartDate);
        await startTimer(true, tempStartDate);
      }
    })();
    return () => clearInterval(intervalID);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
          } else if (route.name === 'Map') {
            iconName = focused
              ? 'map'
              : 'map-outline';
          } else if (route.name === 'ODD') {
            iconName = focused
              ? 'information-circle'
              : 'information-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" options={{ headerShown: false, title: 'Accueil' }}>
        {() => (
          <HomeScreen
            navigation={navigation}
            startTimer={async () => startTimer(false)}
            clearTimer={() => clear()}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Map" options={{ headerShown: false }}>
        {() => (
          <Map
            navigation={navigation}
            startDate={startDate}
            endDate={endDate}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            clearTimer={() => clear()}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="ODD" component={ODDScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
