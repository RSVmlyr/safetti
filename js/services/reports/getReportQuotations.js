import Fetch from "../Fetch.js"

const getReportQuotations = async (startDate, endDate) => {
    try {
        const response = await Fetch.get(`/api/report/quotations/${startDate}/${endDate}`);

        if (response.status === "error") {
            console.error(response.message);
        }

        return response;
    }
    catch(error) {
        console.error('Error al consultar el reporte', error);
    }
}

export default getReportQuotations;