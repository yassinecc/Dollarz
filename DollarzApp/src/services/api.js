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
  return fetch('http://localhost:5000/api/createCustomer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  .then(res => {
    if (res.status === 200) {
      return res;
    } else {
      return Promise.reject(Error('error', { res }));
    }
  });
}

export const login = (username, password) => {
  return fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',      
    },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  .then(res => {
    if (res.status === 200) {
      console.log('login ok')
      return res;
    } else {
      return Promise.reject(Error('error', { res }));
    }
  });
}
