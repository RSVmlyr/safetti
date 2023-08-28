import sendEmail from "../services/email/sendEmail.js";
import nodeNotification from "./nodeNotification.js";

const sendEmailHelper = (event, nodo) => {
  nodo.addEventListener('click', (e) => {
    e.preventDefault()
    nodeNotification('Enviando...')
    nodo.textContent = 'Enviando...'
    nodo.classList.add('loading')
    let urlEmail = event.getAttribute('href')
    sendEmail(event, urlEmail, nodo)
  })

}

export default sendEmailHelper