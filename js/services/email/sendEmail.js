const sendEmail = async (nodo, url) => {
  try {
    const urlQuerySendEmail = 'https://safetticustom.azurewebsites.net/api/Product'
    const reqQuerySendEmail = await fetch(urlQuerySendEmail)
    // console.log('Status Service SendEmail', reqQuerySendEmail);
    const resQuerySendEmail = await reqQuerySendEmail.json()
    // console.log('Array Service SendEmail', resQuerySendEmail);

    if (reqQuerySendEmail.status === 200) {
      let checkemail = document.createElement('img');
      checkemail.classList.add('quotation--email__send');
      checkemail.src = '../../img/icon/icon-check.png';
      nodo.insertAdjacentElement('afterbegin', checkemail);
      const quotationEmailSend = document.querySelector('.quotation--email__send')
      setTimeout(() => {
        quotationEmailSend.remove()
      }, 3000);
    }
    return resQuerySendEmail;
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default sendEmail