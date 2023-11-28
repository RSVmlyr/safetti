import statusQuotationS from "../services/statusQuotation/statusQuotation.js"
import nodeNotification from "../helpers/nodeNotification.js";
import validationQuotation from "../services/validation/validationQuotation.js";

const validarFormulario = (mymodal) => {
  switch (mymodal.id) {
    case 'modal-file':
      const imagen = mymodal.querySelector('#imagen').value;
      const details = mymodal.querySelector('#details').value;
      if (imagen === '') {
        return {
          value: false,
          msg: 'Por favor, completa el campo imagen antes de enviar el formulario.'
        };
      }
      return {value: true};

    default:
      const number = mymodal.querySelector("#number");
      const numberValue = number.value;
      if (numberValue === '') {
        return {
          value: false,
          msg: 'Por favor, completa el campo porcentaje antes de enviar el formulario.'
        };
      }
      if (isNaN(numberValue) || numberValue < 0 || numberValue > 100) {
        return {
          value: false,
          msg: 'Por favor, ingresa un número válido en el rango de 0 a 100.',
        };
      }
      return {
        value: true,
        numberValue: numberValue
      };
  }
}

const sendSatus = (Qid, status, userId, advance) => {
  nodeNotification("Cambiando el estado de la cotización")
  const data = statusQuotationS( Qid, status, userId, advance )
}

const modalApproval = (quotation, modal, open ) => {
  const mymodal = quotation.querySelector(modal);
  if (mymodal) {
    const closeModal = mymodal.querySelector("#closeModalBtn");
    const openModal = quotation.querySelector(open);
    const modalButtonSend = mymodal.querySelector("#send-modal")
    const checkboxadvance = mymodal.querySelector("#checkboxadvance");
    let Qid = ""
    let userId = localStorage.getItem('current')

    if(openModal) {
      openModal.addEventListener("click", function (e) {
        modalButtonSend.disabled = false
        Qid = openModal.dataset.cotid
        e.preventDefault();
        mymodal.classList.remove("hidden");
      })
    }
    closeModal.addEventListener("click", function () {
      mymodal.classList.add("hidden");
    });
    if(checkboxadvance) {
      checkboxadvance.addEventListener("input", function () {
        const number = mymodal.querySelector("#number");
        const contentParent = number.closest('.modal__form--content');
        number.value = 0
        if(this.checked) {
          contentParent.classList.add('d-none');
        } else {
          contentParent.classList.remove("d-none")
        }
      })
    }
    modalButtonSend.addEventListener("click", function (e) {
      e.preventDefault()
      const valueImage = mymodal.querySelector('.modal__input').files[0]
      const validate = validarFormulario(mymodal)
      const msgerror = mymodal.querySelector(".modal__form--error")
      if(!validate.value) {
        msgerror.classList.remove("d-none")
        msgerror.textContent = validate.msg
      } else {
        msgerror.classList.add("d-none")
        msgerror.textContent = validate.value
        if (mymodal.id === 'modal-file') {
          const status = 2
          validationQuotation(Qid, status, userId, valueImage)
          console.log(valueImage);
        } else {
          const advance = validate.numberValue
          const status = 4
          modalButtonSend.disabled = true
          openModal.classList.add("loading")
          closeModal.click()
          sendSatus(Qid, status, userId, advance)
        }
      }
    })
  }
}
export default modalApproval;
