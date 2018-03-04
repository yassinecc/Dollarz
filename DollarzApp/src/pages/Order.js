// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator, TextInput } from 'react-native';
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
      text: '',
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
        <TextInput
          keyBoardType={'numeric'}
          style={styles.textInput}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
        />
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
  textInput: {
    height: 40,
    width: 150,
    padding: 2,
    borderColor: 'rgb(100, 100, 100)',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    textAlign: 'center',
  },
});
