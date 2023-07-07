import getQuotation from "../../services/quotation/getIdQuotation.js";
import header from "../templates/header.js";
import quotationView from "../quotationView/quotationView.js";

const quotationViewPage = async () => {
  const quotatioview = document.querySelector("#quotatioview");
  if (quotatioview) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const quotation = await getQuotation(id);
    console.log(quotation);

    header(quotatioview, quotation);
    quotationView(quotatioview, quotation.scenarios)
  }
};

quotationViewPage()
export default quotationViewPage;
