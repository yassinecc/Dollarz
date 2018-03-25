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
import CreditCard from '../components/CreditCard';
import { offerMap } from '../services/offerMap';

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
      cardChoice: null,
      isFetchingStripeSources: false,
      selectedOffer: undefined,
    };
  }

  componentWillMount() {
    this.setState({ isFetchingStripeSources: true });
    return this.props.getCustomerStripeSources(this.props.accessToken).then(() => {
      this.setState({ isFetchingStripeSources: false });
    });
  }

  onCreditCardChoice = stripeCardInfo => {
    if (stripeCardInfo.card.brand === 'Visa' || stripeCardInfo.card.brand === 'MasterCard') {
      this.setState({ cardChoice: { stripeInfo: stripeCardInfo } });
    } else this.props.showToaster('cardTypeError');
  };

  addNewCard = () => {
    stripe.paymentRequestWithCardForm().then(stripeResponse => {
      this.setState({
        cardChoice: { stripeInfo: { card: { cardId: '' }, tokenId: stripeResponse.tokenId } },
      });
    });
  };

  requestPayment = () => {
    return doPayment(
      this.state.cardChoice.stripeInfo,
      Number(this.state.selectedOffer.price),
      this.props.accessToken
    )
      .then(response => {
        this.setState({ paymentPending: false, paymentSucceeded: true });
      })
      .catch(console.log);
  };

  toggleOffer = offer => {
    this.state.selectedOffer && this.state.selectedOffer.id === offer.id
      ? this.setState({ selectedOffer: undefined })
      : this.setState({ selectedOffer: offer });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.props.accessToken ? (
          <View>
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
            <Button title={'Nouvelle carte'} style={styles.payment} onPress={this.addNewCard} />
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
            {this.state.selectedOffer && (
              <Button
                title={`Payer ${this.state.selectedOffer.price} €`}
                style={styles.payment}
                onPress={this.requestPayment}
              />
            )}
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
});

export default Order;
