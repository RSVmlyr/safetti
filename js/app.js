import selectAdvisors from "./components/quotation/selectAdvisors.js";
import quotationNewPage from "./components/quotationNew/quotationNew.js";
import getAdvisors from "./services/advisors/getAdvisors.js";
import getProduct from "./services/product/getProduct.js";
import getUser from "./services/user/getUser.js";
import PaginatorElement from './components/paginator/PaginatorElement.js';
import getClients from "./services/clients/getClients.js";
import Login from "./login/login.js";
import quotationView from "./components/pages/quotationViewPage.js";

class App {
  constructor() {
    this.quotation = document.querySelector('#quotation');
    this.quotationNew = document.querySelector('#quotationew');
  }

  async initialize() {
    document.addEventListener('DOMContentLoaded', async () => {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      const uid = searchParams.get('uid') || '23';
      const resQueryUser = await getUser(uid);
      localStorage.setItem('rol', resQueryUser.rol);
      const login = new Login();
      login.setHash(uid);
      if (this.quotation) {
        const quotationContentList = this.quotation.querySelector('#quotation--content--list');
        quotationContentList.insertAdjacentHTML('afterbegin', '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">');
        const resQueryAdvisors = await getAdvisors();
        const spinner = this.quotation.querySelector('#quotation--content--list .quotation--loading');
        spinner.remove();
        const btn_ = document.querySelector('.quotation--btn__add');
        btn_.setAttribute('href', '/index-q.html?uid=' + resQueryUser.id);

        if(resQueryUser.rol === "advisors") {
          const paginatorElement = new PaginatorElement(' ')
          paginatorElement.renderPaginator()
        } else {
          const quotationLeft = document.querySelector(".quotation .quotation--container__action");
          quotationLeft.classList.add("d-none");
          const paginatorElement = new PaginatorElement(resQueryUser.firstName);
          paginatorElement.renderPaginator()
        }

        const getAdvisor = () => {
          if (resQueryAdvisors) {
            selectAdvisors(resQueryAdvisors);
          }
        };
        getAdvisor();
      }

      if (this.quotationNew) {
        const btnBack_ = document.querySelector('#quotationew--back')
        btnBack_.setAttribute('href', '/index.html?uid=' + resQueryUser.id);
        const sliderProducts = this.quotationNew.querySelector('.slider--productos .slider--content');
        sliderProducts.insertAdjacentHTML('afterbegin', '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">');
        const resQueryProducts = await getProduct();
        const resQueryClients = await getClients();
        const spinnerP = this.quotationNew.querySelector('.slider--productos .quotation--loading');
        spinnerP.remove();

        const getDataQuotationNew = () => {
          quotationNewPage(this.quotationNew, resQueryUser, resQueryProducts, resQueryClients);
        };
        getDataQuotationNew();
      }

      await quotationView()
    });
  }
}

const app = new App();
app.initialize();
