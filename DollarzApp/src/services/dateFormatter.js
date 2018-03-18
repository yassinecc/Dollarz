export const formatExpiryMonth = month => {
  if (!month) return month;

  if (month < 10) return `0${month}`;
  return month;
};

export const formatExpiryYear = year => {
  if (!year) return year;

  return year.toString().slice(-2);
};
