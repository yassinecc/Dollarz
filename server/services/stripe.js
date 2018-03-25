const app = require('../server');
const stripeSecretKey = require('../secret.json').stripeSecretKey;

const stripe = require('stripe')(stripeSecretKey);
const momentTz = require('moment-timezone');
const toNumber = require('lodash/toNumber');

// ⚠️ IMPORTANT ⚠️
// If you create a service and need to mock it, you need to do so in /server/jest/setup.js
// The mocks in this file will override all Stripe mocks in the backend

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

const chargeFromDeposit = (depositChargeId, amount) => {
  if (amount > 0) {
    return stripe.charges
      .capture(depositChargeId, { amount: Math.round(amount * 100) })
      .catch(error => {
        console.log(`Error charging from deposit [from chargeFromDeposit]`, {
          error,
          depositChargeId,
          amount,
        });
        return Promise.reject(error);
      });
  } else {
    return Promise.resolve('No amount charged');
  }
};

const getChargedDepositAmount = depositChargeId =>
  stripe.charges
    .retrieve(depositChargeId)
    .then(charge => {
      if (charge.captured || charge.refunded) {
        return 0; // If deposit has been captured or released, we can take 0 EUR from it
      }
      return toNumber(charge.amount) / 100;
    })
    .catch(error => {
      console.log(`Error getting charged deposit [from getChargedDepositAmount]`, {
        error,
        depositChargeId,
      });
      return 0;
    });

const captureSuccessfulBookingCharge = stripeChargeId =>
  stripe.charges.capture(stripeChargeId).catch(error => {
    console.log(`Error capturing successful booking charge [from captureSuccessfulBookingCharge]`, {
      error,
      stripeChargeId,
    });
    return Promise.reject(error);
  });

const refundUncapturedCharge = stripeChargeId =>
  stripe.refunds
    .create({
      charge: stripeChargeId,
    })
    .catch(error => {
      console.log(`Error refunding uncaptured charge [from refundUncapturedCharge]`, {
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

const createDepositAndUpdateBooking = (booking, depositAmount, description) => {
  const metadata = { agency: booking.departAgencyCode().codeAgency };
  return createCharge(
    booking.stripeCustomerId,
    booking.stripeSourceId,
    depositAmount,
    false,
    description,
    metadata
  )
    .then(result => {
      return booking.updateAttributes({
        depositDate: momentTz.unix(result.created).utc(),
        depositChargeId: result.id,
      });
    })
    .catch(error => {
      console.log('Error creating deposit', { error });
      return Promise.reject(error);
    });
};

const releaseDeposit = booking =>
  stripe.refunds
    .create({
      charge: booking.depositChargeId,
    })
    .catch(error => {
      console.log(`Error releasing deposit of booking [from releaseDeposit]`, { error, booking });
      return Promise.reject(error);
    });

const retrieveCustomerSourcesData = stripeCustomerId =>
  stripe.customers
    .retrieve(stripeCustomerId)
    .then(customer => customer.sources.data)
    .catch(error => {
      console.log('Error retreiving customer sources data', { error });
      return Promise.reject(error);
    });

module.exports = {
  createCharge,
  captureSuccessfulBookingCharge,
  refundUncapturedCharge,
  createDepositAndUpdateBooking,
  releaseDeposit,
  createCustomerWithSource,
  retrieveCustomerAndAddSource,
  retrieveCustomerSourcesData,
  chargeFromDeposit,
  getChargedDepositAmount,
};
