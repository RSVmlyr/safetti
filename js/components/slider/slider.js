const sliders = () => {
  
  // Options for Flickity
  const sliderOptions = {
    cellAlign: "center",
    pageDots: false,
    prevNextButtons: true,
    groupCells: 1,
    wrapAround: true,
    contain: true,
    lazyLoad: true,
    adaptiveHeight: false,
    imagesLoaded: true,
  };

  // Function to initialize the slider
  const initializeSlider = () => {
    const sliderElement = document.querySelector('.modal .modal--container__bodyLeft');
    console.log(sliderElement);

    if (sliderElement && sliderElement.children.length > 1) {
      try {
        // Initialize Flickity on the element
        new Flickity(sliderElement, sliderOptions);
      } catch (error) {
        console.error("Error initializing Flickity:", error);
      }
    }
  };

  // Initialize the slider when the DOM content is fully loaded
  document.addEventListener("DOMContentLoaded", initializeSlider);


}

sliders()