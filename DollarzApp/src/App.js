// @flow

import React, { Component } from 'react';
import TabScreen from './pages/TabScreen';

type Props = {};

type State = {
  token: { livemode: boolean, created: number, card: Object, tokenId: string },
};

export default class App extends Component<Props, State> {
  render() {
    return <TabScreen />;
  }
}
