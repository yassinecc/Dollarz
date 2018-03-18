// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

@inject(({ userStore }) => ({
  user: userStore.user,
  accessToken: userStore.accessToken,
  login: (username, password) => userStore.login(username, password),
  signup: (username, password) => userStore.signup(username, password),
  logout: () => userStore.logout()
}))

@observer
class Infos extends Component<StateType> {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  login = () => {
    return this.props.login(this.state.username, this.state.password)
  }
  signup = () => {
    return this.props.signup(this.state.username, this.state.password)
  }

  render() {
    console.log(this.props.accessToken)
    return (
      <View style={styles.container}>
        <Text>Ceci est la page d'accueil</Text>
        <TextInput
          style={styles.textInput}
          value={this.state.firstName}
          onChangeText={text=>this.setState({username: text})
        }/>
        <TextInput
          secureTextEntry
          style={styles.textInput}
          value={this.state.lastName}
          onChangeText={text=>this.setState({password: text})
        }/>
        <Button title={"Nouvel utilisateur"} onPress={this.signup} />
        <Button title={"Login"} onPress={this.login} />
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

export default Infos;
