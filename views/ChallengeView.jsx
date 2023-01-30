import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ChallengeView(props) {
  if (props) {
    const { route } = props;
    const { challenge } = route.params;
    if (challenge.type === 'field') {
      return (
        <View style={styles.container}>
          <Text>{challenge.title}</Text>
        </View>
      );
    }
    if (challenge.type === 'multipleChoice') {
      return (
        <View style={styles.container}>
          <Text>{challenge.title}</Text>
        </View>
      );
    }
    if (challenge.type === 'photo') {
      return (
        <View style={styles.container}>
          <Text>{challenge.title}</Text>
        </View>
      );
    }
  }
}

ChallengeView.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      challenge: PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default ChallengeView;
