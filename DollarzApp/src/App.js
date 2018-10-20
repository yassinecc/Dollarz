// @flow

import React, { Component } from 'react';
import { Provider } from 'mobx-react/native';
import { Platform } from 'react-native';
import { userStore, orderStore } from 'DollarzApp/src/stores';
import TabScreen from './pages/TabScreen';

type Props = {};

type State = {
  token: { livemode: boolean, created: number, card: Object, tokenId: string },
};

const prefix = Platform.select({ ios: 'dollarz://', android: 'dollarz://dollarz/' });

export default class App extends Component<Props, State> {
  render() {
    return (
      <Provider userStore={userStore} orderStore={orderStore}>
        <TabScreen uriPrefix={prefix} />
      </Provider>
    );
  }
}
