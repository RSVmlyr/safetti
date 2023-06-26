import quotationListRow from "./components/quotation/quotationListRow.js"
import selectAdvisors from "./components/quotation/selectAdvisors.js"
import quotationNewPage from "./components/quotationNew/quotationNew.js"
import getAdvisors from "./services/advisors/getAdvisors.js"
import getProduct from "./services/product/getProduct.js"
import getUser from "./services/user/getUser.js"
import QuotationSearch from "./services/quotation/QuotationSearch.js"
import './components/quotationNew/QuotationCalculation.js';
import PaginatorElement from './components/paginator/PaginatorElement.js';
import getClients from "./services/clients/getClients.js"

document.addEventListener('DOMContentLoaded', () => {

  const quotation = document.querySelector('#quotation')
  const quotationNew = document.querySelector('#quotationew')


  const query = async () => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const uid = searchParams.get('uid') || '4';
    const resQueryUser = await getUser(uid)

    if( quotation ) {
      const quotationContentList = quotation.querySelector('#quotation--content--list')
      quotationContentList.insertAdjacentHTML('afterbegin', '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">')
      const resQueryAdvisors = await getAdvisors()
      const spinner = quotation.querySelector('#quotation--content--list .quotation--loading')
      spinner.remove()
      const btn_ = document.querySelector('.quotation--btn__add')
      btn_.setAttribute('href', '/index-q.html?uid=' + resQueryUser.id)

      let Quotation='', totalPages = '', advisorId = 0, q = ''
      switch (resQueryUser.rol) {
        case 'advisors':
          q = await QuotationSearch(uid, 1, advisorId)
          Quotation = q.results
          totalPages = q.totalPages
          break;

        default:
          document.querySelector('.quotation--container__action').remove();
          q = await QuotationSearch(uid, 1, advisorId)
          Quotation = q.results
          totalPages = q.totalPages
          break;
      }
      console.log(q);
      const paginatorElement = new PaginatorElement(uid, 1, Quotation, totalPages);
      paginatorElement.renderPaginator();
      paginatorElement.selectAdvisor();
      //paginatorElement.clickPager();
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
      const resQueryClients = await getClients()

      const spinnerP = quotationNew.querySelector('.slider--productos .quotation--loading')
      spinnerP.remove()

      // Get Users and Products
      const getDataQuotationNew = () => {
        quotationNewPage(quotationNew, resQueryUser, resQueryProducts, resQueryClients)
      }
      // Get Users and Products
      getDataQuotationNew()

    }

  }
  query()
})
