import formatNumberWithPoints from "./formatNumberWithPoints.js";

const inputDiscount = async (section) => {

  const rangeInput = section.querySelector('#rangeInput');

  // Descuento

  if(rangeInput) {
    rangeInput.addEventListener('input', (e) => {

      if (e.target.value !== null) {
        // Realizar cálculos con el valor 0 si e.target.value está vacío
        let maxValue = 10
        const discountPercentage = parseInt(e.target.value) > maxValue ? e.target.value = maxValue : parseInt(e.target.value);
    
        const subtotalProductsElement = section.querySelector('.subtotal-products');
        const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber');
        const quotatioviewValueTotal = section.querySelector(".quotatioview__valueTotal")
        const quotatioview__withdiscount = section.querySelector(".quotatioview__withdiscount");
        const ivaProductsValue = section.querySelector(".iva__products-value")
    
        // Valor Descuento
        const subtotalValue = parseInt(subtotalProductsElement.value.replace(/\./g, '')) || 0;
        const discount = subtotalValue * discountPercentage / 100;
        quotatioviewDiscountValueNumber.value = formatNumberWithPoints(discount);
        // Valor Descuento
    
        // Subtotal con Descuento
        const subDiscount = subtotalValue - discount;
    
        // Asignar el valor al input solo si e.target.value no está vacío
        if (e.target.value.trim() !== '') {
          
          quotatioview__withdiscount.value = formatNumberWithPoints(subDiscount);
          console.log('wd', subDiscount);

        // IVA
        if(ivaProductsValue) {
          const ivaProductsValueFormat = quotatioview__withdiscount.value.replace(/\./g, '')
          const ivaProductsValueCalc = Math.floor((ivaProductsValueFormat * 19) / 100)
          console.log('a', ivaProductsValueCalc);
          ivaProductsValue.value = formatNumberWithPoints(ivaProductsValueCalc)
        }
        // IVA

        // Total
        const Total = parseInt(quotatioview__withdiscount.value.replace(/\./g, '')) + parseInt(ivaProductsValue.value.replace(/\./g, ''))
        quotatioviewValueTotal.value = formatNumberWithPoints(Total)
        // Total

        } else {
          quotatioviewDiscountValueNumber.value = 0
          quotatioview__withdiscount.value = subtotalProductsElement.value

          // IVA
          if(ivaProductsValue) {
            const ivaProductsValueFormat = quotatioview__withdiscount.value.replace(/\./g, '')
            const ivaProductsValueCalc = Math.floor((ivaProductsValueFormat * 19) / 100)
            ivaProductsValue.value = formatNumberWithPoints(ivaProductsValueCalc)
          }
          // IVA

          // Total
          const Total = parseInt(quotatioview__withdiscount.value.replace(/\./g, '')) + parseInt(ivaProductsValue.value.replace(/\./g, ''))
          quotatioviewValueTotal.value = formatNumberWithPoints(Total)
          // Total
        }

        // Subtotal con Descuento
      }
  
    })

  }

  // Descuento
}

export default inputDiscount
