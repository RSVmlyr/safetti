import Fetch from "../Fetch.js"

const getAdvisors = async () => {
  try {
    const response = await Fetch.get(`/api/User/advisors`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo traer los asesores', error);
  }
}

export default getAdvisors