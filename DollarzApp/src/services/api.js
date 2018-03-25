import axios from 'axios'

export const fetchCustomerStripeSources = (accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token': accessToken,
  }

  return axios.get('http://localhost:5000/api/getCustomerCards', { headers })
    .then(({ data }) => {
      return data.customerCards
    })
    .catch(error => {
      console.log('Error in getting customer cards', error.response)   
      return Promise.reject(Error(error.response))   
    })
}

export const doPayment = (customerCard, amount, accessToken) => {
  const body = {
    tokenId: customerCard.tokenId,
    amount: amount,
    cardId: customerCard.card.cardId,
  }
  const headers = {
    'Content-Type': 'application/json',
    'x-access-token' : accessToken,
  }
  return axios.post('http://localhost:5000/api/doPayment', body, { headers })
    .then(({ data }) => {
      return data; 
    })
    .catch(error => {
      return Promise.reject(Error(error))
    })
};

export const createUser = (username, password) => {
  const body = {
    username,
    password,
  }

  const headers = {
    'Content-Type': 'application/json',      
  }

  return axios.post('http://localhost:5000/api/createCustomer', body , { headers })
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      return Promise.reject(Error('error', { error }));
    });
}

export const login = (username, password) => {
  const body = {
    username,
    password,
  }

  const headers = {
    'Content-Type': 'application/json',      
  }

  return axios.post('http://localhost:5000/api/login', body , { headers })
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      return Promise.reject(Error('error', { error }));
    });
}
