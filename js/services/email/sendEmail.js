const sendEmail = async (nodo, url, not) => {
  try {
    const urlQuerySendEmail = url
    const reqQuerySendEmail = await fetch(urlQuerySendEmail)
    console.log('Status Service SendEmail', reqQuerySendEmail);
    // const resQuerySendEmail = await reqQuerySendEmail.json()
    // console.log('Array Service SendEmail', resQuerySendEmail);

    if (reqQuerySendEmail.status === 200) {
      not.textContent = 'Enviado'
      let checkemail = document.createElement('img');
      checkemail.classList.add('quotation--email__send');
      checkemail.src = '../../img/icon/icon-check.png';
      not.insertAdjacentElement('afterbegin', checkemail);
      const quotationEmailSend = document.querySelector('.quotation--email__send')
      setTimeout(() => {
        not.textContent = 'Enviar correo'
        quotationEmailSend.remove()
      }, 3000);
    }
    // return resQuerySendEmail;
    
  }
  
  catch(error) {
    console.log('No se pudo enviar el correo', error);
  }
}

export default sendEmail