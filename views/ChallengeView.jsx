/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {
  StyleSheet, View, Text, Image, ScrollView,
} from 'react-native';
import React from 'react';
import {
  Button, Dialog, TextInput, Checkbox,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { addAnswer, updateUserVisitedMarker, setResponsePicture } from '../services/firebaseQueries';
import { auth } from '../services/firebaseConfig';
import ODDContent from './helpers/ODDContent';

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

function ChallengeView(props) {
  const navigation = useNavigation();
  const { route } = props;
  const { activity } = route.params;
  const { MarkerId } = activity[0];
  const { activityAnswered } = activity[0];
  const { challenge } = activity[0];
  const answerTab = [];
  const [visible, setVisible] = React.useState(false);
  const [visibleODD, setVisibleODD] = React.useState(false);
  const [visibleImage, setVisibleImage] = React.useState(false);
  const [text, setText] = React.useState('');
  const [goodAnswerUser, setGoodAnswerUser] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [ArrayODD, setArrayODD] = React.useState([]);
  const [challengeAnswer, setChallengeAnswer] = React.useState(null);
  const user = auth.currentUser;
  function pickImage() {
    // take a picture
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((result) => {
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setVisibleImage(true);
      }
    });
  }

  function choosedOOD(arrayODD) {
    updateUserVisitedMarker(user, MarkerId, challengeAnswer, activityAnswered, arrayODD);
    navigation.navigate('Map');
  }

  function checkAnswer(goodAnswer) {
    if (text.toUpperCase() === goodAnswer.toUpperCase()) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
    } else {
      setGoodAnswerUser(false);
      addAnswer(user, false);
    }
    setChallengeAnswer(text);
    setVisible(true);
  }

  function checkMultipleChoiceAnswer(answer, goodAnswer) {
    if (answer === goodAnswer) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
      updateUserVisitedMarker(user, MarkerId);
    } else {
      setGoodAnswerUser(false);
      addAnswer(user, false);
    }
    setChallengeAnswer(answer);
    setVisible(true);
  }

  function checkPictureAnswer(goodAnswer, imageURL) {
    if (goodAnswer === true) {
      setGoodAnswerUser(true);
      addAnswer(user, true);
      updateUserVisitedMarker(user, MarkerId);
    } else {
      setGoodAnswerUser(false);
      addAnswer(user, false);
    }
    const urlFireBase = setResponsePicture(user, MarkerId, imageURL);
    setChallengeAnswer(urlFireBase);
    setVisibleImage(false);
    setVisibleODD(true);
  }

  function showODD() {
    setVisible(false);
    setVisibleODD(true);
  }

  function CheckboxODD(OddId) {
    if (!ArrayODD.includes(OddId)) {
      setArrayODD((elem) => [...elem, OddId]);
    } else {
      setArrayODD(ArrayODD.filter((elem) => elem !== OddId));
    }
  }

  if (challenge) {
    if (challenge.type === 'multipleChoice') {
      answerTab.push(challenge.goodAnswer);
      challenge.badAnswers.forEach((element) => {
        answerTab.push(element);
      });
      answerTab.sort(() => Math.random() - 0.5);
    }
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
                <Image
                  source={{ uri: challenge.imageURL }}
                  style={{ width: 200, height: 200 }}
                />
              )}
              {answerTab.map((answer) => (
                <Button
                  key={answer}
                  mode="contained"
                  onPress={() => { checkMultipleChoiceAnswer(answer, challenge.goodAnswer); }}
                >
                  {answer}
                </Button>
              ))}
            </View>
          )
        }
        {challenge.type === 'photo' && (
          <View style={styles.container}>
            <Text>{challenge.title}</Text>
            <Button mode="contained" icon="camera" onPress={() => { pickImage(); }}>Prendre une photo</Button>
          </View>
        )}
        <Dialog visible={visibleImage}>
          <Dialog.Title>Vérification</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">La photo correspond t-elle a la bonne réponse ? </Text>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Text>{' '}</Text>
            {challenge.goodAnswer && <Image source={{ uri: challenge.goodAnswerUrl }} style={{ width: 200, height: 200 }} />}
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={() => { checkPictureAnswer(true, image); }}>Oui</Button>
            <Button mode="contained" onPress={() => { checkPictureAnswer(false, image); }}>Non</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={visible}>
          {goodAnswerUser && (
            <>
              <Dialog.Title>Bravo !</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Bonne réponse !</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => { showODD(); }}>Ok</Button>
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
                <Button mode="contained" onPress={() => { showODD(); }}>Ok</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
        <Dialog visible={visibleODD}>
          <Dialog.Title>Choix ODD</Dialog.Title>
          <ScrollView>
            <Dialog.Content>
              <Text variant="bodyMedium">A quel ODD ce POI correspond t il ? </Text>
              <Text>{' '}</Text>
              {Object.keys(ODDContent).map((key) => (
                <View>
                  <Text>{ODDContent[key].title}</Text>
                  <Checkbox
                    key={key.slice(3)}
                    value={key.slice(3)}
                    status={ArrayODD.includes(key.slice(3)) ? 'checked' : 'unchecked'}
                    onPress={() => { CheckboxODD(key.slice(3)); }}
                  />
                </View>
              ))}
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={() => { choosedOOD(ArrayODD); }}>Envoyer</Button>
            </Dialog.Actions>
          </ScrollView>
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
          badAnswers: PropTypes.arrayOf(PropTypes.string),
          goodAnswerUrl: PropTypes.string,
        }),
        MarkerId: PropTypes.string,
        activityAnswered: PropTypes.string,
      })),
    }),
  }).isRequired,
};

export default ChallengeView;
