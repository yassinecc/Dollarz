const Customer = require('../models').Customer;

module.exports = app => {
  app.post('/api/createCustomer', (req, res) => {
    return Customer
      .create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  })
};
