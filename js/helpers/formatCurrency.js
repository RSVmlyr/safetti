const formatCurrency = (n, symbol) => {
  const COP = value => currency(value, { symbol: "", separator: ".", decimal:",", precision: 0 });
  const USD = value => currency(value, { symbol: "", separator: ",", decimal:".", precision: 2 });

  if (symbol === "COP") {
      return COP(n).format();
  }
  else {
      return USD(n).format();
  }
}

export default formatCurrency
