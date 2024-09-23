import { langParam } from "../lang.js";

const dateTimeFormat = (date) => {
  if (date) {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    const data = new Date(date);
    const formattedDate = data.toLocaleDateString(langParam, options);
    return formattedDate;
  } else {
    return `?`;
  }
};

export default dateTimeFormat;
