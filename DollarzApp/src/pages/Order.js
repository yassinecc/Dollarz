// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import stripe from 'tipsi-stripe';
import { doPayment } from 'DollarzApp/src/services/api';

stripe.init({
  publishableKey: 'pk_test_NXzesZUopyI0RM7xO4HoIEg3',
});

export default class Order extends Component {
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
});
