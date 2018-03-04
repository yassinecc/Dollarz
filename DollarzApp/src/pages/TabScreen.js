import React, { Component } from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';
import * as Pages from 'DollarzApp/src/pages';

export default TabNavigator({
  Home: { screen: Pages.Infos },
  Order: { screen: Pages.Order },
});

const styles = {
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
