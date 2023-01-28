/* eslint-disable no-else-return */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthState } from 'react-firebase-hooks/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from './services/firebaseConfig';
import HomeScreen from './views/HomeScreen';
import ODDScreen from './views/ODDScreen';
import Map from './views/Map';
import PhoneSignIn from './views/PhoneSignIn';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user] = useAuthState(auth);
  if (user) {
    return (
      <PaperProvider>
        <NavigationContainer>
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
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Map" component={Map} options={{ headerShown: false }} />
            <Tab.Screen name="ODD" component={ODDScreen} options={{ headerShown: false }} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  } else {
    return (
      <PhoneSignIn />
    );
  }
}
