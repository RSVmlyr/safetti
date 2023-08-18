import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";

class PaginatorElement extends HTMLElement {
  constructor() {
    super();
    this.totalPages = 0;
    this.totalPages = 0
    this.pageNumber = 1;
    this.Quotation = 0;
    this.results = '0'
    this.advisorId = '0'
    this.clientName = ' '
    this.pageSize = '3'
  }

  connectedCallback() {
    this.clickPager();
    this.renderPaginator();
    this.selectAdvisor();
  }


  async renderPaginator() {
    const uid = localStorage.getItem('current')
    const data = await QuotationSearch(uid, this.pageNumber, this.pageSize, this.advisorId, this.clientName);
    console.log(data);
    const pagerItem = document.querySelectorAll('.pager .item-pager');
    const buttons = this.querySelectorAll('button');

    pagerItem.forEach(item =>{
      item.classList.add('disabled');
      item.setAttribute('disabled', true);
    })
    this.totalPages = data.totalPages;
    this.results = data.results 
    this.pageNumberCallback(this.results);
    this.paginatorNumber(this.results, this.totalPages)
  }

  paginatorNumber(results, totalPages) {
   
    const paginator = document.createElement('div');
   /*  const pager = document.querySelector('.pager');
    console.log(pager);
    if(pager){
      pager.remove()
    } */
    paginator.classList.add('pager');
    if (results && totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.value = i;
        pageButton.classList.add('item-pager');
        if (i === 1) {
          pageButton.classList.add('active');
        }
        paginator.appendChild(pageButton);
      }
    }
    document.querySelector('c-paginator').appendChild(paginator);
  }

  async handlePageButtonClick(e) {
    if (e && e.target.tagName === 'BUTTON') { 
      const pagerItem = document.querySelectorAll('.pager .item-pager');
      pagerItem.forEach(item =>{
        item.classList.add('disabled');
        item.setAttribute('disabled', true);
        item.classList.remove('active');
      })
      this.loading();
      e.target.classList.add('active');
      try {
        const uid = localStorage.getItem('current')
        const data = await QuotationSearch(uid, e.target.value, this.pageSize, this.advisorId, this.clientName);
        this.pageNumberCallback(data.results);
      } catch (error) {
        console.log('QuotationSearch Error:', error);
      }
    }
  }

  async handleAdvisorChange(e) {
    const paginatorOld = document.querySelector('.pager');
    if (paginatorOld) {
      paginatorOld.remove();
    }
    try {
      this.advisorId = e.target.value
      this.loading();
      this.renderPaginator()
    } catch (error) {
      console.log('QuotationSearch Error:', error);
    }
  }
  
  selectAdvisor() {
    const selectAdvisorId = document.querySelector('#advisors');
    if(selectAdvisorId){
      selectAdvisorId.addEventListener('change', this.handleAdvisorChange.bind(this));
    }
  }
  clickPager() {
    this.addEventListener('click', this.handlePageButtonClick.bind(this));
  }

  pageNumberCallback(quotation) {
    if (quotation) {
      const loadingDivHtml = document.querySelector('.loading-message')
      if (loadingDivHtml) {
        loadingDivHtml.remove();
      }
      const pagerItem = document.querySelectorAll('.pager .item-pager');
      pagerItem.forEach(item =>{
        item.classList.remove('disabled')
        item.removeAttribute('disabled')
      })
      if(quotation.length === 0){
        const loadingDiv = document.createElement('div');
        const quotationContentListContainer = document.querySelector('#quotation--content--list');
        loadingDiv.textContent = 'No';
        loadingDiv.classList.add('loading-message')
        quotationContentListContainer.appendChild(loadingDiv);
      }
    }
    quotation.reverse();
    quotation.forEach(cot => {        
      quotationListRow(cot);
    });
  }
  
  loading() {
    const loadingDiv = document.createElement('div');
    const quotationContentListContainer = document.querySelector('#quotation--content--list');
    const quotationContentList = quotationContentListContainer.querySelectorAll('#quotation--content--list .quotation--list--row');
    loadingDiv.textContent = 'Cargando...';
    loadingDiv.classList.add('loading-message')
    quotationContentList.forEach(element => {
      element.remove();
    });
    quotationContentListContainer.appendChild(loadingDiv);
  }
}



customElements.define('c-paginator', PaginatorElement);
export default PaginatorElement;
