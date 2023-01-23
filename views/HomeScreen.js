import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-native-material/core';
import { StatusBar } from 'expo-status-bar';
import { useSessionStorage } from '../components/useSessionStorage';

function HomeScreen() {
    const [sessionStarted, setSessionStarted] = useSessionStorage('session', false);

    if (!sessionStarted) {
      return (
        <>
          <Text>test</Text>
          // on press of button, set session to true and alert user
            <Button onPress={() => {setSessionStarted(true); navigation.navigate('Map');}}>Start Session</Button>
          <StatusBar style="auto" />
        </>
      );
    }
  
    return (
      <View style={styles.container}>
         <Text>test</Text>
        <StatusBar style="auto" />
      </View>
    );
}

export default HomeScreen;