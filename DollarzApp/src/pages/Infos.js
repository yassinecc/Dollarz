// @flow

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet, View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { checkAuth } from 'DollarzApp/src/services/api';

@inject(({ userStore }) => ({
  user: userStore.user,
  accessToken: userStore.accessToken,
  isStoreHydrated: userStore.isStoreHydrated,
  login: (username, password) => userStore.login(username, password),
  signup: (username, password) => userStore.signup(username, password),
  logout: () => userStore.logout(),
}))
@observer
class Infos extends Component<StateType> {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAuthenticated: false,
    };
  }

  componentWillMount() {
    return checkAuth(this.props.accessToken)
      .then(() => {
        this.setState({ isAuthenticated: true });
      })
      .catch(() => {
        this.setState({ isAuthenticated: false });
      });
  }

  login = () => {
    return this.props
      .login(this.state.username, this.state.password)
      .then(() => this.setState({ isAuthenticated: true }));
  };
  signup = () => {
    return this.props.signup(this.state.username, this.state.password);
  };

  renderInfoPage = () => (
    <View>
      <Text>Ceci est la page d'accueil</Text>
      {this.state.isAuthenticated && this.props.accessToken && this.props.user ? (
        <View>
          <Text>Bienvenue {this.props.user.username} !</Text>
          <Button title="Déconnexion" onPress={this.props.logout} />
        </View>
      ) : (
        <View style={styles.secondaryContainer}>
          <Text>Veuillez vous connecter ou vous inscrire</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textInput}
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
          />
          <TextInput
            secureTextEntry
            style={styles.textInput}
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
          />
          <Button title={'Nouvel utilisateur'} onPress={this.signup} />
          <Button title={'Connexion'} onPress={this.login} />
        </View>
      )}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        {this.props.isStoreHydrated ? this.renderInfoPage() : <ActivityIndicator />}
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
  secondaryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default Infos;
