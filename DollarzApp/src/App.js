/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import stripe from 'tipsi-stripe';
import { doPayment } from 'DollarzApp/src/services/api';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

stripe.init({
  publishableKey: 'pk_test_NXzesZUopyI0RM7xO4HoIEg3',
});

type Props = {};

type State = {
  token: { livemode: boolean, created: number, card: Object, tokenId: string },
};

export default class App extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      token: { tokenId: '' },
    };
  }

  requestPayment = () => {
    stripe
      .paymentRequestWithCardForm()
      .then(stripeResponse => {
        this.setState({ token: stripeResponse });
        return doPayment(stripeResponse.tokenId);
      })
      .then(console.log)
      .catch(console.log);
  };

  render() {
    console.log(this.state.token);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Button title={'Entrer carte'} style={styles.payment} onPress={this.requestPayment} />
        <Text>{this.state.token.tokenId}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  payment: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
});
