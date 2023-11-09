import nodeNotification from "../../helpers/nodeNotification.js";

const sendEmail = async (nodo, url, not) => {
  try {
    const urlQuerySendEmail = url
    const reqQuerySendEmail = await fetch(urlQuerySendEmail)
    console.log('R', reqQuerySendEmail);

    if (reqQuerySendEmail.status === 200) {
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
        if(not.classList.contains('quotation--info__white')) {
          src = '../../img/icon/icon-email-white.svg'
        }
        not.nextElementSibling.src = src;
        not.nextElementSibling.style.display = "block";

      }, 4000);
      nodeNotification('Correo enviado con éxito')
    }
    
  }
  
  catch(error) {
    console.log('No se pudo enviar el correo', error);
  }
}

export default sendEmail