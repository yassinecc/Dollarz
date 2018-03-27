// @flow

import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';
import { userStore, orderStore } from 'DollarzApp/src/stores';
import TabScreen from './pages/TabScreen';

type Props = {};

type State = {
  token: { livemode: boolean, created: number, card: Object, tokenId: string },
};

export default class App extends Component<Props, State> {
  render() {
    return (
      <Provider userStore={userStore} orderStore={orderStore}>
        <TabScreen />
      </Provider>
    );
  }
}
