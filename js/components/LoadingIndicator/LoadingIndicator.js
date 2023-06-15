class LoadingIndicator extends HTMLElement {
  
    connectedCallback(){
      // Crear un elemento <div> para contener el indicador de carga
      const container = document.createElement('div');
      container.classList.add('loading-indicator');

      // Crear el contenido del indicador de carga (por ejemplo, un spinner)
      const spinner = document.createElement('div');
      spinner.classList.add('spinner');

      // Agregar el contenedor al shadow root
      container.appendChild(spinner);
      this.appendChild(container);

    }
  }

  // Definir el custom element
  customElements.define('loading-indicator', LoadingIndicator);
  