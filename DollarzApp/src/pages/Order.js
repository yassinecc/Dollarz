// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
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
import CheckBox from 'react-native-check-box';
import { doPayment } from 'DollarzApp/src/services/api';
import { CreditCard } from '../components';
import { offerMap } from '../services/offerMap';

stripe.setOptions({
  publishableKey: 'pk_test_NXzesZUopyI0RM7xO4HoIEg3',
  merchantId: 'MERCHANT_ID',
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
      isPaymentPending: false,
      paymentSucceeded: false,
      cardChoice: null,
      isFetchingStripeSources: false,
      selectedOffer: undefined,
      shouldDisplayPaymentError: false,
    };
  }

  async componentWillMount() {
    this.setState({ isFetchingStripeSources: true });
    try {
      await this.props.getCustomerStripeSources(this.props.accessToken);
    } catch (error) {
      console.warn(error);
    }
    this.setState({ isFetchingStripeSources: false });
  }

  onCreditCardChoice = stripeCardInfo =>
    this.setState({ cardChoice: { stripeInfo: stripeCardInfo } });

  addNewCard = async () => {
    try {
      const stripeResponse = await stripe.paymentRequestWithCardForm();
      this.setState({
        cardChoice: { stripeInfo: { card: { cardId: '' }, tokenId: stripeResponse.tokenId } },
      });
    } catch (error) {
      console.log('Error requesting card payment', { error });
    }
  };

  payWithApplePay = async () => {
    try {
      const items = [
        {
          label: 'Tapis',
          amount: `${this.state.selectedOffer.price}`,
        },
        {
          label: 'Yassinec',
          amount: `${this.state.selectedOffer.price}`,
        },
      ];
      await stripe.deviceSupportsApplePay();
      await stripe.canMakeApplePayPayments();
      const stripeResponse = await stripe.paymentRequestWithApplePay(items);
      await doPayment(
        this.state.selectedOffer,
        { card: { cardId: '' }, tokenId: stripeResponse.tokenId },
        this.props.accessToken
      );
      stripe.completeApplePayRequest();
      this.setState({ paymentSucceeded: true });
    } catch (error) {
      console.log('Apple pay error', { error });
      this.setState({ shouldDisplayPaymentError: true, paymentSucceeded: false });
      stripe.cancelApplePayRequest();
    }
    this.setState({ isPaymentPending: false });
  };

  requestPayment = async () => {
    this.setState({ isPaymentPending: true });
    try {
      await doPayment(
        this.state.selectedOffer,
        this.state.cardChoice.stripeInfo,
        this.props.accessToken
      );
      this.setState({ paymentSucceeded: true });
    } catch (error) {
      this.setState({ shouldDisplayPaymentError: true, paymentSucceeded: false });
    }
    this.setState({ isPaymentPending: false });
  };

  toggleOffer = offer => {
    this.state.selectedOffer && this.state.selectedOffer.id === offer.id
      ? this.setState({ selectedOffer: undefined })
      : this.setState({ selectedOffer: offer });
  };

  renderPaymentError = () => {
    return <Text style={{ alignSelf: 'center' }}>Votre paiement n'a pas pu être traité</Text>;
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.props.accessToken ? (
          <View>
            <View style={styles.offers}>
              {offerMap.map(offer => (
                <CheckBox
                  key={offer.id}
                  leftText={offer.name}
                  rightText={`${offer.price.toString()} €`}
                  rightTextStyle={{ flex: 0, width: 40 }}
                  onClick={() => this.toggleOffer(offer)}
                  isChecked={this.state.selectedOffer && this.state.selectedOffer.id === offer.id}
                />
              ))}
            </View>
            <Button title={'Nouvelle carte'} onPress={this.addNewCard} />
            {this.state.isFetchingStripeSources ? (
              <ActivityIndicator />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                contentContainerStyle={styles.creditCardContainer}
              >
                {this.props.customerStripeSources.map(card => (
                  <View style={styles.creditCardContainer} key={card.cardId}>
                    <CreditCard
                      selectedCreditCard={card}
                      isSelected={
                        !!this.state.cardChoice &&
                        this.state.cardChoice.stripeInfo.card.cardId === card.cardId
                      }
                      onCreditCardChoice={() => this.onCreditCardChoice({ card, tokenId: '' })}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            {!this.state.isPaymentPending &&
              this.state.selectedOffer && (
                <View>
                  <Button
                    title={`Payer ${this.state.selectedOffer.price} €`}
                    onPress={this.requestPayment}
                    disabled={!this.state.cardChoice}
                  />
                  <Button title={' Pay'} onPress={this.payWithApplePay} />
                </View>
              )}
            {this.state.isPaymentPending && (
              <View style={{ alignSelf: 'center' }}>
                <Text>Paiement en cours</Text>
                <ActivityIndicator />
              </View>
            )}
            {!this.state.isPaymentPending &&
              this.state.paymentSucceeded && (
                <View style={{ alignItems: 'center' }}>
                  <Text>Paiement réussi!</Text>
                  <Icon name="ios-checkmark-circle" size={30} color={'rgb(130,219,9)'} />
                </View>
              )}
            {this.state.shouldDisplayPaymentError && this.renderPaymentError()}
          </View>
        ) : (
          <Text>Vous devez être connecté pour voir cette page</Text>
        )}
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
    flexDirection: 'row',
  },
  offers: {
    marginHorizontal: 16,
  },
});

export default Order;
