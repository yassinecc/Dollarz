const Customer = require('../models').Customer;
const { saltHashPassword } = require('../services/crypto')



module.exports = app => {
  app.post('/api/createCustomer', (req, res) => {
    const { salt, hashedPassword } = saltHashPassword(req.body.password)
    return Customer
      .create({
        username: req.body.username,
        salt: salt,
        password: hashedPassword
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  })
}
