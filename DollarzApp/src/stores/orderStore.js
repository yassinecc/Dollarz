import { AsyncStorage } from 'react-native';
import { asyncStorageKeys, clearAsyncStorage } from '../services/asyncStorage';
import { observable, action } from 'mobx';
import { fetchStripeOrders, refundStripeOrder } from 'DollarzApp/src/services/api';

class OrderStore {
  @observable orders = [];

  @action
  getStripeOrders = token =>
    fetchStripeOrders(token)
      .then(result => {
        this.orders.replace(result);
        return result;
      })
      .catch(Promise.reject);

  @action
  refundOrder = (token, chargeId) => {
    refundStripeOrder(token, chargeId).then(console.log);
  };
}

const singleton = new OrderStore();

export default singleton;
