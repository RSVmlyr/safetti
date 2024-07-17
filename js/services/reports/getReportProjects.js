import Fetch from "../Fetch.js"

const getReportProjects = async (startDate, endDate) => {
    try {
        const response = await Fetch.get(`/api/report/projects/${startDate}/${endDate}`);

        if (response.status === "error") {
            console.error(response.message);
        }

        return response;
    }
    catch(error) {
        console.error('Error al consultar el reporte', error);
    }
}

export default getReportProjects;