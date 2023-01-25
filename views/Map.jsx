import * as React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { styles } from '../App';

function Map() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }
      const tempLoc = await Location.getCurrentPositionAsync({});
      setLocation(tempLoc);
    })();
  }, []);

  if (location) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 46.323,
            longitude: -0.46,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsMyLocationButton
          showsUserLocation
          showsCompass
          showsScale
        >

          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="VOTRE POSITION INITALE"
            description="Description de votre position initiale"
          />

        </MapView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.04,
        }}
        
        showsMyLocationButton = {true}
        showsUserLocation = {true}
        showsCompass = {true}
        showsScale = {true}
      >

        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}	
          title="VOTRE POSITION INITALE"
          description="Description de votre position initiale"
        />
        
      </MapView>
    </View>
  );
}

export default Map;
