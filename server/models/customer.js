'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define(
    'Customer',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      stripeCustomerId: DataTypes.STRING,
      defaultSourceId: DataTypes.STRING,
    },
    {}
  );
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};
