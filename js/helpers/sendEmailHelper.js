import { getTranslation } from "../lang.js";
import sendEmail from "../services/email/sendEmail.js";

const sendEmailHelper = (event, nodo) => {
  event.addEventListener('click', async (ev) => {
    ev.preventDefault()
    if(ev.target === nodo) {
      nodo.textContent = await getTranslation("sending")
      nodo.nextElementSibling.src = '../../img/icon/icon-spinner.gif'
      nodo.classList.add('loading')
      const urlEmail = event.getAttribute('href')
      sendEmail(event, urlEmail, nodo)
    }
  })
}

export default sendEmailHelper