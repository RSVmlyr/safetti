import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;

const getReportQuotations = async (startDate, endDate) => {
    try {
        const urlQuery = `${API_DEV}/api/report/quotations/${startDate}/${endDate}`;
        const reqQuery = await fetch(urlQuery);
        const resQuery = await reqQuery.json();

        if (reqQuery.status == 403) {
            console.error('Error 403');
        } else if (reqQuery.status == 500) {
            console.error('Error 500. Ocurrió un error al procesar su solicitud.');
        }
        return resQuery;
    }
    catch(error) {
        console.error('Error al consultar el reporte', error);
    }
}

export default getReportQuotations;