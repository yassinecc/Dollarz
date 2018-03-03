var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const secret = require('./secret.json');
var stripe = require('stripe')(secret.stripeSecretKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello Dev!');
});

app.post('/api/test/', function(req, res) {
  res.json({ hey: req.body.first, yo: req.body.second, vam: secret.test });
});

app.listen(5000, function() {
  console.log('Dev app listening on port 5000!');
});
