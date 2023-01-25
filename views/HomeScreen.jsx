/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function HomeScreen() {
  // const [sessionStarted, setSessionStarted] = useSessionStorage('session', false);

  return (
    <View style={styles.container}>
      <Text>COUCOU</Text>
    </View>
  );
}

HomeScreen.propTypes = {
};

export default HomeScreen;
