import getReportProjects from "../../services/reports/getReportProjects.js";
import nodeNotification from "../../helpers/nodeNotification.js"
import loadingData from "../../helpers/loading.js";

const loading = () =>  {
    const quotationContentListContainer = document.querySelector('.card-body.report-container');
    const loadingDiv = loadingData(quotationContentListContainer);
    quotationContentListContainer.appendChild(loadingDiv);
}

const reportProjectsViewPage = async () => {
    const reportProjectsView = document.querySelector("#reportProjectsView");

    if (reportProjectsView) {
        let projectsTable = document.getElementById('datatable');
        const cardAfterEvent = document.querySelector('.card-after-event')
        cardAfterEvent.style.display = "none";
        let datatable = null;
        let chartEjecCOP = null;
        let chartTermCOP = null;
        let chartEjecUSD = null;
        let chartTermUSD = null;
        let chartArray = [chartEjecCOP, chartTermCOP, chartEjecUSD, chartTermUSD];

        // Obtener todas las pesta�as y el contenido de las pesta�as
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-pane');

        // Agregar un controlador de clic a cada pesta�a
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabContents.forEach((content) => {
                    content.classList.remove('active');
                });

                const tabId = tab.getAttribute('data-tab');

                document.getElementById(tabId).classList.add('active');

                tabs.forEach((t) => {
                    t.classList.remove('active');
                });

                tab.classList.add('active');
            });
        });

        const generateProjectReport = async () => {
            loading();
            const fromInput = document.getElementById("fromReport");
            const toInput = document.getElementById("toReport");

            const fromDateValue = fromInput.value.trim();
            const toDateValue = toInput.value.trim();
            if (fromDateValue === '' || toDateValue === '') {
                nodeNotification('Ambos campos de fecha son obligatorios');
                return;
            }
            const fromDate = new Date(fromDateValue);
            const toDate = new Date(toDateValue);
            if (fromDate > toDate) {
                nodeNotification('La fecha de inicio debe ser menor que la fecha de fin');
                return
            }

            const reportProjects = await getReportProjects(fromInput.value, toInput.value);
            try {
                document.querySelector('.loading-message').remove()
                cardAfterEvent.style.display = 'block'
                if (projectsTable) {

                    if (!datatable) {
                        datatable = new DataTable('#datatable', {
                            "searching": false,
                            "lengthChange": false,
                            "order": [],
                            language: {
                                info: 'P&aacute;gina _PAGE_ de _PAGES_',
                                "emptyTable": "No se encontraron registros",
                                "infoEmpty": "",
                                "paginate": {
                                    "first": "Primera",
                                    "last": "&Uacute;ltima",
                                    "next": "Siguiente",
                                    "previous": "Anterior"
                                },
                            }
                        });
                    }

                    datatable.clear().draw();
                    reportProjects.reportProjects.forEach(project => {
                        datatable.row.add([
                            project.id,
                            project.clientName,
                            project.advisorName,
                            project.status,
                            project.createdAt,
                            project.finalizeAt,
                            project.totalString,
                            project.currency
                        ]).draw();
                    });

                    projectsTable.style.display = "table";
                }

                const reportCOPEjec = reportProjects.reportCOP.find(el => el.statusName == "ejecucion");
                const reportCOPTerm = reportProjects.reportCOP.find(el => el.statusName == "Terminado");

                const reportUSDEjec = reportProjects.reportUSD.find(el => el.statusName == "ejecucion");
                const reportUSDTerm = reportProjects.reportUSD.find(el => el.statusName == "Terminado");

                const generatePieChart = async (data, canvasId, chartIndex, chartTitle) => {
                    let chartObject = chartArray[chartIndex];

                    if (chartObject) {
                        chartObject.destroy();
                        chartObject = null;
                    }

                    let canvasElement = document.getElementById(canvasId);

                    if (canvasElement) {
                        let context = canvasElement.getContext('2d');
                        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    }

                    if (data) {
                        chartObject = new Chart(canvasElement, {
                            type: 'pie',
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        position: 'bottom',
                                        display: true,
                                        text: chartTitle
                                    },
                                    subtitle: {
                                        position: 'bottom',
                                        display: true,
                                        text: 'Total: ' + data.statusTotal
                                    }
                                }
                            },
                            data: {
                                labels: data.advisorSales.map(row => row.advisorName),
                                datasets: [{
                                    label: 'Total',
                                    data: data.advisorSales.map(row => row.total)
                                }]
                            }
                        });
                    }

                    chartArray[chartIndex] = chartObject;
                }

                generatePieChart(reportCOPEjec, 'reportEjecCOP', 0, 'En ejecucion');
                generatePieChart(reportCOPTerm, 'reportTermCOP', 1, 'Terminados');

                generatePieChart(reportUSDEjec, 'reportEjecUSD', 3, 'En ejecucion');
                generatePieChart(reportUSDTerm, 'reportTermUSD', 4, 'Terminados');

            } catch (error) {
                console.error('Ocurrió un error al obtener el reporte de proyectos:', error);
                nodeNotification('Ocurrió un error al obtener el reporte de proyectos:');                
            }
        }

        const generateProjectReportFile = async (event) => {
            const fromInput = document.getElementById("fromReport");
            const toInput = document.getElementById("toReport");
            const urlQuery = `/api/report/projectsfile/${fromInput.value}/${toInput.value}`;
            const reqQuery = await fetch(urlQuery);
            const myBlob = await reqQuery.blob();
            const aElement = document.createElement("a");
            aElement.setAttribute("download", "ReporteProyectos.xlsx");
            const href = URL.createObjectURL(myBlob);
            aElement.href = href;
            aElement.setAttribute("target", "_blank");
            aElement.click();
            URL.revokeObjectURL(href);
        }

        const btnGenerar = document.querySelector('.btn-generar');

        if (btnGenerar) {
            btnGenerar.addEventListener('click', () => {
                generateProjectReport();
            });
        }

        const btnExportar = document.querySelector('.btn-exportar');

        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                generateProjectReportFile();
            });
        }
    }
};

reportProjectsViewPage();
export default reportProjectsViewPage;
