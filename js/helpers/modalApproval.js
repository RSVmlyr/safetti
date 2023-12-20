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
      } else {
        const file = document.getElementById('imagen');
        const fileSize = file.files[0].size; // Tamaño en bytes
        const maxSizeInBytes = 2 * 1024 * 1024;

        if(fileSize> maxSizeInBytes){
          return {
            value: false,
            msg: 'El archivo supera el tamaño permitido (2MB).'
          };
        }
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

const modalApproval = (quotation, modal, open, paymentSupportFilePath, isPaymentSupportPDF ) => {
  const mymodal = quotation.querySelector(modal);

  if (mymodal) {
    const closeModal = mymodal.querySelector("#closeModalBtn");
    const openModal = quotation.querySelector(open);
    const modalButtonSend = mymodal.querySelector("#send-modal")
    const checkboxadvance = mymodal.querySelector("#checkboxadvance");
    let Qid = ""
    let userId = localStorage.getItem('current')
    let ispdf = ""
    let url = ""

    if(openModal) {
      openModal.addEventListener("click", function (e) {
        modalButtonSend.disabled = false
        Qid = openModal.dataset.cotid
        ispdf = openModal.dataset.ispdf
        url = openModal.dataset.url
        e.preventDefault();
        mymodal.classList.remove("hidden");
        const modalFormContentImg = mymodal.querySelector('.modal__form--content .image');
        const download = mymodal.querySelector(".modal__form--content .image-gallery__download")
        const modalFormContent = mymodal.querySelector('.modal__form--content');

        if(modalFormContentImg){
          modalFormContentImg.remove()
          modalFormContent.classList.remove("true");
          modalFormContent.classList.remove("false");
        }
        if (mymodal.id === "modal-approve-support"  ) { 
          const imageElement = document.createElement('img');
          modalFormContent.classList.add(ispdf);
          download.href = url;
          imageElement.src = url;
          imageElement.classList.add("image")
          modalFormContent.appendChild(imageElement);
        }
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
      if(mymodal.id === 'modal-approve-support') {
        closeModal.click()
        const status = 2
        if (Qid !== '') {
          validationQuotation(Qid, status, userId, null)
        }
        return
      }
      const validate = validarFormulario(mymodal)
      const msgerror = mymodal.querySelector(".modal__form--error")
      if(!validate.value) {
        msgerror.classList.remove("d-none")
        msgerror.textContent = validate.msg
      } else {
        modalButtonSend.disabled = true
        openModal.classList.add("loading")
        closeModal.click()
        msgerror.classList.add("d-none")
        msgerror.textContent = validate.value

        if (mymodal.id === 'modal-file') {
          const valueImage = mymodal.querySelector('.modal__input').files[0]
          const status = 2
          if (Qid !== '') {
            validationQuotation(Qid, status, userId, valueImage)
          }
        } else {
          const advance = validate.numberValue
          const status = 4
          if (Qid !== '') {
            sendSatus(Qid, status, userId, advance)
          }
        }
      }
    })
  }
}
export default modalApproval;
