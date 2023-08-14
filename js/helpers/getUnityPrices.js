import getProductPrices from "../services/product/getProductPrices.js"

const getUnityPrices = async (prod_id, currency, rol) => {
  const prices = await getProductPrices(
    prod_id,
    currency,
    rol
  )
  console.log('debug', prices);
  return prices
}

export default getUnityPrices