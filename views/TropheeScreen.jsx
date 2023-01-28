/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { useEffect, useState } from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {
  ProgressBar, Text, Card,
} from 'react-native-paper';
import {
  StyleSheet, View, ActivityIndicator,
} from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getDeltaTime } from '../services/timerSession';
import { getVisitedPOI, getAllPOI } from '../services/firebaseQueries';

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    padding: 0,
    width: 160,
    height: 260,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

  },
  cardLong: {
    marginTop: 20,
    padding: 5,
    width: 340,
    height: 160,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: '62%',
    backgroundColor: '#fcfcfc',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
});

// TODO : % bonne réponses

function TropheeScreen() {
  const [oddDiscovered, setODDDiscovered] = useState(new Set());
  const [nbrGoodAnswers, setNbrGoodAnswers] = useState(2);
  const [nbrQuestions, setNbrQuestions] = useState(5);
  const [visitedPOI, setVisitedPOI] = useState(0);
  const [tempsLastSession, setTempsLastSession] = useState(undefined);
  const [totalODD] = useState(17);
  const [loading, setLoading] = useState(true);
  const [totalPOI, setTotalPOI] = useState(0);
  const user = auth.currentUser;

  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round((totalMinutes % 60));

    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const resultDelta = await getDeltaTime(user);
      setTempsLastSession(resultDelta);
      const resultVisitedPOI = await getVisitedPOI(user);
      setVisitedPOI(resultVisitedPOI);
      const tempPOI = await getAllPOI();
      tempPOI.forEach((elem) => {
        elem.linkedODD.forEach((odd) => {
          setODDDiscovered((prev) => new Set(prev.add(odd)));
        });
      });
      setTotalPOI(tempPOI.length);
      setLoading(false);
    })();
  }, []);
  return (
    !loading ? (
      <View style={styles.title}>
        <Text variant="headlineMedium" style={{ fontWeight: '600', marginBottom: 15 }}> Mes trophées 🏆</Text>
        <View style={styles.content}>
          <Card key={1} style={styles.card}>
            <Card.Content>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress
                  value={((oddDiscovered.size / totalODD) * 100)}
                  inActiveStrokeColor="#00CED1"
                  inActiveStrokeOpacity={0.2}
                  progressValueColor="black"
                  activeStrokeColor="#00CED1"
                  valueSuffix="%"
                  radius={55}
                />
              </View>
              <Text variant="titleMedium" style={{ fontWeight: '600' }}>ODD découverts</Text>
              <Text variant="titleSmall" style={{ fontWeight: '200' }}>
                J&apos;ai pu découvrir
                {' '}
                {oddDiscovered.size}
                {' '}
                ODD
                !
              </Text>
              <Text variant="titleSmall" style={{ fontWeight: '200' }}>
                Plus que
                {' '}
                {totalODD - oddDiscovered.size}
                {' '}
                !
              </Text>
            </Card.Content>
          </Card>
          <Card key={2} style={styles.card}>
            <Card.Content>
              <View style={{ alignItems: 'center' }}>
                <CircularProgress
                  value={((nbrGoodAnswers / nbrQuestions) * 100)}
                  inActiveStrokeColor="#00CED1"
                  inActiveStrokeOpacity={0.2}
                  progressValueColor="black"
                  activeStrokeColor="#00CED1"
                  valueSuffix="%"
                  radius={55}
                />
              </View>
              <Text variant="titleMedium" style={{ fontWeight: '600' }}>Bonne réponses</Text>
              <Text variant="titleSmall" style={{ fontWeight: '200' }}>
                {(nbrGoodAnswers / nbrQuestions) > 0.7 ? 'Excellent résultat !' : (nbrGoodAnswers / nbrQuestions) < 0.5 ? 'Courage !' : "C'est bien !"}
              </Text>
              <Text variant="titleSmall" style={{ fontWeight: '200' }}>
                Continue ainsi
              </Text>
            </Card.Content>
          </Card>
        </View>
        <View styles={styles.column}>
          <Card key={3} style={styles.cardLong}>
            <Card.Content style={{ paddingTop: 10 }}>
              <Text variant="titleLarge" style={{ fontWeight: '500' }}>Temps dernier parcours</Text>
              <Text
                variant="displayMedium"
                style={{ color: '#00CED1', marginTop: 5, marginBottom: 5 }}
              >
                {toHoursAndMinutes(tempsLastSession) || 'Aucune session réalisée'}

              </Text>
              <Text variant="bodyLarge">
                {visitedPOI.length}
                {' '}
                points d&apos;intérets visités
              </Text>
              <ProgressBar progress={visitedPOI.length / totalPOI} color="#00CED1" style={{ width: 250, marginTop: 5 }} />
            </Card.Content>
          </Card>
        </View>
      </View>
    )
      : (
        <View style={styles.loading}>
          <Text style={{ marginBottom: 10 }}>Chargement des données... </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )

  );
}

export default TropheeScreen;