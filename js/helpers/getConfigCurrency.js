function getConfigCurrency(currency) {
    const idiomaPredeterminado = 'es-CO'; // Español de Colombia
    const opcionesRegionales = {
      style: 'currency',
      currency: currency // Supongo que 'currency' es una propiedad del objeto client
    };
  
    return {
      idiomaPredeterminado,
      opcionesRegionales
    };
}

export default getConfigCurrency
