// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import stripe from 'tipsi-stripe';
import { doPayment } from 'DollarzApp/src/services/api';

stripe.init({
  publishableKey: 'pk_test_NXzesZUopyI0RM7xO4HoIEg3',
});

export default class Order extends Component {
  constructor() {
    super();
    this.state = {
      paymentPending: false,
      paymentSucceeded: false,
    };
  }

  requestPayment = () => {
    stripe
      .paymentRequestWithCardForm()
      .then(stripeResponse => {
        this.setState({ paymentPending: true });
        return doPayment(stripeResponse.tokenId);
      })
      .then(response => {
        this.setState({ paymentPending: false, paymentSucceeded: true });
      })
      .catch(console.log);
  };

  render() {
    console.log(this.state.token);
    return (
      <View style={styles.container}>
        <Button title={'Entrer carte'} style={styles.payment} onPress={this.requestPayment} />
        {this.state.paymentPending && (
          <View>
            <Text>Paiement en cours</Text>
            <ActivityIndicator />
          </View>
        )}
        {this.state.paymentSucceeded && (
          <View>
            <Text>Paiement réussi!</Text>
            <Icon name="ios-checkmark-circle" size={30} color={'rgb(130,219,9)'} />
          </View>
        )}
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
