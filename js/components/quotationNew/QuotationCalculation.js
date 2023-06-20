import getProductPrices from '../../services/product/getProductPrices.js'
class QuotationCalculation extends HTMLElement {
  constructor() {
    super();
    this.getPriceInRange()
    this.add()
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
  getPriceInRange = (prices, value) => {
    if(prices !=undefined) {
      console.log('P', prices);
      console.log('V', value);
      if ( value <= 5) {
        return prices["p" + value];
      }

      if ( value > 5 && value <= 10) {
        return prices["p10"];
      }

      if ( value > 10 && value <= 15) {
        return prices["p15"];
      }

      if ( value > 15 && value <= 20) {
        return prices["p20"];
      }

      if ( value > 20 && value <= 50) {
        return prices["p50"];
      }

      if ( value > 50 && value <= 100) {
        return prices["p100"];
      }

      if ( value > 100) {
        return prices["p300"];
      }
    
    }
  };
  
  createRow(products, resQueryUser) {
    const getPrices = async () => {
      const prices = await getProductPrices(19, resQueryUser.currency, resQueryUser.rol);
      console.log(prices);
      console.log('build', products);
      let count = 0

      products.forEach(product => {
        const priceInRange = this.getPriceInRange(prices, product.quantity);
        let PRange = priceInRange
        let numPrange = PRange.replace(",", ".");
        const subtotal =  parseFloat((parseFloat(numPrange) * product.quantity).toFixed(2)) 
        const row = document.createElement('div');
        row.classList.add('scenary--row__table');
        row.innerHTML = `
          <div class="scenary--row">${product.productName}</div>
          <div class="scenary--row">${product.selectedMoldeCode}</div>
          <div class="scenary--row">${numPrange}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">${subtotal} </div>
        `;
        document.querySelector('.quotationew--calculation__body').appendChild(row);
      });
      const subtotal = document.querySelectorAll('.subtotal')
      console.log('subtotal', subtotal);
      subtotal.forEach(element => {
        const valor = parseInt(element.textContent)
        console.log(valor);
        count += valor
      });
      this.add(count)
    };
    getPrices();
  }

  add(valor){
    const c =  document.querySelector('.quotation--btn__add')
    c.textContent = valor
  }

  connectedCallback() {
    const btniva = document.querySelector()
  
  }
}
customElements.define('quotation-calculation', QuotationCalculation);
export default QuotationCalculation;