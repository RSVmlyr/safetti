import quotationListRow from "../quotation/quotationListRow.js"
import QuotationSearch from "../../services/quotation/QuotationSearch.js"
//import  '../LoadingIndicator/LoadingIndicator.js';

function renderPaginator(totalPages) {
  const pager = document.querySelector('.pager')
  console.log(pager);
 
  console.log(totalPages);
  const paginator = document.createElement('div');
  const start = document.createElement('button');
  const end = document.createElement('button');
  paginator.classList.add('pager')

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i
    if(i === 1){
      pageButton.classList.add('active')
      start.textContent = i
      start.classList.add('start')
      paginator.appendChild(start);
    }
    if(i === totalPages){
      end.classList.add('end')
      end.textContent = i
    } 
    paginator.appendChild(pageButton);
  }
  paginator.appendChild(end);

  return paginator;
}

export async function pageNumberCallback(uid, pageNumber, advisorId) {
  let quotationContentList = document.querySelectorAll('#quotation--content--list .quotation--list--row');
  quotationContentList.forEach(element => {
    element.remove();
  });

  console.log('debug', uid, pageNumber, advisorId);
  if(advisorId === 'undefined'){
    advisorId = '0'
  }
  const resQuery = await QuotationSearch(uid, pageNumber, advisorId)
  let data = resQuery.results
  const paginatorElement = renderPaginator(resQuery.totalPages);

  data.forEach(cot => {
    quotationListRow(cot)
  });
}

export function createPaginator(totalPages) {
  const paginatorElement = renderPaginator(totalPages);
  const shadowRoot = document.createElement('div');
  shadowRoot.appendChild(paginatorElement);

  class PaginatorElement extends HTMLElement {
    constructor() {
      super();
      this.appendChild(paginatorElement);
      this.pageNumber = 1;
      this.advisorId = 0
      this._loadingIndicator = document.createElement('loading-indicator');
    }

    connectedCallback() {
      const buttons = this.querySelectorAll('button');
      const selectAdvisorId = document.querySelector('#advisors');
      selectAdvisorId.addEventListener('change', (e) => {
        this.advisorId = e.target.value 
        pageNumberCallback(4, this.pageNumber, this.advisorId).then(() => {
          this._loadingIndicator.remove()
        });
      });
      
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const pageNumber = parseInt(button.textContent);
          this.pageNumber = pageNumber;
          buttons.forEach(btn => {
            btn.classList.remove('active');
          });
          button.classList.add('active');

          //loadingIndicator.style.display = 'block'
          //document.body.appendChild(loadingIndicator);
          this.appendChild(this._loadingIndicator);
          console.log(this.advisorId);
          pageNumberCallback(4, this.pageNumber, this.advisorId).then(() => {
            this._loadingIndicator.remove()
          });
        });
      });
    }
  }

  customElements.define('c-paginator', PaginatorElement);
}
