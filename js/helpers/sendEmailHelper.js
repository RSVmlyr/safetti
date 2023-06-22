import sendEmail from "../services/email/sendEmail.js";

const sendEmailHelper = (event, nodo) => {

  nodo.addEventListener('click', (e) => {
    e.preventDefault()
    nodo.textContent = 'Enviando...'
    let urlEmail = event.getAttribute('href')
    sendEmail(event, urlEmail, nodo)
  })

}

export default sendEmailHelper