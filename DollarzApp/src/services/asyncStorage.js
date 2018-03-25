import { AsyncStorage } from 'react-native';
import { values } from 'lodash';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const USER_OBJECT = 'USER_OBJECT';
const USER_ID = 'USER_ID';

export const asyncStorageKeys = {
  ACCESS_TOKEN,
  USER_OBJECT,
  USER_ID,
};

export const getItemFromAsyncStorage = itemName =>
  AsyncStorage.getItem(itemName).then(item => JSON.parse(item));

export const clearAsyncStorage = () => AsyncStorage.multiRemove(values(asyncStorageKeys));

export const clearAsyncStorageKeys = keys => AsyncStorage.multiRemove(keys);
