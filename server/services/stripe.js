const app = require('../server');
const stripeSecretKey = require('../secret.json').stripeSecretKey;

const stripe = require('stripe')(stripeSecretKey);

const createCharge = (
  stripeCustomerId,
  stripeSourceId,
  amount,
  capture = true,
  description = null,
  metadata = null
) => {
  return stripe.charges.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    capture: capture,
    customer: stripeCustomerId,
    source: stripeSourceId,
    description,
    metadata,
  });
};

const captureSuccessfulBookingCharge = stripeChargeId =>
  stripe.charges.capture(stripeChargeId).catch(error => {
    console.log(`Error capturing successful booking charge [from captureSuccessfulBookingCharge]`, {
      error,
      stripeChargeId,
    });
    return Promise.reject(error);
  });

const refundCharge = stripeChargeId =>
  stripe.refunds
    .create({
      charge: stripeChargeId,
    })
    .catch(error => {
      console.log(`Error refunding uncaptured charge [from refundCharge]`, {
        error,
        stripeChargeId,
      });
      return Promise.reject(error);
    });

const createCustomerWithSource = (stripeTokenId, userEmail) =>
  stripe.customers
    .create({
      email: userEmail,
      source: stripeTokenId,
    })
    .catch(error => {
      console.log(`Error creating customer [from createCustomerWithSource]`, {
        error,
        userEmail,
        stripeTokenId,
      });
      return Promise.reject(error);
    });

const retrieveCustomerAndAddSource = (stripeCustomerId, stripeTokenId, stripeCardId) => {
  if (stripeTokenId) {
    return stripe.customers
      .createSource(stripeCustomerId, { source: stripeTokenId })
      .then(newSource => {
        return stripe.customers.update(stripeCustomerId, { default_source: newSource.id });
      })
      .catch(error => {
        console.log(
          `Error retrieving customer and adding source [from retrieveCustomerAndAddSource with stripeTokenId]`,
          { error, stripeCustomerId, stripeTokenId }
        );
        return Promise.reject(error);
      });
  } else {
    return stripe.customers
      .update(stripeCustomerId, { default_source: stripeCardId })
      .catch(error => {
        console.log(
          `Error retrieving customer and adding source [from retrieveCustomerAndAddSource with stripeCardId]`,
          { error, stripeCustomerId, stripeCardId }
        );
        return Promise.reject(error);
      });
  }
};

const retrieveCustomerSourcesData = stripeCustomerId =>
  stripe.customers
    .retrieve(stripeCustomerId)
    .then(customer => customer.sources.data)
    .catch(error => {
      console.log('Error retreiving customer sources data', { error });
      return Promise.reject(error);
    });

const retrieveCustomerOrders = stripeCustomerId =>
  stripe.charges.list({ customer: stripeCustomerId });

module.exports = {
  createCharge,
  captureSuccessfulBookingCharge,
  refundCharge,
  createCustomerWithSource,
  retrieveCustomerAndAddSource,
  retrieveCustomerSourcesData,
  retrieveCustomerOrders,
};
