import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";
import loadingData from "../../helpers/loading.js";

class PaginatorElement extends HTMLElement {
  constructor(clientName) {
    super();
    this.totalPages = 0;
    this.totalPages = 0
    this.pageNumber = 1;
    this.Quotation = 0;
    this.results = '0'
    this.advisorId = '0'
    this.clientName = clientName === undefined ? ' ': clientName
    this.pageSize = '5'

    const selectAdvisorId = document.querySelector('#advisors');
    if(selectAdvisorId){
      this.advisorId = selectAdvisorId.value;
    }
  }

  connectedCallback() {
    const lastClickPager = localStorage.getItem('lastClickPager')
    // console.log('Click', lastClickPager);
    this.pageNumber = lastClickPager != null ? lastClickPager : 1;
    // console.log(this.pageNumber);
    this.clickPager();
    //this.renderPaginator();
    this.searchClients();
    this.selectAdvisor();
  }

  async renderPaginator() {

    const lastClickPager = localStorage.getItem('lastClickPager')
    // console.log('Click', lastClickPager);
    this.pageNumber = lastClickPager != null ? lastClickPager : 1;
    const pageNumberSet = this.pageNumber;

    const uid = localStorage.getItem('current')
    const data = await QuotationSearch(uid, pageNumberSet, this.pageSize, this.advisorId, this.clientName);
    const pagerItem = document.querySelectorAll('.pager .item-pager');
    pagerItem.forEach(item =>{
      item.classList.add('disabled');
      item.setAttribute('disabled', true);
    })
    this.totalPages = data.totalPages;
    this.results = data.results 
    this.pageNumberCallback(this.results);
    this.paginatorNumber(this.totalPages, this.pageNumber)
  }

  paginatorNumber(totalPages, pageNumber) {
    const paginator = document.createElement('div');
    const loadingDivHtml = document.querySelector('.loading-message')
    if (loadingDivHtml) {
      loadingDivHtml.remove();
    }
    const paginatorOld = document.querySelector('.pager');
    if (paginatorOld) {
      paginatorOld.remove();
    }
    paginator.classList.add('pager');
    const maxPagesToShow = 5; 
    const ellipsisThreshold = 2;
    const currentPage = parseInt(pageNumber);
  
    if (totalPages > 1) {
      if (totalPages <= maxPagesToShow) {
        // Mostrar todos los botones
        for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement('button');
          pageButton.textContent = i;
          pageButton.value = i;
          pageButton.classList.add('item-pager');
          if (i === currentPage) {
            pageButton.classList.add('active');
            pageButton.disabled = true;
          }
          paginator.appendChild(pageButton);
        }
      } else {
        // Mostrar el rango alrededor de la página actual
        let rangeStart = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
        let rangeEnd = Math.min(rangeStart + maxPagesToShow - 1, totalPages);
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '<<';
        firstPageButton.value = 1;
        firstPageButton.classList.add('item-pager');
        paginator.appendChild(firstPageButton);
  
        if (rangeStart > ellipsisThreshold) {
          const ellipsisStartButton = document.createElement('div');
          ellipsisStartButton.textContent = '...';
          ellipsisStartButton.classList.add('item-pager');
          paginator.appendChild(ellipsisStartButton);
        }
        for (let i = rangeStart; i <= rangeEnd; i++) {
          const pageButton = document.createElement('button');
          pageButton.textContent = i;
          pageButton.value = i;
          pageButton.classList.add('ellipsis');
          if (i === currentPage) {
            pageButton.classList.add('active');
            pageButton.disabled = true;
          }
          paginator.appendChild(pageButton);
        }
  
        if (rangeEnd < totalPages - ellipsisThreshold + 1) {
          const ellipsisEndButton = document.createElement('div');
          ellipsisEndButton.textContent = '...';
          ellipsisEndButton.classList.add('ellipsis');
          paginator.appendChild(ellipsisEndButton);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = '>>';
        lastPageButton.value = totalPages;
        lastPageButton.classList.add('item-pager');
        paginator.appendChild(lastPageButton);
      }
    }
    
    document.querySelector('c-paginator').appendChild(paginator);
  }
  
  
  async handlePageButtonClick(e) {
    if (e && e.target.tagName === 'BUTTON') { 
      const pagerItem = document.querySelectorAll('.pager .item-pager');
      pagerItem.forEach(item =>{
        item.classList.contains('active') ? item.disabled = true : false;
      })
      this.loading();
      try {
        const selectAdvisorId = document.querySelector('#advisors');
        if(selectAdvisorId){
          this.advisorId = selectAdvisorId.value;
        }
        const uid = localStorage.getItem('current')
        const data = await QuotationSearch(uid, e.target.value, this.pageSize, this.advisorId, this.clientName);
        localStorage.setItem('lastClickPager', e.target.value);
        localStorage.setItem('lastClickedIndex', 0);
        this.paginatorNumber(data.totalPages, e.target.value)
        this.pageNumberCallback(data.results);
      } catch (error) {
        console.error('QuotationSearch Error:', error);
      }
    }
  }

  async handleAdvisorChange(e) {
    const paginatorOld = document.querySelector('.pager');
    if (paginatorOld) {
      paginatorOld.remove();
    }
    try {
      const inputSearchClient = document.querySelector('.quotation--left .quotation--container__action #clients');
      this.clientName = inputSearchClient.value
      this.pageNumber = 1
      this.advisorId = e.target.value
      this.loading();
      this.renderPaginator()
    } catch (error) {
      console.error('QuotationSearch Error:', error);
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
    const notResult = document.querySelector('.not-result')
    if (notResult) {
      notResult.remove();
    }
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
        const listContainer = document.querySelector('#quotation--content--list');
        const notResult = document.createElement('div');
        notResult.classList.add('not-result')
        notResult.textContent = 'No hay cotizaciones, puedes crear una en el botón Nueva cotización.'
        listContainer.appendChild(notResult);
      }
    }
    quotation.reverse();
    quotation.forEach(cot => {        
      quotationListRow(cot);
    });
  }
  
  loading() {
    const quotationContentListContainer = document.querySelector('#quotation--content--list');
    const quotationContentList = quotationContentListContainer.querySelectorAll('#quotation--content--list .quotation--list--row');
    const loadingDiv = loadingData(quotationContentListContainer);
    quotationContentList.forEach(element => {
      element.remove();
    });
    quotationContentListContainer.appendChild(loadingDiv);
  }

  searchClients() {
    const inputSearchClient = document.querySelector('.quotation--left .quotation--container__action #clients');
    const formSearch = document.querySelector('.quotation--left .quotation--container__action #search-clients');
    formSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      this.clientName = inputSearchClient.value;
      this.pageNumber = 1;
      this.loading();
      this.renderPaginator()
    })

  }

  validateSearch(e) {
    const value = e.target.value
    this.clientName = value;
    this.loading();
    this.renderPaginator()
  }
}

customElements.define('c-paginator', PaginatorElement);
export default PaginatorElement;
