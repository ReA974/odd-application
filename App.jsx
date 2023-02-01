/* eslint-disable no-else-return */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthState } from 'react-firebase-hooks/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from './services/firebaseConfig';
import Map from './views/Map';
import HomeScreen from './views/HomeScreen';
import ODDScreen from './views/ODDScreen';
import PhoneSignIn from './views/PhoneSignIn';
import TropheeScreen from './views/TropheeScreen';
import ActivityView from './views/ActivityView';
import ChallengeView from './views/ChallengeView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: 'Accueil' }} />
      <Tab.Screen name="Map" component={Map} options={{ headerShown: false }} />
      <Tab.Screen name="ODD" component={ODDScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user] = useAuthState(auth);
  if (user) {
    return (
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="Trophees"
              component={TropheeScreen}
              options={{
                title: '', headerShown: true, headerBackButtonMenuEnabled: true, headerBackTitle: 'Accueil', headerTransparent: true,
              }}
            />
            <Stack.Screen
              name="Activites"
              component={ActivityView}
              options={{
                title: '', headerShown: true, headerBackButtonMenuEnabled: true, headerBackTitle: 'Map', headerTransparent: true,
              }}
            />
            <Stack.Screen
              name="Challenge"
              component={ChallengeView}
              options={{
                title: '', headerShown: true, headerBackButtonMenuEnabled: true, headerBackTitle: 'Map', headerTransparent: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  } else {
    return (
      <PhoneSignIn />
    );
  }
}
