const express = require('express');
const app = express();
const apiRoutes = express.Router();
const explorer = require('express-explorer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const secret = require('./secret.json');
const stripe = require('stripe')(secret.stripeSecretKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('authSecret', secret.jwtSecret)

require('./routes/createCustomer')(app)
require('./routes/login')(app)

app.get('/', (req, res) => {
  res.send('Hello Dev!');
});

app.post('/api/test/', (req, res) => {
  res.json({ hey: req.body.first, yo: req.body.second });
});

const settings = {
  format: 'html',
};

apiRoutes.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

app.post('/api/doPayment/', (req, res) => {
  stripe.charges
    .create({
      amount: 100 * req.body.amount,
      currency: 'eur',
      source: req.body.tokenId,
      description: 'Test payment from app',
    })
    .then(stripeResponse => {
      res.json(stripeResponse);
    })
    .catch(error => {
      res.status(403).send('Error occured', { error });
    });
});

app.use('/explorer', explorer(settings));

app.use('/api', apiRoutes)

app.listen(5000, function() {
  console.log('Dev app listening on port 5000');
});
