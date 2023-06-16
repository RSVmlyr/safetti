import getProductPrices from '../../services/product/getProductPrices.js'
class QuotationCalculation extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="quotation-calculation">
        <div class="quotationew--calculation__body">
          <div class="scenary--row__table">
            <div class="scenary--row">
              <span class="quotation--title__quo">Producto</span>
              <div id="qnproducts"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Molde</span>
              <div id="unitPrices"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Valor Unitario</span>
              <div id="prices"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Cantidad</span>
              <div id="quantities"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Subtotal</span>
              <div id="subtotals"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  createRow(products) {
    console.log(products);
    const getPrices = async () => {
      const prices = await getProductPrices(4, 'cop', 'partner');
      console.log(prices);
      products.forEach(product => {
        const row = document.createElement('div');
        row.classList.add('scenary--row__table');
        row.innerHTML = `
          <div class="scenary--row">${product.name}</div>
          <div class="scenary--row">${product.ref}</div>
          <div class="scenary--row">${product.colombiaJunior}</div>
          <div class="scenary--row">${product.cant}</div>
          <div class="scenary--row">${product.subtotal}</div>
        `;
        document.querySelector('.quotationew--calculation__body').appendChild(row);
      });
    };
    getPrices();
  }

  connectedCallback() {
  
  }
}
customElements.define('quotation-calculation', QuotationCalculation);
export default QuotationCalculation;
