import getReportQuotations from "../../services/reports/getReportQuotations.js";
import nodeNotification from "../../helpers/nodeNotification.js"
import loadingData from "../../helpers/loading.js";
import Fetch from "../Fetch.js"

const loading = () =>  {
    const quotationContentListContainer = document.querySelector('.card-body.report-container');
    const loadingDiv = loadingData(quotationContentListContainer);
    quotationContentListContainer.appendChild(loadingDiv);
}

const reportQuotationsViewPage = async () => {
    const reportQuotationsView = document.querySelector("#reportQuotationsView");
  
    if (reportQuotationsView) {
        let cardPesos = document.querySelector('.card-pesos');
        cardPesos.style.display = "none";
        let cardDolares = document.querySelector('.card-dolares');
        cardDolares.style.display = "none";

        let productsTable = document.getElementById('datatable');
        productsTable.style.display = "none";
        const cardAfterEvent = document.querySelector('.card-after-event')
        cardAfterEvent.style.display = "none";

        let datatable = null;
        let chartSolicCOP = null;
        let chartPorConfirmarCOP = null;
        let chartValidarAnticipoCOP = null;
        let chartConfirmCOP = null;
        let chartCancelCOP = null;
        let chartSolicUSD = null;
        let chartPorConfirmarUSD = null;
        let chartValidarAnticipoUSD = null;
        let chartConfirmUSD = null;
        let chartCancelUSD = null;
        let chartArray = [chartSolicCOP, chartPorConfirmarCOP, chartValidarAnticipoCOP, chartConfirmCOP, chartCancelCOP,
            chartSolicUSD, chartPorConfirmarUSD, chartValidarAnticipoUSD, chartConfirmUSD, chartCancelUSD];

         // Obtener todas las pestañas y el contenido de las pestañas
         const tabs = document.querySelectorAll('.tab');
         const tabContents = document.querySelectorAll('.tab-pane');
 
         // Agregar un controlador de clic a cada pestaña
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

        const generateQuotationReport = async () => {
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

            const reportQuotations = await getReportQuotations(fromInput.value, toInput.value);
            try {
                document.querySelector('.loading-message').remove()
                cardAfterEvent.style.display = 'block'
                if (productsTable) {

                    if (!datatable) {
                        datatable = new DataTable('#datatable', {
                            "searching": false,
                            "lengthChange": false,
                            "order": [],
                            columnDefs: [
                                {
                                    targets: 3,
                                    className: 'dt-body-right'
                                }
                            ],
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

                    reportQuotations.reportQuotations.forEach(quote => {
                        datatable.row.add([
                            quote.id,
                            quote.clientName,
                            quote.advisorName,
                            quote.totalString,
                            quote.currency,
                            quote.origin,
                            quote.status,
                            quote.createdAt
                        ]).draw();
                    });

                    productsTable.style.display = "table";
                }

                const reportCOPSolic = reportQuotations.reportCOP.find(el => el.statusName == "Solicitada");
                const reportCOPPorConfirmar = reportQuotations.reportCOP.find(el => el.statusName == "Por Confirmar");
                const reportCOPValidarAnticipo = reportQuotations.reportCOP.find(el => el.statusName == "Validar Anticipo");
                const reportCOPConfirm = reportQuotations.reportCOP.find(el => el.statusName == "Confirmada");
                const reportCOPCancel = reportQuotations.reportCOP.find(el => el.statusName == "Cancelada");

                const reportUSDSolic = reportQuotations.reportUSD.find(el => el.statusName == "Solicitada");
                const reportUSDPorConfirmar = reportQuotations.reportUSD.find(el => el.statusName == "Por Confirmar");
                const reportUSDValidarAnticipo = reportQuotations.reportUSD.find(el => el.statusName == "Validar Anticipo");
                const reportUSDConfirm = reportQuotations.reportUSD.find(el => el.statusName == "Confirmada");
                const reportUSDCancel = reportQuotations.reportUSD.find(el => el.statusName == "Cancelada");

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
                                        text: 'Total: ' + data.statusTotal,
                                        padding: {
                                            top: 10
                                        },
                                        font: {
                                            weight: 'bold'
                                        }
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
                        document.getElementById(canvasId).parentElement.style.display = 'block';
                    }
                    else {
                        document.getElementById(canvasId).parentElement.style.display = 'none';
                    }

                    chartArray[chartIndex] = chartObject;
                }

                await generatePieChart(reportCOPSolic, 'reportSolicitadasCOP', 0, 'Solicitadas');
                await generatePieChart(reportCOPPorConfirmar, 'reportPorConfirmarCOP', 1, 'Por confirmar');
                await generatePieChart(reportCOPValidarAnticipo, 'reportValidarAnticipoCOP', 2, 'Validar anticipo');
                await generatePieChart(reportCOPConfirm, 'reportConfirmadasCOP', 3, 'Confirmadas');
                await generatePieChart(reportCOPCancel, 'reportCanceladasCOP', 4, 'Canceladas');

                await generatePieChart(reportUSDSolic, 'reportSolicitadasUSD', 5, 'Solicitadas');
                await generatePieChart(reportUSDPorConfirmar, 'reportPorConfirmarUSD', 6, 'Por confirmar');
                await generatePieChart(reportUSDValidarAnticipo, 'reportValidarAnticipoUSD', 7, 'Validar anticipo');
                await generatePieChart(reportUSDConfirm, 'reportConfirmadasUSD', 8, 'Confirmadas');
                await generatePieChart(reportUSDCancel, 'reportCanceladasUSD', 9, 'Canceladas');

                cardPesos.style.display = "block";
                cardDolares.style.display = "block";
            } catch (error) {
                console.error('Ocurrió un error al obtener el reporte de cotizaciones:', error);
                nodeNotification('Ocurrió un error al obtener el reporte de cotizaciones:');
            }
        }

        const generateQuotationReportFile = async (event) => {
            const fromInput = document.getElementById("fromReport");
            const toInput = document.getElementById("toReport");
            const myBlob = await Fetch.getBlob(`/api/report/quotationsfile/${fromInput.value}/${toInput.value}`);
            const aElement = document.createElement("a");
            aElement.setAttribute("download", "ReporteCotizaciones.xlsx");
            const href = URL.createObjectURL(myBlob);
            aElement.href = href;
            aElement.setAttribute("target", "_blank");
            aElement.click();
            URL.revokeObjectURL(href);
        }

        const btnGenerar = document.querySelector('.btn-generar');

        if (btnGenerar) {
            btnGenerar.addEventListener('click', () => {
                generateQuotationReport();
            });
        }

        const btnExportar = document.querySelector('.btn-exportar');

        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                generateQuotationReportFile();
            });
        }
    }
};

reportQuotationsViewPage();
export default reportQuotationsViewPage;
