const formatNumberWithPoints = (n) => {
  const currencyLocal = localStorage.getItem('Currency')
  if (currencyLocal === 'COP') {
    const value = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // console.log(value);
    return value
  } else {
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
}

export default formatNumberWithPoints
