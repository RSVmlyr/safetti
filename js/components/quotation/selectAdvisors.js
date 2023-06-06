import fillSelect from "../../helpers/fillSelect.js";

const selectAdvisors = (resQueryAdvisors) => {
  const idSelectAdvisors = quotation.querySelector('#advisors')
  fillSelect(idSelectAdvisors, resQueryAdvisors)
}

export default selectAdvisors;