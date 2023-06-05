import quotationListRow from "./components/quotationListRow.js"
import selectAdvisors from "./components/selectAdvisors.js"
import getAdvisors from "./services/getAdvisors.js"
import getQuotation from "./services/getQuotation.js"

const quotation = document.querySelector('#quotation')

document.addEventListener('DOMContentLoaded', () => {

  if(quotation) {

    const query = async () => {

      const quotationContentList = quotation.querySelector('#quotation--content--list')
      quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>Cargando Cotizaciones...</span></div>')
      const spinner = quotation.querySelector('#quotation--content--list .quotation--loading')

      const resQuery = await getQuotation()
      const resQueryAdvisors = await getAdvisors()

      spinner.remove()

      // Get Advisors
      const getAdvisor = () => {
        if (resQueryAdvisors.length > 0) {
          resQueryAdvisors.forEach(adv => {
            selectAdvisors(adv)
          });
        }
      }

      getAdvisor()
      // Get Advisors

      // Get Quotations
      const getQuotations = () => {
        if (resQuery.length > 0) {
          resQuery.forEach(cot => {
            quotationListRow(cot)
          });
        } else {
          const quotationContentList = quotation.querySelector('#quotation--content--list')
          quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
        }

      }

      getQuotations()
      // Get Quotations

    }

    query()

  }

})
