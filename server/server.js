const express = require('express');
const app = express();
const explorer = require('express-explorer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const secret = require('./secret.json');
const stripe = require('stripe')(secret.stripeSecretKey);
const stripeService = require('./services/stripe')

const Customer = require('./models').Customer;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('authSecret', secret.jwtSecret)

require('./routes/createCustomer')(app)
require('./routes/login')(app)

const settings = {
  format: 'html',
};

app.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('authSecret'), (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        res.locals.decoded = decoded 
        next();
      }
    });
  } else {
    console.log('no token')
    // if there is no token, return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

app.get('/', (req, res) => {
  res.send('Hello Dev!');
});

app.post('/api/test/', (req, res) => {
  res.json({ hey: req.body.first, yo: req.body.second });
});

app.post('/api/doPayment/', (req, res) => {
  return stripe.charges
    .create({
      amount: 100 * req.body.amount,
      currency: 'eur',
      source: req.body.tokenId,
      description: 'Test payment from app',
    })
    .then(stripeResponse => {
      res.status(200).send({stripeResponse: stripeResponse, username: res.locals.decoded.user});
    })
    .catch(error => {
      res.status(403).send({err: error });
    });
});

app.get('/api/getCustomerCards/', (req, res) => (
  Customer.findById(res.locals.decoded.userId)
    .then(user => {
      return stripeService.retrieveCustomerSourcesData(user.stripeCustomerId)
    })
    .then(cards => {
      res.status(200).send({customerCards: cards})
    })
    .catch(err => {
      console.log(err)
      res.status(403).send('ko')
    })
))

app.use('/explorer', explorer(settings));

app.listen(5000, function() {
  console.log('Dev app listening on port 5000');
});
