import PropTypes from 'prop-types';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import React from 'react';
import {
  Button, Dialog, TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { addAnswer } from '../services/firebaseQueries';
import { auth } from '../services/firebaseConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 250,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  reponse: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

async function ChallengeView(props) {
  const navigation = useNavigation();
  const { route } = props;
  const { activity } = route.params;
  const { challenge } = activity[0];
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState('');
  const [goodAnswerUser, setGoodAnswerUser] = React.useState(false);
  const user = auth.currentUser;

  function checkAnswer(goodAnswer) {
    if (text === goodAnswer) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
    } else {
      setGoodAnswerUser(false);
      addAnswer(user, false);
    }
    setVisible(true);
  }

  if (challenge) {
    return (
      <>
        {challenge.type === 'field' && (
          <>
            <View style={styles.title}>
              {challenge.title !== undefined && (
                <Text variant="headlineMedium" style={{ fontWeight: '600', marginBottom: 15 }}>
                  {' '}
                  {challenge.title}
                </Text>
              )}
              {challenge.imageURL !== undefined && (
                <Image
                  source={{ uri: challenge.imageURL }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
            <View style={styles.reponse}>
              <TextInput
                style={{ width: '70%' }}
                label="Réponse"
                value={Text}
                onChangeText={(tempText) => setText(tempText)}
              />
              <Button mode="contained" onPress={() => { checkAnswer(challenge.goodAnswer); }}>Ok</Button>
            </View>
          </>
        )}
        {
          challenge.type === 'multipleChoice' && (
            <View style={styles.title}>
              {challenge.title !== undefined && (
                <Text variant="headlineMedium" style={{ fontWeight: '600', marginBottom: 15 }}>
                  {' '}
                  {challenge.title}
                </Text>
              )}
              {challenge.imageURL !== undefined && (
                <Text variant="bodyMedium" style={{ fontWeight: '600', marginBottom: 15 }}>
                  {' '}
                  {challenge.imageURL}
                </Text>
              )}
            </View>
          )
        }
        {challenge.type === 'photo' && (
          <View style={styles.container}>
            <Text>{challenge.title}</Text>
          </View>
        )}
        <Dialog visible={visible}>
          {goodAnswerUser && (
            <>
              <Dialog.Title>Bravo !</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Bonne réponse !</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => { navigation.navigate('Map'); }}>Ok</Button>
              </Dialog.Actions>
            </>
          )}
          {!goodAnswerUser && (
            <>
              <Dialog.Title>Attention !</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Mauvaise réponse !</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => { setVisible(false); }}>Ok</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Pas de challenge</Text>
    </View>
  );
}

ChallengeView.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      activity: PropTypes.arrayOf(PropTypes.shape({
        challenge: PropTypes.shape({
          title: PropTypes.string,
          imageURL: PropTypes.string,
          type: PropTypes.string,
          goodAnswer: PropTypes.string,
        }),
      })),
    }),
  }).isRequired,
};

export default ChallengeView;
