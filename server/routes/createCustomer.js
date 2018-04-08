const Customer = require('../models').Customer;
const { saltHashPassword } = require('../services/crypto');

module.exports = app => {
  app.post('/api/createCustomer', (req, res) => {
    return Customer.find({
      where: {
        username: req.body.username,
      },
    })
      .then(user => {
        if (user === null) {
          const { salt, passwordHash } = saltHashPassword(req.body.password);
          return Customer.create({
            username: req.body.username,
            salt: salt,
            password: passwordHash,
          });
        } else {
          return Promise.reject(Error('User already exists'));
        }
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  });
};
