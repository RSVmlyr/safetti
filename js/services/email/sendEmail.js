import nodeNotification from "../../helpers/nodeNotification.js";
import { getTranslation } from "../../lang.js";
import Fetch from "../Fetch.js"

const sendEmail = async (nodo, url, not) => {
  try {
    const response = await Fetch.get(url)

    if (response.status !== "error") {
      not.textContent = await getTranslation("sent")
      let checkemail = document.createElement('img');
      checkemail.classList.add('quotation--email__send');
      checkemail.src = '../../img/icon/icon-check.png';
      nodo.insertAdjacentElement('afterbegin', checkemail);
      const quotationEmailSend = document.querySelector('.quotation--email__send')
      not.nextElementSibling.style.display = "none";

      setTimeout(async () => {
        let src = '../../img/icon/icon-email.svg'
        not.textContent = await getTranslation("send_email")
        not.classList.remove('loading')
        quotationEmailSend.remove()
        const scenary = nodo.closest('.scenary--data__scenary');

        if(not.classList.contains('quotation--info__white') || (scenary && !scenary.classList.contains('selected'))) {
          src = '../../img/icon/icon-email-white.svg'
        }
        not.nextElementSibling.src = src;
        not.nextElementSibling.style.display = "block";

      }, 4000);
      nodeNotification(await getTranslation("email_sent"))
    }
  }
  catch(error) {
    console.error(await getTranslation("sending_email_error"), error);
  }
}

export default sendEmail