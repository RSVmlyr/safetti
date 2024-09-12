import dateFormat from "../../helpers/dateFormat.js";
import downloadPdfHelper from "../../helpers/downloadPdfHelper.js";
import liteStatusQuotation from "../../helpers/liteStatusQuotation.js";
import sendEmailHelper from "../../helpers/sendEmailHelper.js";
import { loadTranslations } from "../../lang.js";

const header = async (node, infoQuotation) => {
  const {
    advisorName,
    clientName,
    createdAt,
    currency,
    updatedAt,
    leadClient,
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
        <span id="qndate" class="quotation--info__white"><span data-tkey="creation"></span>: ${dateCreat} </span>
        <span id="qndate" class="quotation--info__white"><span data-tkey="last_update"></span>: ${dateUpdate} </span>
        <span id="qnclient" class="quotation--info__white"><span data-tkey="client"></span>: ${clientName}</span>
        <span id="qnadvisor" class="quotation--info__white"><span data-tkey="advisor"></span>: ${advisorName} </span>
        <span id="qncurrency" class="quotation--info__white" data-currency="${currency}"><span data-tkey="currency"></span>: ${currency}</span>
        ${
          leadClient ?
            `<span id="qndate" class="quotation--info__white"><span data-tkey="email"></span>: ${leadClient.email} </span>
            <span id="qndate" class="quotation--info__white"><span data-tkey="name"></span>: ${leadClient.fullName} </span>
            <span id="qnclient" class="quotation--info__white"><span data-tkey="cell_phone"></span>: ${leadClient.phone}</span>`
          :
          ''
        }
    </div>
    <div class="region region--right">
        <a class="quotation--email" href="/api/Quotation/email/${currentUser}/${id}">
            <span id="qnemail" class="quotation--send--data quotation--info__white" data-tkey="send_email"></span>
            <img class="quotation--email__img" src="../../img/icon/icon-email-white.svg" loading="lazy" alt="Email" title="Email">
        </a>
        <a href="/api/Quotation/pdf/${id}" class="quotation--download">
            <span class="quotation--generate--pdf quotation--info__white" data-tkey="generate_pdf"></span>
            <img class="quotation--download__img" src="../../img/icon/icon-download-white.svg" loading="lazy" alt="Descargar" data-tkey="download" data-attr="title" title="">
        </a>
    </div>
    `;

  const textQuo = document.querySelector(".quotation--text");
  const status = document.querySelector(".region__status");

  if (textQuo && status) {
    textQuo.textContent = `${infoQuotation.name}`
    status.innerHTML = `
      <h3 class="region__status--code"><span data-tkey="number"></span> ${id}</h3>
      <h3 class="quotation--status ${liteStatusQuotation(statusid)}">${name}</h3>
    `
  }
  const firstChild = node.firstChild;
  node.insertBefore(header, firstChild);

  await loadTranslations();
  // Send Email
  const quotationEmail = document.querySelector('.quotation--email')
  const quotationSendData = document.querySelector('.quotation--send--data')
  sendEmailHelper(quotationEmail, quotationSendData)
  // Send Email

  const quotationDownload = document.querySelector('.quotation--download')
  const quotationGeneratePdf = document.querySelector('.quotation--generate--pdf')
  downloadPdfHelper(quotationDownload, quotationGeneratePdf)
};

export default header;
