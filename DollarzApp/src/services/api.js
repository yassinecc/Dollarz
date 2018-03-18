import axios from 'axios'

export const doPayment = (stripeTokenId, amount) => {
  return fetch('http://localhost:5000/api/doPayment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenId: stripeTokenId,
      amount: amount,
    }),
  })
  .then(res => {
    if (res.status === 200) {
      return res;
    } else {
      return Promise.reject(Error('error', { res }));
    }
  });
};

export const createUser = (username, password) => {
  const body = {
    username,
    password,
  }

  const headers = {
    'Content-Type': 'application/json',      
  }

  return axios.post('http://localhost:5000/api/createUser', body , { headers })
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      return Promise.reject(Error('error', { res }));
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
      console.log('login ok')
      return data;
    })
    .catch(error => {
      return Promise.reject(Error('error', { res }));
    });
}
