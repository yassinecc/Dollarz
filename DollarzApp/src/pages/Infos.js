// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { createUser } from 'DollarzApp/src/services/api';

export default class Infos extends Component<StateType> {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: ''
    }
  }

  createUser = () => {
    return createUser(this.state.firstName, this.state.lastName)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Ceci est la page d'accueil</Text>
        <TextInput
          style={styles.textInput}
          value={this.state.firstName}
          onChangeText={text=>this.setState({firstName: text})
        }/>
        <TextInput
          style={styles.textInput}
          value={this.state.lastName}
          onChangeText={text=>this.setState({lastName: text})
        }/>
        <Button title={"Nouvel utilisateur"} onPress={this.createUser} />
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
  }
});
