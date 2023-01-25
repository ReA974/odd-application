import * as React from 'react';
import {
  Text, View, TextInput, Button, StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { app, auth } from '../config/firebaseConfig';
import { styles } from '../App';

function PhoneSignIn({ navigation }) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = true;

  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={attemptInvisibleVerification}
        />
        <Text style={{ marginTop: 20 }}>Entrer votre numéro</Text>
        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          placeholder="+33 6 12 34 56 78"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={setPhoneNumber}
        />
        <Button
          title="Envoyer le sms le vérification"
          disabled={!phoneNumber}
          onPress={async () => {
            try {
              const phoneProvider = new PhoneAuthProvider(auth);
              const tempVerificationid = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current,
              );
              setVerificationId(tempVerificationid);
              showMessage({
                text: 'Un sms de vérification à été envoyé sur votre téléphone.',
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }}
        />
        {verificationId ? (
          <>
            <Text style={{ marginTop: 20 }}>Entrez code reçu par sms</Text>
            <TextInput
              style={{ marginVertical: 10, fontSize: 17 }}
              editable={!!verificationId}
              placeholder="123456"
              onChangeText={setVerificationCode}
            />
            <Button
              title="Confirmez le code de vérification"
              disabled={!verificationId}
              onPress={async () => {
                try {
                  const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                  await signInWithCredential(auth, credential);
                  showMessage({ text: 'Vous etes connecté via votre téléphone 👍' });
                  navigation.navigate('Home');
                } catch (err) {
                  showMessage({ text: `Error: ${err.message}`, color: 'red' });
                }
              }}
            />
            {message ? (
              <TouchableOpacity
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 0xffffffee, justifyContent: 'center' },
                ]}
                onPress={() => showMessage(undefined)}
              >
                <Text
                  style={{
                    color: message.color || 'blue',
                    fontSize: 17,
                    textAlign: 'center',
                    margin: 20,
                  }}
                >
                  {message.text}
                </Text>
              </TouchableOpacity>
            ) : undefined}
          </>
        ) : undefined}
        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Button title="Déconnexion" onPress={() => auth.signOut()} />
    </View>
  );
}

PhoneSignIn.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
};

export default PhoneSignIn;
