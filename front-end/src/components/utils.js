
const usNumberformatter = (number, decimals = 0) => {
  return Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();
};

export { usNumberformatter };
