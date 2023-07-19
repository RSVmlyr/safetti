const quotationView = (node, infoQuotation) => {
  console.log(infoQuotation);

  const container = document.createElement("div");
  container.classList.add("quotatioview--container");
  const table = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Molde</th>
                <th>Valor unitario</th>
                <th>Cantidad</th>
                <th>Sub Total</th>
            </tr>
        </thead>
      `;

  infoQuotation.forEach((element) => {
    let productos = "";
    console.log(element);
    element.products.forEach((producto) => {
      productos += `
            <tbody>
                <tr>
                <td>${producto.productName}</td>
                <td>${producto.selectedMoldeCode}</td>
                <td>$ ${producto.unitPrice.toLocaleString()}</td>
                <td>${producto.quantity}</td>
                <td>$ ${producto.linePrice.toLocaleString()}</td>
                </tr>
            </tbody>
        `;
    });
    container.innerHTML += `
            <div class="quotatioview__section">
            <h2 class="quotatioview__title">${element.name}</h2>
            <table class="quotatioview__table">
                ${table}
                ${productos}
            </table>
            <table class="quotatioview__table table__descuento">
            <hr>
            <thead>
                <tr>
                    <th>Descuento</th>
                    <th>Envio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>$ ${element.discountPercent.toLocaleString()}</td>
                    <td>$ 0</td>
                    <td>$ ${element.total.toLocaleString()}</td>
                </tr>
            </tbody>
            </table>
            <hr>
            <table class="quotatioview__table table__total">
            <thead>
                <tr>
                    <th>Total con IVA</th>
                    <th>$ ${element.subtotalWithTaxIVA.toLocaleString()}</th>
                </tr>
            </thead>
            </table>
            </div>
      `;
  });
  node.appendChild(container);
};

export default quotationView;
