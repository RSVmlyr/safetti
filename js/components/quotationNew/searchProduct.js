const searchProduct = (quotationNew) => {
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
}

export default searchProduct;