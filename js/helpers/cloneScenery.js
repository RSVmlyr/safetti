import getQuotation from "../services/quotation/getIdQuotation.js";
import ExpiringLocalStorage from '../components/localStore/ExpiringLocalStorage.js'

const cloneScenery = async (cotId) => {
    try {
        const quotation = await getQuotation(cotId);
        const products = quotation.scenarios['7'].products;
        const moneda = quotation.currency;
        const filterData = [];

        for (let i = 0; i < products.length; i++) {
            const obj = products[i];
            const newObj = {
                ...obj,
                "id": obj.product
            };
            filterData.push(newObj);
        }

        return {
            data: filterData,
            moneda: moneda
        };
    } catch (error) {
        console.error("Error al clonar la cotización:", error);
        throw error;
    }
};


export default cloneScenery;