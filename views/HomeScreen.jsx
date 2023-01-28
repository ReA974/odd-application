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
    margin: 10,
    padding: 10,
    width: 150,
    height: 250,
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
    marginTop: 20,
    width: '100%',
    height: '62%',
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

function HomeScreen({ navigation }) {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <Image source={logoAssociation} style={styles.logo} />
      <Text variant="displayMedium" style={{ marginBottom: '10%', color: '#1a489c' }}>ODDyssée</Text>
      <View style={styles.content}>
        <View style={styles.column}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => { timerSession.startTimer(user); navigation.navigate('Map'); }}>
            <Card key={1} style={styles.cardMini}>
              <Card.Content style={{ paddingTop: 10 }}>
                <Text variant="bodyLarge" style={{ fontWeight: '600', color: 'white' }}>Démarrer une session</Text>
                <Text variant="bodyMedium" style={{ color: 'white' }}>Parcours Niort</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Home')}>
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
          <Card key={2} style={styles.card}>
            <Card.Content style={{ paddingTop: 10 }}>
              <Text variant="titleLarge" style={{ fontWeight: '500' }}>Decouvrir les ODD</Text>
            </Card.Content>
            <Card.Cover
              source={learning}
              style={styles.image}
            />
          </Card>
        </TouchableOpacity>
        {/*  <Button mode="contained" onPress={() => { auth.signOut(); }}> Déconnexion</Button>
        <Button mode="contained" onPress={() => { timerSession.stopTimer(user); }}> Stop</Button>
        <Button
        mode="contained"
         onPress={() => { timerSession.getDeltaTime(user); }}> Get Time Delta</Button>
         */}
      </View>

    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
};

export default HomeScreen;
