/* eslint-disable max-len */
import React from 'react';
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button, Dialog, Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addAnswer, getActivity } from '../services/firebaseQueries';
import { auth } from '../services/firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
});

function ActivityView(props) {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const { route } = props;
  const { itemid } = route.params;
  const [goodAnswerUser, setGoodAnswerUser] = React.useState(false);
  const [activities, setActivities] = React.useState(null);
  React.useEffect(() => {
    async function fetchData() {
      const result = await getActivity(itemid);
      setActivities(result);
    }
    fetchData();
  }, []);

  function handleAnswer(answer, goodAnswer) {
    if (answer === goodAnswer) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
    } else {
      addAnswer(user, false);
      setGoodAnswerUser(false);
    }
    activities[0].activityAnswered = answer;
    setVisible(true);
  }

  if (activities !== null) {
    const { question } = activities[0];
    if (question !== undefined) {
      const answerTab = [];
      answerTab.push(question.goodAnswer);
      question.badAnswers.forEach((element) => {
        answerTab.push(element);
      });
      answerTab.sort(() => Math.random() - 0.5);
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View style={{ margin: 10, alignItems: 'center' }}>
              <Text style={{ textAlign: 'center' }} variant="headlineSmall">{question.title}</Text>
              {answerTab.map((answer) => (
                <Button style={{ margin: 10, width: 280, backgroundColor: '#4CB1FF' }} key={answer} mode="contained" onPress={() => { handleAnswer(answer, question.goodAnswer); }}>{answer}</Button>
              ))}
            </View>
          </ScrollView>
          <Dialog visible={visible}>
            {goodAnswerUser && (
            <>
              <Dialog.Title>Bravo !</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Vous avez trouvé la bonne réponse
                </Text>
              </Dialog.Content>
            </>
            )}
            {!goodAnswerUser && (
            <>
              <Dialog.Title>Perdu !</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  La bonne réponse était
                  {' '}
                  {question.goodAnswer}
                </Text>
              </Dialog.Content>
            </>
            )}
            <Dialog.Actions>
              <Button style={{ backgroundColor: '#4CB1FF' }} onPress={() => { navigation.navigate('Challenge', { activity: activities }); }}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </SafeAreaView>

      );
    }
  }
  return (
    <View style={styles.container}>
      <Text>Aucune activité disponible</Text>
    </View>
  );
}

ActivityView.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ActivityView;
