import React from 'react';
import {
  StyleSheet, View, Image, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Text, Button } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 5,
  },
});

export default function DescriptionView({ route }) {
  const navigation = useNavigation();
  const { itemid, description, image } = route.params;

  function handleSubmit() {
    navigation.navigate('Activites', { itemid, description });
  }

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text variant="headlineLarge">Activité - Description</Text>
        <Image
          style={styles.image}
          source={{ uri: image }}
        />
        <View style={{ margin: 10, alignItems: 'center' }}>
          <Text style={{ textAlign: 'justify' }} variant="labelLarge">{description}</Text>
          <Button style={{ backgroundColor: '#4CB1FF', width: 200, margin: 5 }} mode="contained" onPress={() => handleSubmit()}>
            Lancer l&apos;activité
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
DescriptionView.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemid: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
