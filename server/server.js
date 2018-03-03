const express = require('express');
const app = express();
const explorer = require('express-explorer');
const bodyParser = require('body-parser');
const secret = require('./secret.json');
const stripe = require('stripe')(secret.stripeSecretKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello Dev!');
});

app.post('/api/test/', function(req, res) {
  res.json({ hey: req.body.first, yo: req.body.second, vam: secret.test });
});

const settings = {
  format: 'html',
};

app.post('/api/doPayment/', function(req, res) {
  stripe.charges
    .create({
      amount: 900,
      currency: 'eur',
      source: req.body.first,
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

app.listen(5000, function() {
  console.log('Dev app listening on port 5000!');
});
