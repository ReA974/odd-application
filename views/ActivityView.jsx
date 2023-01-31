/* eslint-disable max-len */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import {
  Button, Dialog,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import GetActivities from '../services/GetActivities';
import { addAnswer } from '../services/firebaseQueries';
import { auth } from '../services/firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ActivityView(props) {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const { route } = props;
  const { itemid } = route.params;
  const [goodAnswerUser, setGoodAnswerUser] = React.useState(false);
  const activities = GetActivities(itemid);
  function handleAnswer(answer, goodAnswer) {
    if (answer === goodAnswer) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
    } else {
      addAnswer(user, false);
      setGoodAnswerUser(false);
    }
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
        <View style={styles.container}>
          <Text>{question.title}</Text>
          {answerTab.map((answer) => (
            <Button mode="contained" key={answer} onPress={() => { handleAnswer(answer, question.goodAnswer); }}>{answer}</Button>
          ))}
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
              <Button onPress={() => { navigation.navigate('Challenge', { activity: activities }); }}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </View>
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
