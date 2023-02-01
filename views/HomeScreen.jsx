/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import {
  StyleSheet, View, Image, TouchableOpacity,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import logoAssociation from '../assets/logoAssociation.png';
import learning from '../assets/learning.png';
import progress from '../assets/progress.png';
import { auth } from '../services/firebaseConfig';
import * as timerSession from '../services/timerSession';

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 210,
    height: 130,
    marginRight: 10,
  },
  card: {
    display: 'flex',
    margin: 10,
    paddingTop: 15,
    padding: 10,
    width: 150,
    height: 256,
    borderRadius: 40,
    backgroundColor: '#fcfcfc',
  },
  cardMini: {
    margin: 10,
    padding: 10,
    width: 150,
    height: 140,
    borderRadius: 40,
    backgroundColor: '#4CB1FF',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#fcfcfc',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
  },
});

function HomeScreen({
  navigation, startTimer, clearTimer, startDate, endDate,
}) {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <Image source={logoAssociation} style={styles.logo} />
      <Text variant="displayMedium" style={{ marginBottom: '10%', color: '#1a489c' }}>ODDyssée</Text>
      <View style={styles.content}>
        <View style={styles.column}>
          {startDate !== undefined && endDate !== undefined
            ? (
              <TouchableOpacity activeOpacity={0.5} onPress={async () => { await startTimer(); await timerSession.startTimer(user); navigation.navigate('Map', { refresh: true }); }}>
                <Card key={1} style={styles.cardMini}>
                  <Card.Content style={{ paddingTop: 10 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: 'white' }}>Démarrer une session</Text>
                    <Text variant="bodyMedium" style={{ color: 'white' }}>Parcours Niort</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )
            : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={async () => { clearTimer(); await timerSession.stopTimer(user); navigation.navigate('Trophees'); }}
              >
                <Card key={1} style={styles.cardMini}>
                  <Card.Content style={{ paddingTop: 10 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '600', color: 'white' }}>Arrêter une session</Text>
                    <Text variant="bodyMedium" style={{ color: 'white' }}>Parcours Niort</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Trophees')}>
            <Card key={2} style={styles.card}>
              <Card.Content style={{ paddingTop: 10 }}>
                <Text variant="titleLarge" style={{ fontWeight: '500' }}>Mes trophées</Text>
              </Card.Content>
              <Card.Cover
                source={progress}
                style={styles.image}
              />
            </Card>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ODD')}>
          <Card key={3} style={styles.card}>
            <Card.Content style={{ paddingTop: 0 }}>
              <Text variant="titleLarge" style={{ fontWeight: '500', flexWrap: 'nowrap' }}>Decouvrir les ODD</Text>
            </Card.Content>
            <View style={{ justifyContent: 'flex-end' }}>
              <Card.Cover
                source={learning}
                style={styles.image}
              />
            </View>
          </Card>
        </TouchableOpacity>
        {/*  <Button mode="contained" onPress={() => { auth.signOut(); }}> Déconnexion</Button> */}
      </View>
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
  startTimer: PropTypes.func.isRequired,
  clearTimer: PropTypes.func.isRequired,
  startDate: PropTypes.number,
  endDate: PropTypes.number,
};
HomeScreen.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};

export default HomeScreen;
