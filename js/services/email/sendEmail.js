import nodeNotification from "../../helpers/nodeNotification.js";
import Fetch from "../Fetch.js"

const sendEmail = async (nodo, url, not) => {
  try {
    const response = await Fetch.get(url)

    if (response.status !== "error") {
      not.textContent = 'Enviado'
      let checkemail = document.createElement('img');
      checkemail.classList.add('quotation--email__send');
      checkemail.src = '../../img/icon/icon-check.png';
      nodo.insertAdjacentElement('afterbegin', checkemail);
      const quotationEmailSend = document.querySelector('.quotation--email__send')
      not.nextElementSibling.style.display = "none";

      setTimeout(() => {
        let src = '../../img/icon/icon-email.svg'
        not.textContent = 'Enviar correo'
        not.classList.remove('loading')
        quotationEmailSend.remove()
        const scenary = nodo.closest('.scenary--data__scenary');

        if(not.classList.contains('quotation--info__white') || (scenary && !scenary.classList.contains('selected'))) {
          src = '../../img/icon/icon-email-white.svg'
        }
        not.nextElementSibling.src = src;
        not.nextElementSibling.style.display = "block";

      }, 4000);
      nodeNotification('Correo enviado con éxito')
    }
  }
  catch(error) {
    console.error('No se pudo enviar el correo', error);
  }
}

export default sendEmail