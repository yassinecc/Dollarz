// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, View } from 'react-native';
import { offerMap } from '../services/offerMap';

@inject(({ userStore }) => ({
  user: userStore.user,
  accessToken: userStore.accessToken,
}))
@observer
class History extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    alignSelf: 'center',
    height: 40,
    width: 150,
    padding: 2,
    borderColor: 'rgb(100, 100, 100)',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  creditCardContainer: {
    flexDirection: 'row',
  },
});

export default History;
