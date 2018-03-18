const express = require('express');
const app = express();
const explorer = require('express-explorer');
const bodyParser = require('body-parser');
const secret = require('./secret.json');
const stripe = require('stripe')(secret.stripeSecretKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/user')(app);

app.get('/', (req, res) => {
  res.send('Hello Dev!');
});

app.post('/api/test/', (req, res) => {
  res.json({ hey: req.body.first, yo: req.body.second });
});

const settings = {
  format: 'html',
};

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

app.listen(5000, function() {
  console.log('Dev app listening on port 5000');
});
