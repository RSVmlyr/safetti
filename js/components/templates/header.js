import dateFormat from "../../helpers/dateFormat.js";
import liteStatusQuotation from "../../helpers/liteStatusQuotation.js";

const header = (node, infoQuotation) => {
  const {
    advisorName,
    clientName,
    createdAt,
    currency,
    updatedAt,
    id,
    status: { name, id : statusid },
  } = infoQuotation;
  const dateCreat = dateFormat(createdAt);
  const dateUpdate = dateFormat(createdAt);
  const header = document.createElement("header");
  const currentUser = localStorage.getItem('current')

  header.classList.add("quotationew--header");
  header.innerHTML = `
    <div class="region region--left">
        <span id="qndate" class="quotation--info__white">Creación: ${dateCreat} </span>
        <span id="qndate" class="quotation--info__white">Última modificación: ${dateUpdate} </span>
        <span id="qnclient" class="quotation--info__white">Cliente: ${clientName}</span>
        <span id="qnadvisor" class="quotation--info__white">Asesor: ${advisorName} </span>
        <span id="qncurrency" class="quotation--info__white">Moneda: ${currency}</span>
    </div>
    <div class="region region--right">
        <a href="https://safetticustom.azurewebsites.net/api/Quotation/email/${currentUser}/${id}" class="quotation--email">
            <span id="qnemail" class="quotation--send--data quotation--info__white">Enviar correo</span>
            <img class="quotation--email__img" src="../../img/icon/icon-email-white.svg" loading="lazy"
                alt="Email" title="Email">
        </a>
        <a href="https://safetticustom.azurewebsites.net/api/Quotation/pdf/${id}" class="quotation--download">
            <span class="quotation--info__white">Generar PDF</span>
            <img class="quotation--download__img" src="../../img/icon/icon-download-white.svg" loading="lazy"
                alt="Descargar" title="Descargar">
        </a>
    </div>
    `;

  const textQuo = document.querySelector(".quotation--text");
  const status = document.querySelector(".region__status");

  if (textQuo && status) {
    textQuo.textContent = `${infoQuotation.name}`
    status.innerHTML = `
      <h3 class="region__status--code">Código ${id}</h3>
      <h3 class="quotation--status ${liteStatusQuotation(statusid)}">${name}</h3>
    `
  }
  const firstChild = node.firstChild;
  node.insertBefore(header, firstChild);
};

export default header;
