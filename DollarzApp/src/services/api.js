export const doPayment = stripeTokenId => {
  return fetch('http://localhost:5000/api/test', {
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
      console.log('coucou', res);
      return 'ok';
    } else {
      console.log('error');
      return Promise.reject(Error('error'));
    }
  });
};
