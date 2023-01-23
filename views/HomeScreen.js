import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@react-native-material/core';
import { useSessionStorage } from '../components/useSessionStorage';

function HomeScreen() {
    const [sessionStarted, setSessionStarted] = useSessionStorage('session', false);

    if (!sessionStarted) {
      return (
        <View style={styles.container}>
            <Button 
            title="Start Session"
            onPress={() => {setSessionStarted(true); navigation.navigate('Map');}}
            />
        </View>
      );
    }
    else{
      return (
        <View style={styles.container}>
            <Text>Session en cours</Text>
            <Button 
            title="Stop Session"
            onPress={() => {setSessionStarted(false); navigation.navigate('Home');}}/>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;