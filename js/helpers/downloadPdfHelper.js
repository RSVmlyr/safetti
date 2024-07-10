import Fetch from "../services/Fetch.js";

const downloadPdfHelper = (event, nodo) => {

  event.addEventListener('click', async (ev) => {
    ev.preventDefault()

    if(ev.target === nodo) {
      nodo.textContent = 'Generando...'
      nodo.nextElementSibling.src = '../../img/icon/icon-spinner.gif'
      nodo.classList.add('loading')
      const urlToDownload = event.getAttribute('href')
      const myBlob = await Fetch.getBlob(urlToDownload);
      const aElement = document.createElement("a");
      aElement.setAttribute("download", `Cotizacion-${urlToDownload.split("/").pop()}.pdf`);
      const href = URL.createObjectURL(myBlob);
      aElement.href = href;
      aElement.setAttribute("target", "_blank");
      aElement.click();
      URL.revokeObjectURL(href);

      nodo.textContent = 'Generar PDF'
      nodo.classList.remove('loading')
      let src = '../../img/icon/icon-download.svg';
      const scenary = event.closest('.scenary--data__scenary');

      if (nodo.classList.contains('quotation--info__white') || (scenary && !scenary.classList.contains('selected'))) {
        src = '../../img/icon/icon-download-white.svg';
      }
      nodo.nextElementSibling.src = src;
    }
  })
}

export default downloadPdfHelper