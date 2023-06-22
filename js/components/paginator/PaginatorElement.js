import quotationListRow from "../quotation/quotationListRow.js";
import QuotationSearch from "../../services/quotation/QuotationSearch.js";

class PaginatorElement extends HTMLElement {
  constructor(uid, pageNumber, Quotation) {
    console.log(uid);
    super();
    this.uid = uid
    this.advisorId = 0
    this.pageNumber = pageNumber;
    this.Quotation = Quotation
    this.renderPaginator = this.renderPaginator.bind(this);
    this.pageNumberCallback = this.pageNumberCallback.bind(this);
    this.createPaginator = this.createPaginator.bind(this.totalPages);
  }

  connectedCallback() {
    this.renderPaginator();
    this.handleAdvisorChange = this.handleAdvisorChange.bind(this);
    this.addEventListener('click', this.handlePageButtonClick.bind(this));
    const selectAdvisorId = document.querySelector('#advisors');
    selectAdvisorId.addEventListener('change', this.handleAdvisorChange);
  }

  renderPaginator() {
    this.pageNumberCallback(this.Quotation)
    const Quotation =  this.Quotation
    const paginator = document.createElement('div');
    paginator.classList.add('pager');
    if(Quotation){
      //console.log(Quotation.length);

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

  pageNumberCallback(Quotation) {
    let quotationContentList = document.querySelectorAll('#quotation--content--list .quotation--list--row');
    quotationContentList.forEach(element => {
      element.remove();
    });
    console.log(Quotation);
    if(Quotation) {
      Quotation.forEach(cot => {
        quotationListRow(cot);
      });
    }
  }

  async handleAdvisorChange(e) {
    console.log('e', e);
    this.advisorId = e.target.value;
    console.log(this.uid, this.advisorId);
    //this.renderPaginator()
    this.Quotation = await QuotationSearch(this.uid , 1, this.advisorId )
    //this.pageNumberCallback();
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
