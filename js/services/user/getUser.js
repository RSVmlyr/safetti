import Fetch from "../Fetch.js"

const getUser = async (uid) => {
  try {
    const response = await Fetch.get(`/api/User/${uid}`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo traer el usuario', error);
  }
}

export default getUser