const searchProduct = (quotationNew) => {

  // Nombre / referencia
  const qnSearchProduct = quotationNew.querySelector('#qnsearchproduct')
  const sliderProductsRow = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')

  qnSearchProduct.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRow.forEach(row => {
      const cardTitle = row.querySelector('.card--title');
      const cardReference = row.querySelector('.card--reference');
      const rowTitle = cardTitle.textContent.toLowerCase();
      const rowReference = cardReference.textContent.toLowerCase();

      if (rowTitle.includes(searchTerm) || rowReference.includes(searchTerm)) {
        if (row.style.display === 'none') {
          row.style.display = '';
        }
      } else {
        if (row.style.display !== 'none') {
          row.style.display = 'none';
        }
      }
    });
  });

  // Deporte
  const qnCuentos = quotationNew.querySelector('#qncuentos')

  qnCuentos.addEventListener('change', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRow.forEach(row => {
      const cardCuento = row.querySelector('.card--cuento')
      const rowCuento = cardCuento.textContent.toLowerCase();

      if (rowCuento.includes(searchTerm)) {
        if (row.style.display === 'none') {
          row.style.display = '';
        }
      } else {
        if (row.style.display !== 'none') {
          row.style.display = 'none';
        }
      }
    });
  })
  
  
  // Prenda
  const qnTiposPrenda = quotationNew.querySelector('#qntiposprenda')

  qnTiposPrenda.addEventListener('change', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRow.forEach(row => {
      const cardGarment = row.querySelector('.card--garment')
      const rowGarment = cardGarment.textContent.toLowerCase();

      if (rowGarment.includes(searchTerm)) {
        if (row.style.display === 'none') {
          row.style.display = '';
        }
      } else {
        if (row.style.display !== 'none') {
          row.style.display = 'none';
        }
      }
    });
  })

  // Clasificación
  const qnClasificaciones = quotationNew.querySelector('#qnclasificaciones')

  qnClasificaciones.addEventListener('change', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRow.forEach(row => {
      const cardClassification = row.querySelector('.card--classification')
      const rowClassification = cardClassification.textContent.toLowerCase();

      if (rowClassification.includes(searchTerm)) {
        if (row.style.display === 'none') {
          row.style.display = '';
        }
      } else {
        if (row.style.display !== 'none') {
          row.style.display = 'none';
        }
      }
    });
  })

  // Fit
  const qnGarmentFit = quotationNew.querySelector('#qnfitprenda')

  qnGarmentFit.addEventListener('change', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRow.forEach(row => {
      const cardGarmentFit = row.querySelector('.card--garmentfit')
      const rowCardGarmentFit = cardGarmentFit.textContent.toLowerCase();

      if (rowCardGarmentFit.includes(searchTerm)) {
        if (row.style.display === 'none') {
          row.style.display = '';
        }
      } else {
        if (row.style.display !== 'none') {
          row.style.display = 'none';
        }
      }
    });
  })




}

export default searchProduct;