const searchProduct = (quotationNew) => {
  const qnSearchProduct = quotationNew.querySelector('#qnsearchproduct')
  const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')

  qnSearchProduct.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    sliderProductsRows.forEach(row => {
      const cardTitle = row.querySelector('.card--title');
      const rowText = cardTitle.textContent.toLowerCase();

      if (rowText.includes(searchTerm)) {
        row.style.display = 'block';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

export default searchProduct;