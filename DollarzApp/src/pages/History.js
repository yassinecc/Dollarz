// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ListItem } from '../components';

@inject(({ userStore, orderStore }) => ({
  accessToken: userStore.accessToken,
  getStripeOrders: accessToken => orderStore.getStripeOrders(accessToken),
  orders: orderStore.orders.slice(),
  refundOrder: (token, id) => orderStore.refundOrder(token, id),
}))
@observer
class History extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      selectedOrderId: undefined,
    };
  }

  componentWillMount() {
    return this.props.getStripeOrders(this.props.accessToken).then(
      this.setState({
        isReady: true,
      })
    );
  }

  onOrderPress = order => {
    this.setState({ selectedOrderId: order.id });
  };

  doRefund = () => {
    return this.props.refundOrder(this.props.accessToken, this.state.selectedOrderId);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.orders.map(order => (
          <ListItem
            key={order.id}
            order={order}
            isSelected={this.state.selectedOrderId === order.id}
            onOrderPress={this.onOrderPress}
            onRefundPress={this.doRefund}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 16,
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
