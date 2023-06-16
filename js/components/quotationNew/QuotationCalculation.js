class QuotationCalculation extends HTMLElement {
  constructor() {
    super();

    // Agregar el contenido HTML
    this.innerHTML = `
      <style>
        /* Estilos para el custom element */
        .quotation-calculation {
          /* Estilos del contenedor principal */
        }

        .scenary-row {
          /* Estilos de las filas de la tabla */
        }

        /* Otros estilos... */
      </style>

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
  
  createRow(product) {
    console.log(product);
    const qnProducts = this.querySelector('#qnproducts');
    const unitPrices = this.querySelector('#unitPrices');
    const prices = this.querySelector('#prices');
    const quantities = this.querySelector('#quantities');
    const subtotals = this.querySelector('#subtotals');
    
    //const productDetails = getProductDetails();
    const row = document.createElement('div');
    row.classList.add('scenary--row__table');
    row.innerHTML = `
      <div class="scenary--row">${product.name}</div>
      <div class="scenary--row">${product.molde}</div>
      <div class="scenary--row">${product.colombiaJunior}</div>
      <div class="scenary--row">${product.cantidad}</div>
      <div class="scenary--row">${product.subtotal}</div>
    `;
     // Agregar la fila a los contenedores correspondientes
     document.querySelector('.quotationew--calculation__body').appendChild(row);
   /*   unitPrices.appendChild(row.cloneNode(true));
     prices.appendChild(row.cloneNode(true));
     quantities.appendChild(row.cloneNode(true));
     subtotals.appendChild(row.cloneNode(true)); */
  }

  connectedCallback() {
  
  }
}
customElements.define('quotation-calculation', QuotationCalculation);
export default QuotationCalculation;
