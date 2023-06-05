// Date: month day year
const dateFormat = (date) => {
  if (date) {
    const data = new Date(date);
    const day = data.getDate();
    const month = data.getMonth(); 
    const year = data.getFullYear();
    const nameMonths = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const nameMonth = nameMonths[month];
    return `${nameMonth}/${day}/${year}`
  } else {
    return `?`
  }
}

export default dateFormat
// Date: month day year