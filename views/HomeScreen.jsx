/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@react-native-material/core';
import PropTypes from 'prop-types';
import { useSessionStorage } from '../services/useSessionStorage';
import { styles } from '../App.jsx';

function HomeScreen({ navigation }) {
  const [sessionStarted, setSessionStarted] = useSessionStorage('session', false);

  if (!sessionStarted) {
    return (
      <View style={styles.container}>
        <Button
          title="Start Session"
          onPress={() => { setSessionStarted(true); navigation.navigate('Map'); }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Session en cours</Text>
      <Button
        title="Stop Session"
        onPress={() => { setSessionStarted(false); navigation.navigate('Home'); }}
      />
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.instanceOf(Object),
};

export default HomeScreen;
