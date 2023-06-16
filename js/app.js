import quotationListRow from "./components/quotation/quotationListRow.js"
import selectAdvisors from "./components/quotation/selectAdvisors.js"
import quotationNewPage from "./components/quotationNew/quotationNew.js"
import getAdvisors from "./services/advisors/getAdvisors.js"
import getProduct from "./services/product/getProduct.js"
import getQuotation from "./services/quotation/getQuotation.js"
import getUser from "./services/user/getUser.js"
import { createPaginator, pageNumberCallback } from './components/paginator/Paginator.js';
import QuotationSearch from "./services/quotation/QuotationSearch.js"
import './components/quotationNew/QuotationCalculation.js';


document.addEventListener('DOMContentLoaded', () => {

  const quotation = document.querySelector('#quotation')
  const quotationNew = document.querySelector('#quotationew')

  const query = async () => {

    if( quotation ) {

      const quotationContentList = quotation.querySelector('#quotation--content--list')
      quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span class="quotation--title">Cargando Cotizaciones...</span></div>')
      const resQuery = await getQuotation()
      const resQueryAdvisors = await getAdvisors()
      const spinner = quotation.querySelector('#quotation--content--list .quotation--loading')
      spinner.remove()

      window.drupalSettings = window.drupalSettings || {};
      console.log(' window.drupalSettings ',  window.drupalSettings );
      /*  var parametro = window.parent.getParametro();
      console.log('Parámetro del iframe padre:', parametro); */

      const uid = window.drupalSettings.user?.uid || 4;
      const searchQuery = await QuotationSearch(uid, 1, 0)
      createPaginator(searchQuery.totalPages)
      pageNumberCallback(uid, 1, 0)

      // Get Advisors
      const getAdvisor = () => {
        if (resQueryAdvisors.length > 0) {
          selectAdvisors(resQueryAdvisors)
        }
      }
      getAdvisor()
      // Get Advisors

      // Get Quotations
    /*    const getQuotations = () => {
        if (resQuery.length > 0) {
          resQuery.forEach(cot => {
            quotationListRow(cot)
          });
        } else {
          const quotationContentList = quotation.querySelector('#quotation--content--list')
          quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
        }
      }
      getQuotations() */
      // Get Quotations

    }

    if ( quotationNew ) {
      const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
      sliderProducts.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span class="quotation--title">Cargando Productos...</span></div>')

      const resQueryUser = await getUser()
      const resQueryProducts = await getProduct()

      const spinnerP = quotationNew.querySelector('.slider--productos .quotation--loading')
      spinnerP.remove()

      // Get Users and Products
      const getDataQuotationNew = () => {
        quotationNewPage(quotationNew, resQueryUser, resQueryProducts)
      }
      // Get Users and Products
      getDataQuotationNew()

    }

  }
  query()
})
