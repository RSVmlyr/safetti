function getPriceInRange(prices, value) {
  if (prices != undefined) {
    if (value <= 5) {
      return prices["p" + value]
    }

    if (value >= 5 && value < 10) {
      return prices["p5"]
    }

    if (value >= 10 && value < 15) {
      return prices["p10"]
    }

    if (value >= 15 && value < 20) {
      return prices["p15"]
    }

    if (value >= 20 && value < 50) {
      return prices["p20"]
    }

    if (value >= 50 && value < 100) {
      return prices["p50"]
    }

    if (value >= 100 && value < 300) {
      return prices["p100"]
    }
    
    if (value >= 300) {
      return prices["p300"]
    }
  }
}

export default getPriceInRange
