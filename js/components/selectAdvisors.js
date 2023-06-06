const selectAdvisors = (resQueryAdvisors) => {
  console.log(resQueryAdvisors);
  llenarSelect(resQueryAdvisors);
}

function llenarSelect(arr) {
  const idSelectAdvisors = quotation.querySelector('#advisors')

  // Order
  arr.sort((a, b) => a.fullName.localeCompare(b.fullName));
  // Order

  arr.forEach((item) => {
    console.log(item.fullName);
    const optionElement = document.createElement('option');
    optionElement.value = item.fullName;
    optionElement.textContent = item.fullName;
    idSelectAdvisors.appendChild(optionElement);
  });
}

export default selectAdvisors;