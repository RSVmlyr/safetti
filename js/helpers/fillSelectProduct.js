import { getTranslation } from "../lang.js";

const fillSelectProduct = (nodeSelectId, arr, hideItemsByDefault) => {
  arr.forEach(async (item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item;
    optionElement.textContent = await getTranslation(item);

    if (hideItemsByDefault === true) {
      optionElement.hidden = true;
    }

    nodeSelectId.appendChild(optionElement);
  });
}

export default fillSelectProduct