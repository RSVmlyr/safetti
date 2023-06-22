const sendEmail = async (nodo, url, not) => {
  try {
    const urlQuerySendEmail = url
    const reqQuerySendEmail = await fetch(urlQuerySendEmail)

    if (reqQuerySendEmail.status === 200) {
      not.textContent = 'Enviado'
      let checkemail = document.createElement('img');
      checkemail.classList.add('quotation--email__send');
      checkemail.src = '../../img/icon/icon-check.png';
      nodo.insertAdjacentElement('afterbegin', checkemail);
      const quotationEmailSend = document.querySelector('.quotation--email__send')
      setTimeout(() => {
        not.textContent = 'Enviar correo'
        quotationEmailSend.remove()
      }, 4000);
    }
    
  }
  
  catch(error) {
    console.log('No se pudo enviar el correo', error);
  }
}

export default sendEmail