/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as React from 'react';
import {
  View, Text, Image, StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { getAllPOI } from '../services/firebaseQueries';

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
    height: 80,
  },
});

function Map() {
  const [location, setLocation] = useState(null);
  const [poiList, setPOIList] = useState(null);
  const pauvrete = require('../assets/1.png');
  const faim = require('../assets/2.png');
  const sante = require('../assets/3.png');
  const education = require('../assets/4.png');
  const egalite = require('../assets/5.png');
  const eau = require('../assets/6.png');
  const energie = require('../assets/7.png');
  const travail = require('../assets/8.png');
  const industrie = require('../assets/9.png');
  const inegalite = require('../assets/10.png');
  const durable = require('../assets/11.png');
  const responsable = require('../assets/12.png');
  const climatique = require('../assets/13.png');
  const ocean = require('../assets/14.png');
  const terrestre = require('../assets/15.png');
  const paix = require('../assets/16.png');
  const partenariats = require('../assets/17.png');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      const tempLoc = await Location.getCurrentPositionAsync({});
      setLocation(tempLoc);
      const tempPOI = await getAllPOI();
      setPOIList(tempPOI);
    })();
  }, []);

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
      <View style={styles.container}>
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
                  key={elem.name}
                  coordinate={{
                    latitude: elem.coordinates.latitude,
                    longitude: elem.coordinates.longitude,
                  }}
                  title={elem.name}
                  description={elem.description}
                >
                  <Callout tooltip>
                    <View style={styles.popover}>
                      <Image style={styles.imageOnPopover} source={require('../assets/test.webp')} />
                      <Text>
                        {elem.name}
                      </Text>
                      <Text>
                        {elem.description}
                      </Text>
                    </View>
                  </Callout>
                  <Image
                    source={elem.linkedODD[0] === 1 ? pauvrete
                      : elem.linkedODD[0] === 2 ? faim
                        : elem.linkedODD[0] === 3 ? sante
                          : elem.linkedODD[0] === 4 ? education
                            : elem.linkedODD[0] === 5 ? egalite
                              : elem.linkedODD[0] === 6 ? eau
                                : elem.linkedODD[0] === 7 ? energie
                                  : elem.linkedODD[0] === 8 ? travail
                                    : elem.linkedODD[0] === 8 ? industrie
                                      : elem.linkedODD[0] === 9 ? industrie
                                        : elem.linkedODD[0] === 10 ? inegalite
                                          : elem.linkedODD[0] === 11 ? durable
                                            : elem.linkedODD[0] === 12 ? responsable
                                              : elem.linkedODD[0] === 13 ? climatique
                                                : elem.linkedODD[0] === 14 ? ocean
                                                  : elem.linkedODD[0] === 15 ? terrestre
                                                    : elem.linkedODD[0] === 16 ? paix
                                                      : partenariats}
                    style={styles.image}
                  />
                </Marker>
              ))
            )
          }
        </MapView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Chargement de la carte...</Text>
    </View>
  );
}

export default Map;
