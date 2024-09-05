import selectAdvisors from "./components/quotation/selectAdvisors.js";
import quotationNewPage from "./components/quotationNew/quotationNew.js";
import getAdvisors from "./services/advisors/getAdvisors.js";
import getProduct from "./services/product/getProduct.js";
import getUser from "./services/user/getUser.js";
import PaginatorElement from './components/paginator/PaginatorElement.js';
import getClients from "./services/clients/getClients.js";
import Login from "./login/login.js";
import quotationView from "./components/pages/quotationViewPage.js";
import "./components/slider/slider.js";

class App {
  constructor() {
    this.quotation = document.querySelector('#quotation');
    this.quotationNew = document.querySelector('#quotationew');
  }

  async initialize() {
    const loadingImage = '<img class="quotation--loading qnimage--auto" src="../img/icon/icon-spinner.gif">';
    if (this.quotation){
      const quotationContentList = this.quotation.querySelector('#quotation--content--list');
      quotationContentList.insertAdjacentHTML('afterbegin', loadingImage);
    }
    if (this.quotationNew){
      const sliderProducts = this.quotationNew.querySelector('.slider--productos .slider--content');
      sliderProducts.insertAdjacentHTML('afterbegin', loadingImage);
    }

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const uid = searchParams.get('uid') || '94'; //27
    const token = searchParams.get('token') || '';
    const resQueryUser = await getUser(uid);
    const login = new Login();
    login.setHash(uid, resQueryUser.rol);
    localStorage.setItem('rol', resQueryUser.rol);

    if (this.quotation) {
      const scenarioPattern = /scenario-\d+/;

      for (const key of Object.keys(localStorage)) {
        if (scenarioPattern.test(key)) {
          localStorage.removeItem(key);
        }
      }

      const btn_ = document.querySelector('.quotation--btn__add');
      btn_.setAttribute('href', `/index-q.html?uid=${resQueryUser.id}&token=${token}`);

      if(resQueryUser.rol === "advisors" || resQueryUser.isAdminSafetti === true) {

        const resQueryAdvisors = await getAdvisors();
        if (resQueryAdvisors) {
          selectAdvisors(resQueryAdvisors);
        }

        const advisorSelect = document.querySelector(".quotation .quotation--container__action #advisors");
        if(resQueryUser.rol === "advisors" && resQueryUser.isAdminSafetti === false) {
          advisorSelect.value = resQueryUser.id;
        }

        const quotationLeft = document.querySelector(".quotation .quotation--container__action");
        quotationLeft.classList.remove("d-none");

        if(resQueryUser.isAdminSafetti === true){
          advisorSelect.classList.remove("d-none");
        }
      }

      const paginatorElement = new PaginatorElement(' ');
      await paginatorElement.renderPaginator();

      const spinner = this.quotation.querySelector('#quotation--content--list .quotation--loading');
      spinner.remove();
    }

    if (this.quotationNew) {
      const btnBack_ = document.querySelector('#quotationew--back')
      btnBack_.setAttribute('href', `/index.html?uid=${resQueryUser.id}&token=${token}`);
      const resQueryProducts = await getProduct();
      const resQueryClients = await getClients();
      quotationNewPage(this.quotationNew, resQueryUser, resQueryProducts, resQueryClients);
      const spinnerP = this.quotationNew.querySelector('.slider--productos .quotation--loading');
      if(spinnerP)
        spinnerP.remove();
    }

    await quotationView();
  }

}

const app = new App();
app.initialize();
