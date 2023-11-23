import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js";

const qnaddproduct = () => {
    const expiringLocalStorage = new ExpiringLocalStorage()
    const qnaddproducts = document.querySelectorAll(".qnaddproducts.add");
    const exist = localStorage.getItem('ClientFullName');
    const ClientFullName = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    const client = JSON.parse(ClientFullName)
    const quotationIva = document.querySelector('.quotation--iva')
    if(client) {
        if(client[0].currency === "COP") {
            quotationIva.checked = true
        } else {
            quotationIva.checked = false
        }
    }
    qnaddproducts.forEach((item) => {
        if (exist === null) {
            item.classList.add('d-none');
        } else {
            item.classList.remove('d-none');
        }
    });
}

export default qnaddproduct
