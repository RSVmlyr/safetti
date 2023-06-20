import getProductPrices from '../../services/product/getProductPrices.js'
class QuotationCalculation extends HTMLElement {
  constructor() {
    super();
    this.getPriceInRange()
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

      // const newData = {};
      // Object.keys(prices).forEach(key => {
      //   const newKey = key.replace(/^p/, ''); // Eliminar la letra 'p' del inicio de la clave
      //   newData[newKey] = prices[key];
      // });

      // console.log('p', newData);

      // Object.keys(newData).forEach(key => {
      //   if (typeof newData[key] !== "number") {
      //     delete newData[key];
      //   }
      // })
      // console.log('num', newData);

      // const keys = Object.keys(prices);
      // const lastKey = keys[keys.length - 1];
      // console.log(lastKey);

      console.log('P', prices);
      console.log('V', value);

      // Verificar si el valor es menor que el primer precio
      // if (value < parseFloat(prices[keys[0]])) {
      //   return null;
      // }
      
      // // Verificar si el valor es mayor que el último precio
      // if (value > parseFloat(prices[lastKey])) {
      //   return null;
      // }
      
      // // Obtener el valor correspondiente al rango
      // for (let i = 0; i < keys.length - 1; i++) {
      //   const currentPrice = parseFloat(prices[keys[i]]);
      //   const nextPrice = parseFloat(prices[keys[i + 1]]);
        
      //   if (value >= currentPrice && value < nextPrice) {
      //     return prices[keys[i]];
      //   }
      // }

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

      products.forEach(product => {

        const priceInRange = this.getPriceInRange(prices, product.quantity);
        
        let PRange = priceInRange
        let numPrange = PRange.replace(",", ".");

        const row = document.createElement('div');
        row.classList.add('scenary--row__table');
        row.innerHTML = `
          <div class="scenary--row">${product.productName}</div>
          <div class="scenary--row">${product.selectedMoldeCode}</div>
          <div class="scenary--row">${numPrange}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row">${parseFloat((parseFloat(numPrange) * product.quantity).toFixed(2))} </div>
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
