const countryValidate = (nodeSelect, man, woman, string) => {
  if (man == null && woman == null) {
    const optionToRemove = string;
    const option = nodeSelect.querySelector(`option[value="${optionToRemove}"]`)
    option ? option.remove() : null
  }
}

export default countryValidate