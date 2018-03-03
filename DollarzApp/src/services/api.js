export const doPayment = stripeTokenId => {
  return fetch('http://localhost:5000/api/doPayment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first: stripeTokenId,
      second: 'coucou',
    }),
  }).then(res => {
    if (res.status === 200) {
      return res;
    } else {
      return Promise.reject(Error('error', { res }));
    }
  });
};
