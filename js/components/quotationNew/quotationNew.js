
import dateFormat from "../../helpers/dateFormat.js";
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
import createProductCards from "./createProductsCards.js";
import searchProduct from "./searchProduct.js";

const quotationNewPage = (quotationNew, resQueryUser, resQueryProducts) => {
  
  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts.products);

  const dateCurrent = new Date()
  const idQnDate = quotationNew.querySelector('#qndate')
  idQnDate.innerHTML = 'Creación: ' + dateFormat(dateCurrent)

  const idQnClient = quotationNew.querySelector('#qnclient')
  idQnClient.innerHTML = 'Cliente: ' + resQueryUser.fullName
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  idQnAdvisor.innerHTML = 'Asesor: ' + resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  idQnCurrency.innerHTML = 'Modenda: ' + resQueryUser.currency

  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda)

  createProductCards(quotationNew, resQueryProducts)

  // Search Product
  searchProduct(quotationNew, resQueryProducts)
  // Search Product

}

export default quotationNewPage