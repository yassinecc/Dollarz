import { AsyncStorage } from 'react-native';
import { asyncStorageKeys, clearAsyncStorage } from '../services/asyncStorage';
import { observable, action } from 'mobx';
import { createUser, login, fetchCustomerStripeSources } from 'DollarzApp/src/services/api';

class UserStore {
  constructor() {
    const rehydrateToken = AsyncStorage.getItem(asyncStorageKeys.ACCESS_TOKEN).then(accessToken => {
      if (accessToken) this.accessToken = accessToken;
    });
    const rehydrateUser = AsyncStorage.getItem(asyncStorageKeys.USER_OBJECT).then(user => {
      if (user) this.user = JSON.parse(user);
    });
    Promise.all([rehydrateUser, rehydrateToken]).finally(() => {
      this.isStoreHydrated = true;
    });
  }

  @observable
  isStoreHydrated = false;
  @observable
  accessToken = null;
  @observable
  user = null;
  @observable
  customerStripeSources = [];

  @action
  setCustomerStripeSources(customerStripeSources) {
    this.customerStripeSources.replace(customerStripeSources);
  }

  @action
  login(username, password) {
    return login(username, password)
      .then(data => {
        this.accessToken = data.accessToken;
        this.user = username;
        AsyncStorage.setItem(asyncStorageKeys.ACCESS_TOKEN, data.accessToken);
        AsyncStorage.setItem(asyncStorageKeys.USER_OBJECT, JSON.stringify(data.user));
      })
      .catch(console.log);
  }

  @action
  signup(username, password) {
    return createUser(username, password)
      .then(() => {
        return Promise.resolve('Authentication suceeded');
      })
      .catch(console.log);
  }

  @action
  logout() {
    this.accessToken = null;
    this.user = null;
    return clearAsyncStorage();
  }

  getCustomerStripeSources = token =>
    fetchCustomerStripeSources(token)
      .then(customerStripeSources => {
        return customerStripeSources.map(source => {
          if (source.type === 'three_d_secure') return source.three_d_secure;
          else if (source.type === 'card') return source.card;
          else if (source.object === 'card') return source;
          else return;
        });
      })
      .then(customerStripeSources => {
        this.setCustomerStripeSources(
          customerStripeSources.map(sourceData => ({
            cardId: sourceData.id,
            last4: sourceData.last4,
            expMonth: sourceData.exp_month,
            expYear: sourceData.exp_year,
            brand: sourceData.brand,
          }))
        );
        return Promise.resolve();
      })
      .catch(Promise.reject);
}

const singleton = new UserStore();

export default singleton;
