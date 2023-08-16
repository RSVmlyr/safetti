import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";

class PaginatorElement extends HTMLElement {
  constructor(uid, pageNumber, Quotation, totalPages) {
    super();
    this.totalPages = totalPages;
    this._uid = uid;
    this._advisorId = 0;
    this.pageNumber = pageNumber;
    this.Quotation = Quotation;
    this.renderPaginator = this.renderPaginator.bind(this);
    this.selectAdvisor = this.selectAdvisor.bind(this);
    this.clickPager = this.clickPager.bind(this);
    this.pageNumberCallback = this.pageNumberCallback.bind(this);
    this.handleAdvisorChange = this.handleAdvisorChange.bind(this);
    this.handlePageButtonClick = this.handlePageButtonClick.bind(this);
  }

  connectedCallback() {
    this.renderPaginator();
    this.selectAdvisor();
    this.clickPager();
    this.handlePageButtonClick(); // Agregar esta línea para llamar a handlePageButtonClick
  }

  get uid() {
    return this._uid;
  }

  set uid(value) {
    this._uid = value;
  }

  get advisorId () {
    return this._advisorId;
  }

  set advisorId(value) {
    this._advisorId = value;
  }

  renderPaginator() {
    this.pageNumberCallback(this.Quotation);
    const Quotation = this.Quotation;
    const paginator = document.createElement('div');
    paginator.classList.add('pager');
    if (Quotation && this.totalPages > 1) {
      for (let i = 1; i <= this.totalPages; i++) {
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
    if (e && e.target.tagName === 'BUTTON') { // Agregar comprobación de existencia de e
      const pageNumber = parseInt(e.target.value);
      this.pageNumber = pageNumber;

      const buttons = this.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');
      
      console.log(3, e.target.value, this.advisorId);
      const uid = localStorage.getItem('current')
      try {
        const Q = await QuotationSearch(uid, e.target.value, this.advisorId);
        this.pageNumberCallback(Q.results);
      } catch (error) {
        console.log('QuotationSearch Error:', error);
      }
    }
  }

  async handleAdvisorChange(e) {
    this.advisorId = e.target.value
    try {
      const Q = await QuotationSearch(this.uid, 1, this.advisorId);
      console.log('change', Q);
      this.pageNumberCallback(Q.results);
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
    let quotationContentList = document.querySelectorAll('#quotation--content--list .quotation--list--row');
    quotationContentList.forEach(element => {
      element.remove();
    });
    if (Array.isArray(quotation)) {
      quotation.reverse();
      quotation.forEach(cot => {        
        quotationListRow(cot);
      });
    } else {
      // console.log('Invalid Quotation data:', quotation);
    }
  }
}

customElements.define('c-paginator', PaginatorElement);
export default PaginatorElement;
