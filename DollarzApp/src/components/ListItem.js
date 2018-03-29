import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: 'rgb(200, 200, 200)',
  },
};

class ListItem extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.hasSeparator && styles.separator]}
        onPress={() => this.props.onOrderPress(this.props.order)}
      >
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
