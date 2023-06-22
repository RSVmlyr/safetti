import quotationListRow from "./components/quotation/quotationListRow.js"
import selectAdvisors from "./components/quotation/selectAdvisors.js"
import quotationNewPage from "./components/quotationNew/quotationNew.js"
import getAdvisors from "./services/advisors/getAdvisors.js"
import getProduct from "./services/product/getProduct.js"
import getQuotation from "./services/quotation/getQuotation.js"
import getUser from "./services/user/getUser.js"
import QuotationSearch from "./services/quotation/QuotationSearch.js"
import './components/quotationNew/QuotationCalculation.js';
import PaginatorElement from './components/paginator/PaginatorElement.js';

document.addEventListener('DOMContentLoaded', () => {

  const quotation = document.querySelector('#quotation')
  const quotationNew = document.querySelector('#quotationew')


  const query = async () => {
    
    const uid = window.location.search.match(/\d+/)?.[0] ?? 4;
    const resQueryUser = await getUser(uid)

    console.log(resQueryUser.rol);

    if( quotation ) {

      const quotationContentList = quotation.querySelector('#quotation--content--list')
      quotationContentList.insertAdjacentHTML('afterbegin', '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">')
      const resQueryAdvisors = await getAdvisors()
      const spinner = quotation.querySelector('#quotation--content--list .quotation--loading')
      spinner.remove()

      let Quotation='';
      switch (resQueryUser.rol) {
        case 'advisors':
            const q = await QuotationSearch(uid, 1, 0)
            Quotation = q.results
          break;
        case 'partner':
            document.querySelector('.quotation--container__action').remove();
            Quotation = await getQuotation(uid)
          break;
        default:
          break;
      }
      const paginatorElement = new PaginatorElement(uid, 1, Quotation);
      paginatorElement.renderPaginator();
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
      sliderProducts.insertAdjacentHTML('afterbegin', '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">')

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
