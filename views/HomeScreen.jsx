/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth } from '../services/firebaseConfig';
import * as timerSession from '../services/timerSession';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function HomeScreen() {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button mode="contained" onPress={() => { auth.signOut(); }}> Déconnexion</Button>
      <Button mode="contained" onPress={() => { timerSession.startTimer(user); }}> Start</Button>
      <Button mode="contained" onPress={() => { timerSession.stopTimer(user); }}> Stop</Button>
      <Button mode="contained" onPress={() => { timerSession.getDeltaTime(user); }}> Get Time Delta</Button>
    </View>
  );
}

HomeScreen.propTypes = {
};

export default HomeScreen;
