/* eslint-disable max-len */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';
import GetActivities from '../services/GetActivities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ActivityView(props, { navigation }) {
  function handleAnswer(answer, goodAnswer) {
    if (answer === goodAnswer) {
      alert('Bonne réponse');
      navigation.navigate('Activites');
    } else {
      alert(`Mauvaise réponse ! la bonne réponse était : ${goodAnswer}`);
    }
  }

  if (props !== undefined) {
    const { route } = props;
    const { itemid } = route.params;
    const activities = GetActivities(itemid);
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
              <Button onPress={() => { handleAnswer(answer, question.goodAnswer); }}>{answer}</Button>
            ))}
          </View>
        );
      }
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
      itemid: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ActivityView;
