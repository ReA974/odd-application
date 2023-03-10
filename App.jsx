/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogBox } from 'react-native';
import { auth } from './services/firebaseConfig';
import PhoneSignIn from './views/PhoneSignIn';
import TropheeScreen from './views/TropheeScreen';
import TabNavigator from './views/TabNavigator';
import ActivityView from './views/ActivityView';
import ChallengeView from './views/ChallengeView';
import DescriptionView from './views/DescriptionView';

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs();
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
              name="Description"
              component={DescriptionView}
              options={{
                title: '', headerShown: true, headerBackButtonMenuEnabled: true, headerBackTitle: 'Map', headerTransparent: true,
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
