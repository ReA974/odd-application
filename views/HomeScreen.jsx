import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@react-native-material/core';
import { useSessionStorage } from '../services/useSessionStorage';
import { styles } from '../App';

function HomeScreen({navigation}) {
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
    else {
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


export default HomeScreen;