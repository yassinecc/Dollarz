const express = require('express');
const app = express();
const explorer = require('express-explorer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = require('./secret.json');
const stripeService = require('./services/stripe');

const Customer = require('./models').Customer;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('authSecret', secret.jwtSecret);

require('./routes/createCustomer')(app);
require('./routes/login')(app);

const settings = {
  format: 'html',
};

app.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('authSecret'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
});

app.get('/api/checkAuth/', (req, res) => {
  res.status(200).send('OK');
});

app.post('/api/doPayment/', (req, res) => {
  let stripeResponse = {};
  let dbUser = null;
  Customer.findById(res.locals.decoded.userId)
    .then(user => {
      dbUser = user;
      if (user.stripeCustomerId) {
        return stripeService.retrieveCustomerAndAddSource(
          user.stripeCustomerId,
          req.body.tokenId,
          req.body.cardId
        );
      } else {
        return stripeService.createCustomerWithSource(req.body.tokenId, user.username);
      }
    })
    .then(stripeCustomer => {
      return stripeService.createCharge(
        stripeCustomer.id,
        stripeCustomer.default_source,
        req.body.amount,
        false,
        req.body.offerName
      );
    })
    .then(response => {
      return Promise.resolve(response);
      // return Promise.reject(Error('error'));
    })
    .catch(error => {
      stripeService.refundCharge(stripeResponse.id);
      return Promise.reject(Error(error));
    })
    .then(stripeResponse => {
      stripeService.captureSuccessfulCharge(stripeResponse.id);
      dbUser.update({ stripeCustomerId: stripeResponse.customer });
      res.status(200).send({ stripeResponse: stripeResponse, username: res.locals.decoded.user });
    })
    .catch(error => {
      res.status(403).send({ err: error });
    });
});

app.get('/api/getCustomerCards/', (req, res) =>
  Customer.findById(res.locals.decoded.userId)
    .then(user => {
      return stripeService.retrieveCustomerSourcesData(user.stripeCustomerId);
    })
    .then(cards => {
      res.status(200).send({ customerCards: cards });
    })
    .catch(err => {
      console.log(err);
      res.status(403).send('ko');
    })
);

app.get('/api/getStripeOrders/', (req, res) =>
  Customer.findById(res.locals.decoded.userId)
    .then(user => {
      return stripeService.retrieveCustomerOrders(user.stripeCustomerId);
    })
    .then(result => {
      res.status(200).send({ orders: result });
    })
);

app.post('/api/refundStripeOrder', (req, res) =>
  Customer.findById(res.locals.decoded.userId)
    .then(user => {
      return stripeService.refundCharge(req.body.chargeId);
    })
    .then(result => {
      res.status(200).send('OK');
    })
    .catch(console.log)
);

app.use('/explorer', explorer(settings));

app.listen(5000, function() {
  console.log('Dev app listening on port 5000');
});
