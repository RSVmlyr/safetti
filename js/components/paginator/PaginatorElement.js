import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";

class PaginatorElement extends HTMLElement {
  constructor(uid, pageNumber, advisorId, totalPages, pageSize) {
    super();
    this.uid = uid
    this.pageNumber = pageNumber;
    this.totalPages = totalPages
    this.advisorId = advisorId;
    this.pageSize = pageSize;
    this.renderPaginator = this.renderPaginator.bind(this);
    this.pageNumberCallback = this.pageNumberCallback.bind(this);
    this.createPaginator = this.createPaginator.bind(this.totalPages);
  }

  connectedCallback() {
    this.renderPaginator();
    this.addEventListener('change', this.handleAdvisorChange.bind(this));
    this.addEventListener('click', this.handlePageButtonClick.bind(this));
    const selectAdvisorId = document.querySelector('#advisors');
    selectAdvisorId.addEventListener('change', this.handleAdvisorChange.bind(this));
  }

  renderPaginator() {
    this.pageNumberCallback(this.uid, this.pageNumber, this.advisorId, this.pageSize)
    const totalPages =  this.totalPages/* obtener el número total de páginas */
    const paginator = document.createElement('div');
    paginator.classList.add('pager');

    for (let i = 1; i <= totalPages; i++) {
      console.log(i);
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.value = i;
      pageButton.classList.add('item-pager');
      if (i === 1) {
        pageButton.classList.add('active');
      }
      paginator.appendChild(pageButton);
    }
    document.querySelector('c-paginator').appendChild(paginator);
  }

  async pageNumberCallback(uid, pageNumber, advisorId, pageSize) {
    let quotationContentList = document.querySelectorAll('#quotation--content--list .quotation--list--row');
    quotationContentList.forEach(element => {
      element.remove();
    });

    console.log('debug', uid, pageNumber, advisorId, pageSize);
    if (advisorId === undefined) {
      advisorId = '0';
    }
    const resQuery = await QuotationSearch(uid, pageNumber, advisorId, pageSize);
    let data = resQuery.results;
    data.forEach(cot => {
      quotationListRow(cot);
    });
  }

  handleAdvisorChange(e) {
    console.log('e', e);
    this.advisorId = e.target.value;
    console.log(4, this.pageNumber, this.advisorId);
    this.renderPaginator()
    this.pageNumberCallback(4, 1, this.advisorId, 12);
  }

  handlePageButtonClick(e) {
    if (e.target.tagName === 'BUTTON') {
      const pageNumber = parseInt(e.target.value);
      this.pageNumber = pageNumber;

      const buttons = this.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');

      this.pageNumberCallback(4, this.pageNumber, this.advisorId);
    }
  }

  createPaginator(totalPages) {
    this.renderPaginator(totalPages);
  }
}

customElements.define('c-paginator', PaginatorElement);
export default PaginatorElement;
