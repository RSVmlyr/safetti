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
    this.pageSize = '1'
  }

  connectedCallback() {
    this.clickPager();
    this.renderPaginator();
    this.selectAdvisor();
  }

  async renderPaginator() {
    const uid = localStorage.getItem('current')
    const data = await QuotationSearch(uid, this.pageNumber, this.pageSize, this.advisorId, this.clientName);
    //console.log(data);
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
          const ellipsisStartButton = document.createElement('button');
          ellipsisStartButton.textContent = '...';
          ellipsisStartButton.disabled = true;
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
          }
          paginator.appendChild(pageButton);
        }
  
        if (rangeEnd < totalPages - ellipsisThreshold + 1) {
          const ellipsisEndButton = document.createElement('button');
          ellipsisEndButton.textContent = '...';
          ellipsisEndButton.disabled = true;
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
        item.classList.add('disabled');
        item.setAttribute('disabled', true);
        item.classList.remove('active');
      })
      this.loading();
      e.target.classList.add('active');
      try {
        const uid = localStorage.getItem('current')
        const data = await QuotationSearch(uid, e.target.value, this.pageSize, this.advisorId, this.clientName);
        this.paginatorNumber(data.totalPages, e.target.value)
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
        console.log(quotation, 'debug');
        const listContainer = document.querySelector('#quotation--content--list');
        const notResult = document.createElement('div');
        notResult.classList.add('not-result')
        notResult.textContent = 'No hay resultados'
        listContainer.appendChild(notResult);
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
