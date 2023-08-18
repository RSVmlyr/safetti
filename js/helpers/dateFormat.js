const dateTimeFormat = (date) => {
  if (date) {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    const data = new Date(date);
    const formattedDate = data.toLocaleDateString(undefined, options);
    return formattedDate;
  } else {
    return `?`;
  }
};

export default dateTimeFormat;

// Date: month day year
// const dateFormat = (date) => {
//   if (date) {
//     const data = new Date(date);
//     const day = data.getDate();
//     const month = data.getMonth(); 
//     const year = data.getFullYear();
//     const nameMonths = [
//       "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
//       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
//     ];
//     const nameMonth = nameMonths[month];
//     return `${nameMonth}/${day}/${year}`
//   } else {
//     return `?`
//   }
// }

// export default dateFormat
// Date: month day year

// const dateFormat = (date) => {
//   if (date) {
//     const data = new Date(date);
//     const day = data.getUTCDate();
//     const month = data.getUTCMonth(); 
//     const year = data.getUTCFullYear();
//     const hours = data.getUTCHours();
//     const minutes = data.getUTCMinutes();
//     const seconds = data.getUTCSeconds();

//     const nameMonths = [
//       "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
//       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
//     ];
//     const nameMonth = nameMonths[month];

//     return `${nameMonth}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`;
//   } else {
//     return `?`;
//   }
// }

// export default dateFormat;
