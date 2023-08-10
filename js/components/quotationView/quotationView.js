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
            <div class="quotatioview__edit quotation--btn__new">Editar</div>
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
                    <th></th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="quotatioview__discount">$ ${element.discountPercent.toLocaleString()}</div>
                    </td>
                    <td></td>
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

    const quotatioviewContainerSection = document.querySelectorAll('.quotatioview__section')
    quotatioviewContainerSection.forEach(section => {
        const quotatioviewEdit = section.querySelector('.quotatioview__edit')
        const quotatioviewDiscount = section.querySelector('.quotatioview__discount')
        const inputEdit = `
        $ <input type="number" id="rangeInput" class="rangeInput" name="rangeInput" min="0" max="10" step="1">
        `
        const btnSave = `
        <div class="quotation--btn__save quotation--btn__new">Guardar</div>
        `;
        quotatioviewEdit.addEventListener('click', () => {
            quotatioviewDiscount.style.display = 'none';
            quotatioviewDiscount.insertAdjacentHTML('afterend', inputEdit)
            const rangeInput = section.querySelector('.rangeInput')

            quotatioviewEdit.insertAdjacentHTML('afterend', btnSave)
            const precioConDolar = quotatioviewDiscount.textContent;
            const precioSinDolar = precioConDolar.replace('$ ', '');
            rangeInput.value = precioSinDolar
        })
        const quotationBtnSave = section.querySelector('.quotation--btn__save')
        if (quotationBtnSave) {
            const rangeInput = section.querySelector('.rangeInput')
            quotatioviewDiscount.value = rangeInput.value
        }
    });

};

export default quotationView;
