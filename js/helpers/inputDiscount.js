
const inputDiscount = async (section, symbol) => {

  const rangeInput = section.querySelector('#rangeInput');
  const COP = value => currency(value, { symbol: "$ ", separator: ".", decimal:",", precision: 0 });
  const USD = value => currency(value, { symbol: "$ ", separator: ",", decimal:".", precision: 2 });
  const curr = value => symbol === "COP" ? COP(value) : USD(value);

  if(rangeInput) {
    rangeInput.addEventListener('input', (e) => {
      let discountPercentage = 0;

      if (e.target.value != "") {
        const maxValue = 10;
        let targetValue = parseInt(e.target.value);

        if(targetValue > maxValue){
          targetValue = maxValue;
          e.target.value = maxValue;
        }
        else if(targetValue < 0){
          targetValue = 0;
          e.target.value = 0
        }

        discountPercentage = targetValue;
      }
  
      const subtotalProductsElement = section.querySelector('.subtotal-products');
      const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber');
      const quotatioviewValueTotal = section.querySelector(".quotatioview__valueTotal")
      const quotatioview__withdiscount = section.querySelector(".quotatioview__withdiscount");
      const ivaProductsValue = section.querySelector(".iva__products-value")
      const quotatioviewIva = section.querySelector('.quotatioview--iva');
  
      // Valor Descuento
      const subtotalValue = curr(subtotalProductsElement.value) || curr(0);
      const discount = subtotalValue.multiply(discountPercentage / 100);
      quotatioviewDiscountValueNumber.value = discount.format();
      // Valor Descuento
  
      // Subtotal con Descuento
      let subDiscount = subtotalValue.subtract(discount);
      quotatioview__withdiscount.value = subDiscount.format();

      // IVA
      if(quotatioviewIva.checked && ivaProductsValue) {
        const calculatedIva = subDiscount.multiply(0.19);
        ivaProductsValue.value = calculatedIva.format();
        subDiscount = subDiscount.add(calculatedIva);
      }
      // IVA

      // Total
      quotatioviewValueTotal.value = subDiscount.format();
      // Total
    });
  }
  // Descuento
}

export default inputDiscount;