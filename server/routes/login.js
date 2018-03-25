const Customer = require('../models').Customer;
const { sha512 } = require('../services/crypto')
const jwt = require('jsonwebtoken')

module.exports = app => {
  app.post('/api/login', (req, res) => {
    return Customer.find({
      where: {
        username: req.body.username
      }
    })
    .then(user => {
      if (user === null) {
        res.status(403)
        res.json('User not found')
      } else if (user.password === sha512(req.body.password, user.salt).passwordHash) {
        res.status(200)
        const payload = {user: user.username, userId: user.id}
        var token = jwt.sign(payload, app.get('authSecret'), {
          expiresIn: 600
        });
        res.json({ message: 'Login OK', accessToken: token, user: user })
      }
      else {
        res.status(403)
        res.json('Authentication error')
      }
    })
  })
}
