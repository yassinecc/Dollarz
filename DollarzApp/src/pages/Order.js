// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native'
import {
  StyleSheet,
  View,
  ScrollView,
  Button,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import stripe from 'tipsi-stripe';
import { doPayment } from 'DollarzApp/src/services/api';
import CreditCard from '../components/CreditCard'

stripe.init({
  publishableKey: 'pk_test_NXzesZUopyI0RM7xO4HoIEg3',
});


@inject(({ userStore }) => ({
  user: userStore.user,
  customerStripeSources: userStore.customerStripeSources,
  getCustomerStripeSources: token => userStore.getCustomerStripeSources(token),
  accessToken: userStore.accessToken,
}))
@observer
class Order extends Component {
  constructor() {
    super();
    this.state = {
      paymentPending: false,
      paymentSucceeded: false,
      amountText: '',
      cardChoice: null,
    };
  }

  componentWillMount() {
    this.props.getCustomerStripeSources(this.props.accessToken)
  }

  onCreditCardChoice = (stripeCardInfo) => {
    if (stripeCardInfo.card.brand === 'Visa' || stripeCardInfo.card.brand === 'MasterCard') {
      this.setState({ cardChoice: { stripeInfo: stripeCardInfo } });
    } else this.props.showToaster('cardTypeError');
  };

  addNewCard = () => {
    stripe
    .paymentRequestWithCardForm()
    .then(stripeResponse => {
      this.setState({cardChoice: { stripeInfo: { card: {cardId: ''}, tokenId: stripeResponse.tokenId }}})
    })
  }

  requestPayment = () => {
    return doPayment(this.state.cardChoice.stripeInfo, Number(this.state.amountText), this.props.accessToken)
      .then(response => {
        this.setState({ paymentPending: false, paymentSucceeded: true });
      })
      .catch(console.log);
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
      {!this.props.accessToken && 
        <Text>Vous devez être connecté pour voir cette page</Text>
      }
      {this.props.accessToken && 
        <View>
          <TextInput
            keyboardType={'numeric'}
            style={styles.textInput}
            onChangeText={text => this.setState({ amountText: text })}
            value={this.state.amountText}
          />
          <Button title={'Nouvelle carte'} style={styles.payment} onPress={this.addNewCard} />
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.creditCardContainer}>
            {this.props.customerStripeSources.map(card => (
              <View style={styles.creditCardContainer} key={card.cardId}>
                <CreditCard
                  selectedCreditCard={card}
                  isSelected={!!this.state.cardChoice && (this.state.cardChoice.stripeInfo.card.cardId === card.cardId)}
                  onCreditCardChoice={() => this.onCreditCardChoice({ card, tokenId: '' })}
                />
              </View>
            ))}
          </ScrollView>
          <Button title={'Payer'} style={styles.payment} onPress={this.requestPayment} />
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
        }
      </ScrollView>
    );
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
    flexDirection: 'row'
  },
});

export default Order
