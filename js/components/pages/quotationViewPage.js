import getQuotation from "../../services/quotation/getIdQuotation.js";
import header from "../templates/header.js";
import quotationView from "../quotationView/quotationView.js";
import getUser from "../../services/user/getUser.js";

const quotationViewPage = async () => {
  const quotatioview = document.querySelector("#quotatioview");
  
  if (quotatioview) {
    const btnBack_ = document.querySelector("#quotationew--back");
    btnBack_.setAttribute("href", "/index.html?uid=" + localStorage.getItem('current'));
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const quotation = await getQuotation(id);
    

    header(quotatioview, quotation);
    quotationView(quotatioview, quotation, quotation.scenarios);
  }
};

quotationViewPage();
export default quotationViewPage;
