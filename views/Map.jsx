/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as React from 'react';
import {
  Platform, View, Image, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import {
  Button, Dialog, Portal, Text,
} from 'react-native-paper';
import MapView, {
  Marker, PROVIDER_GOOGLE, Callout, CalloutSubview,
} from 'react-native-maps';
import { useAuthState } from 'react-firebase-hooks/auth';
import PropTypes from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { auth } from '../services/firebaseConfig';
import { getAllPOI, getVisitedPOI } from '../services/firebaseQueries';
import CloseMarker from '../services/CloseMarker';
import * as timerSession from '../services/timerSession';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: 38,
    height: 38,
  },
  imageDisabled: {
    width: 38,
    height: 38,
    opacity: 0.5,
  },
  popover: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  imageOnPopover: {
    width: 120,
    height: 90,
    marginBottom: 5,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    marginLeft: 10,
  },
  phoneText: {
    textAlign: 'center',
    alignItems: 'center',
    color: 'blue',
  },
});

// add props to Map function
function Map({
  navigation, startDate, endDate, hours, minutes, seconds, clearTimer,
}) {
  const [user] = useAuthState(auth);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poiList, setPOIList] = useState(null);
  const [visitedPOI, setVisitedPOI] = useState(null);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const isAndroid = Platform.OS === 'android';
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLoading(true);
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      const tempLoc = await Location.getCurrentPositionAsync({});
      setLocation(tempLoc);
      const tempPOI = await getAllPOI();
      setPOIList(tempPOI);
      const tempVisited = await getVisitedPOI(user);
      setVisitedPOI(tempVisited);
      // clearTimer();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const tempVisited = await getVisitedPOI(user);
      setVisitedPOI(tempVisited);
      /*
      if (poiList) {
        if (tempVisited.length === poiList.length) {
          clearTimer();
          await timerSession.stopTimer(user);
        }
      }
      */
    })();
  }, [isFocused, poiList]);

  function handleActivity(marker) {
    // eslint-disable-next-line no-unused-vars
    const close = CloseMarker(location.coords, marker);
    const { id, imageURL } = marker;
    /*
    if (close !== null && visitedPOI.includes(id)) {
      navigation.navigate('Activites', { itemid: id });
    } */
    navigation.navigate('Description', { itemid: id, description: marker.description, image: imageURL });
  }

  if (location !== null) {
    // show road names
    const mapStyle = [
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
    ];
    return (
      !loading ? (
        <View>
          <MapView
            style={styles.map}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsMyLocationButton
            showsUserLocation
            showsCompass
            showsScale
          >
            {
              poiList && (
                poiList.map((elem) => (
                  <Marker
                    key={elem.id}
                    coordinate={{
                      latitude: elem.coordinates.latitude,
                      longitude: elem.coordinates.longitude,
                    }}
                    title={elem.name}
                    style={visitedPOI.includes(elem.id) ? styles.imageDisabled : styles.image}
                  >
                    {!isAndroid && (
                      <Callout tooltip>
                        <View style={styles.popover}>
                          <>
                            {elem.imageURL !== undefined && (
                              <Image
                                source={{ uri: elem.imageURL }}
                                style={styles.imageOnPopover}
                              />
                            )}
                            <Text style={{ textAlign: 'center' }}>
                              {elem.name}
                            </Text>
                            <CalloutSubview
                              style={styles.phoneContainer}
                              onPress={() => {
                                handleActivity(elem);
                              }}
                            >
                              <Text style={styles.phoneText}>Voir les activités</Text>
                            </CalloutSubview>
                          </>
                        </View>
                      </Callout>
                    )}
                    {isAndroid && (
                      <Callout tooltip onPress={() => { handleActivity(elem); }}>
                        <View style={styles.popover}>
                          {elem.imageURL !== undefined && (
                            <WebView
                              source={{ uri: elem.imageURL }}
                              style={styles.imageOnPopover}
                            />
                          )}
                          <Text style={{ textAlign: 'center' }}>
                            {elem.name}
                          </Text>
                        </View>
                      </Callout>
                    )}
                  </Marker>
                ))
              )
            }
          </MapView>
          {endDate === undefined && startDate !== undefined && (
            <TouchableOpacity style={styles.overlay} onPress={() => showDialog()}>
              <Text style={styles.text}>{`${hours !== 0 ? `${hours}h ` : ''}${minutes !== 0 ? `${minutes}min` : ''} ${seconds !== 0 ? `${seconds}s` : ''}`}</Text>
            </TouchableOpacity>
          )}
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>ODDyssée - Confirmation</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Souhaitez-vous arrêter la session ?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={async () => { hideDialog(); clearTimer(); await timerSession.stopTimer(user); navigation.navigate('Trophees'); }}>Oui</Button>
                <Button onPress={hideDialog}>Non</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

      ) : (
        <View style={styles.container}>
          <Text style={{ marginBottom: 10 }}>Chargement des données... </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    );
  }
}
Map.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
  startDate: PropTypes.number,
  endDate: PropTypes.number,
  hours: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  clearTimer: PropTypes.func.isRequired,
};
Map.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};

export default Map;
