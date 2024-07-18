import getQuotation from "../../services/quotation/getIdQuotation.js";
import header from "../templates/header.js";
import quotationView from "../quotationView/quotationView.js";

const quotationViewPage = async () => {
  const quotatioview = document.querySelector("#quotatioview");
  
  if (quotatioview) {
    const urlParams = new URLSearchParams(window.location.search);
    const btnBack_ = document.querySelector("#quotationew--back");
    const token = urlParams.get("token") || "";
    btnBack_.setAttribute("href", `/index.html?uid=${localStorage.getItem('current')}&token=${token}`);
    const id = urlParams.get("id");
    const quotation = await getQuotation(id);

    header(quotatioview, quotation);
    quotationView(quotatioview, quotation, quotation.scenarios);
  }
};

quotationViewPage();
export default quotationViewPage;
