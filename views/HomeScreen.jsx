/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import useSessionStorage from '../services/useSessionStorage';
import { styles } from '../App';

function HomeScreen({ navigation }) {
  const [sessionStarted, setSessionStarted] = useSessionStorage('session', false);

  if (!sessionStarted) {
    return (
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() => { setSessionStarted(true); navigation.navigate('Map'); }}
        >
          Start Session
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Session en cours</Text>
      <Button
        mode="contained"
        // eslint-disable-next-line no-alert
        onPress={() => { setSessionStarted(false); navigation.navigate('PhoneSignIn'); }}
      >
        Stop session
      </Button>
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
};

export default HomeScreen;
