import getQuotation from "../services/quotation/getIdQuotation.js";

const cloneScenery = async (cotId) => {
    try {
        const quotation = await getQuotation(cotId);
        const selectedScenario = quotation.scenarios.filter(item => item.selected === true);
        const products = selectedScenario['0'].products
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
            scenarioId: selectedScenario['0'].id,
            data: filterData,
            moneda: moneda,
            discountPercent: selectedScenario["0"].discountPercent,
            taxIVA: selectedScenario["0"].taxIVAApplied > 0
        };
    } catch (error) {
        console.error("Error al clonar la cotización:", error);
        throw error;
    }
};


export default cloneScenery;