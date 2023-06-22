import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";

class PaginatorElement extends HTMLElement {
  constructor(uid, pageNumber, Quotation) {
    console.log(uid);
    super();
    this.uid = uid;
    this.advisorId = 0;
    this.pageNumber = pageNumber;
    this.Quotation = Quotation;
    this.renderPaginator = this.renderPaginator.bind(this);
    this.pageNumberCallback = this.pageNumberCallback.bind(this);
    this.createPaginator = this.createPaginator.bind(this.totalPages);
    this.handleAdvisorChange = this.handleAdvisorChange.bind(this);
  }

  connectedCallback() {
    this.renderPaginator();
    this.addEventListener('click', this.handlePageButtonClick.bind(this));
    const selectAdvisorId = document.querySelector('#advisors');
    selectAdvisorId.addEventListener('change', this.handleAdvisorChange);
  }

  renderPaginator() {
    this.pageNumberCallback();
    const Quotation = this.Quotation;
    const paginator = document.createElement('div');
    paginator.classList.add('pager');
    if (Quotation) {
      for (let i = 1; i <= Quotation.length; i++) {
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
  setUid() {
    return this.uid
  }

  pageNumberCallback() {
    let quotationContentList = document.querySelectorAll('#quotation--content--list .quotation--list--row');
    quotationContentList.forEach(element => {
      element.remove();
    });
    if (Array.isArray(this.Quotation)) {
      this.Quotation.forEach(cot => {
        quotationListRow(cot);
      });
    } else {
      console.log('Invalid Quotation data:', this.Quotation);
    }
  }

  async handleAdvisorChange(e) {
    console.log('e', setUid());
    console.log(this.uid, e.target.value);
    this.advisorId = e.target.value;
    try {
      this.Quotation = await QuotationSearch(this.uid, 1, this.advisorId);
      this.pageNumberCallback();
    } catch (error) {
      console.log('QuotationSearch Error:', error);
    }
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

      this.pageNumberCallback();
    }
  }

  createPaginator(totalPages) {
    this.renderPaginator(totalPages);
  }
}

customElements.define('c-paginator', PaginatorElement);
export default PaginatorElement;
