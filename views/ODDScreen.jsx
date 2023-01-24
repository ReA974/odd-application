/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  Card, Text,
} from 'react-native-paper';
import {
  vw, vh,
} from 'react-native-expo-viewport-units';
import ODDContent from './helpers/ODDContent';

const styleODD = StyleSheet.create({
  card: {
    margin: 20,
    padding: 0,
  },
  image: {
    width: vw(90),
    height: vh(40),
    minHeight: 300,
  },
});

function ODDScreen() {
  return (
    <ScrollView>
      {Object.keys(ODDContent).map((keyName) => (
        <Card key={keyName} style={styleODD.card}>
          <Card.Cover
            source={ODDContent[keyName].image}
            style={styleODD.image}
          />
          <Card.Content style={{ paddingTop: 10 }}>
            <Text variant="titleLarge">{ODDContent[keyName].title}</Text>
            <Text variant="bodyMedium">{ODDContent[keyName].content}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

export default ODDScreen;
