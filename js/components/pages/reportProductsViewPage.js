import getReportProducts from "../../services/reports/getReportProducts.js";
import nodeNotification from "../../helpers/nodeNotification.js"
import loadingData from "../../helpers/loading.js";

const loading = () =>  {
    const quotationContentListContainer = document.querySelector('.card-body.report-container');
    const loadingDiv = loadingData(quotationContentListContainer);
    quotationContentListContainer.appendChild(loadingDiv);
}

const reportProductsViewPage = async () => {
    const reportProductsView = document.querySelector("#reportProductsView");
  
    if (reportProductsView) {

        let cardProducts = document.querySelector('.card-products');

        let productsTable = document.getElementById('datatable');
        productsTable.style.display = "none";
        let chartSolic = null;
        let chartConfirm = null;
        let chartCancel = null;
        let chartArray = [chartSolic, chartConfirm, chartCancel];
        let datatable = null;

        const cardAfterEvent = document.querySelector('.card-after-event')
        cardAfterEvent.style.display = "none";

        const generateProductsReport = async () => {
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

            const reportProducts = await getReportProducts(fromInput.value, toInput.value);
            try {
                cardAfterEvent.style.display = "block";
                document.querySelector('.loading-message').remove()
                if (productsTable) {
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

                    reportProducts.productsData.forEach(product => {
                        datatable.row.add([
                            product.moldeCode,
                            product.name,
                            product.category,
                            product.quantity
                        ]).draw();
                    });

                    productsTable.style.display = "table";
                }

                const reportSolic = reportProducts.statusProducts.find(el => el.statusName == "Solicitada");
                const reportConfirm = reportProducts.statusProducts.find(el => el.statusName == "Confirmada");
                const reportCancel = reportProducts.statusProducts.find(el => el.statusName == "Cancelada");

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
                                    }
                                }
                            },
                            data: {
                                labels: data.productQuantities.map(row => row.productMolde),
                                datasets: [{
                                    label: 'Cantidad',
                                    data: data.productQuantities.map(row => row.quantity)
                                }]
                            }
                        });
                    }

                    chartArray[chartIndex] = chartObject;
                }

                generatePieChart(reportSolic, 'reportSolicitadas', 0, 'Solicitadas');
                generatePieChart(reportConfirm, 'reportConfirmadas', 1, 'Confirmadas');
                generatePieChart(reportCancel, 'reportCanceladas', 2, 'Canceladas');

                cardProducts.style.display = "block";

            } catch (error) {
                console.error('Ocurrió un error al obtener el reporte de productos:', error);
                nodeNotification('Ocurrió un error al obtener el reporte de productos:');                
            }
            
        }

        const generateProductsReportFile = async (event) => {
            const fromInput = document.getElementById("fromReport");
            const toInput = document.getElementById("toReport");
            const urlQuery = `/api/report/productsfile/${fromInput.value}/${toInput.value}`;
            const reqQuery = await fetch(urlQuery);
            const myBlob = await reqQuery.blob();
            const aElement = document.createElement("a");
            aElement.setAttribute("download", "ReporteProductos.xlsx");
            const href = URL.createObjectURL(myBlob);
            aElement.href = href;
            aElement.setAttribute("target", "_blank");
            aElement.click();
            URL.revokeObjectURL(href);
        }

        const btnGenerar = document.querySelector('.btn-generar');

        if (btnGenerar) {
            btnGenerar.addEventListener('click', () => {
                generateProductsReport();
            });
        }

        const btnExportar = document.querySelector('.btn-exportar');

        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                generateProductsReportFile();
            });
        }
    }
};

reportProductsViewPage();
export default reportProductsViewPage;
