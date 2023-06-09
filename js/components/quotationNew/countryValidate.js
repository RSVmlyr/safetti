const countryValidate = (nodeSelect, man = null, woman = null, unisex = null, junior = null, string = '') => {
  if (man == null && woman == null && unisex == null && junior == null) {
    const optionToRemove = string;
    const option = nodeSelect.querySelector(`option[value="${optionToRemove}"]`);
    option ? option.remove() : null;
  }
}

export default countryValidate;