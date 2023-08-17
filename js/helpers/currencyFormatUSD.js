const currencyFormatUSD = (n , currency) => {
 
  const number = n;
  const usdAmount = currency === 'USD' ? 'en-US' : false

  const formattedNumber = new Intl.NumberFormat(usdAmount, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number); 

  return formattedNumber

}

export default currencyFormatUSD