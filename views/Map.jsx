import * as React from 'react';
import { View ,Text} from 'react-native';
import { styles } from '../App';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

function Map() {
  
  const [location, setLocation] = useState(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

 if(location){
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.323,
          longitude: -0.46,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
      else{
        return (
          <View style={styles.container}>
            <Text>Chargement de la map...</Text>
          </View>
        );
      }
}

export default Map;