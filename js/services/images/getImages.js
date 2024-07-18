import Fetch from "../Fetch.js"

const getIamages = async (id) => {
  try {
    const response = await Fetch.get(`/api/Product/images/${id}`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo traer las imágenes', error);
  }
}

export default getIamages