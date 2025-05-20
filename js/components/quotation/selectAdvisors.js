import fillSelect from "../../helpers/fillSelect.js";

const selectAdvisors = (resQueryAdvisors) => {
  let parentElement = document.querySelector('#quotation') || document.querySelector("#quotationew");
  const idSelectAdvisors = parentElement.querySelector('#advisors');
  if (idSelectAdvisors) {
    fillSelect(idSelectAdvisors, resQueryAdvisors);
  }
}

export default selectAdvisors;