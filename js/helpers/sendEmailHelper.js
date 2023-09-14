import sendEmail from "../services/email/sendEmail.js";
import nodeNotification from "./nodeNotification.js";

const sendEmailHelper = (event, nodo) => {
  event.addEventListener('click', (ev) => {
    ev.preventDefault()
    if(ev.target === nodo) {
      nodo.textContent = 'Enviando...'
      nodo.nextElementSibling.src = '../../img/icon/icon-spinner.gif'
      nodo.classList.add('loading')
      let urlEmail = event.getAttribute('href')
      sendEmail(event, urlEmail, nodo)
    }
  })
  
}

export default sendEmailHelper