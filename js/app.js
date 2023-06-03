import quotationListRow from "./components/quotationListRow.js"
import getQuotation from "./services/getQuotation.js"

const quotation = document.querySelector('#quotation')

document.addEventListener('DOMContentLoaded', () => {

  if(quotation) {

    const query = async () => {

      const quotationContentList = quotation.querySelector('#quotation--content--list')
      quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>Cargando Cotizaciones...</span></div>')
      const spinner = quotation.querySelector('#quotation--content--list .quotation--loading')

      const resQuery = await getQuotation('19')

      spinner.remove()

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

      getQuotations();

    }

    query()

  }

})
