// @flow

import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { formatExpiryMonth, formatExpiryYear } from 'DollarzApp/src/services/dateFormatter';
import visa from 'DollarzApp/src/images/visa.png';
import mastercard from 'DollarzApp/src/images/mastercard.png';
import amex from 'DollarzApp/src/images/amex.png';

const styles = {
  text: {
    color: 'rgb(51,51,51)',
  },
  cardNumber: {
    color: 'rgb(51,51,51)',
    fontSize: 17,
    marginBottom: 8,
  },
  creditCardButton: {
    backgroundColor: 'white',
    borderColor: 'rgb(140, 140, 140)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 24,
    marginLeft: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: 'rgb(18,132,255)',
  },
  expirationDate: {
    color: 'rgb(51,51,51)',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 40,
  },
};

const selectCreditCardLogo = (brand: string) => {
  switch (brand) {
    case 'Visa':
      return visa;
    case 'American Express':
      return amex;
    case 'MasterCard':
      return mastercard;
    default:
      return visa;
  }
};

const CreditCard = (props: PropsType) => {
  const expiryMonth = formatExpiryMonth(props.selectedCreditCard.expMonth);
  const expiryYear = formatExpiryYear(props.selectedCreditCard.expYear);
  return (
    <TouchableOpacity
      style={
        props.isSelected ? [styles.creditCardButton, styles.selectedCard] : styles.creditCardButton
      }
      onPress={props.onCreditCardChoice}
      onLayout={props.onLayout}
    >
      <View style={styles.flexRowContainer}>
        <Image
          source={selectCreditCardLogo(props.selectedCreditCard.brand)}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.cardNumber}>**** **** **** {props.selectedCreditCard.last4}</Text>
      <Text style={styles.expirationDate}>
        expire à fin {expiryMonth}/{expiryYear}
      </Text>
    </TouchableOpacity>
  );
};

type PropsType = {
  onLayout: any => void,
  isSelected: boolean,
  selectedCreditCard: CardInfoType,
  onCreditCardChoice: StripeCardResponseType => void,
};

export default CreditCard;
