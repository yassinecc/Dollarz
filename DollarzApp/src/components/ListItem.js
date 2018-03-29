import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

class ListItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onOrderPress(this.props.order)}>
        <Text>{this.props.order.description}</Text>
        {this.props.isSelected &&
          (this.props.order.refunded ? (
            <Text>Commande remboursée</Text>
          ) : (
            <TouchableOpacity onPress={this.props.onRefundPress}>
              <Text>Demander remboursement</Text>
            </TouchableOpacity>
          ))}
      </TouchableOpacity>
    );
  }
}

export default ListItem;
