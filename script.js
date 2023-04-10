// Get DOM elements that will be used in the code
const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const chooseImgBtn = document.querySelector(".choose-img");
const resetFiltersBtn = document.querySelector(".reset-filter");
const saveBtn = document.querySelector(".save-img");

// Set initial values for different filters and transformations
let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayScale = 0;
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

// Apply the current filter and transformation settings to the preview image
const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical}) `;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayScale}%)`;
};

// Load the selected image and set up the preview
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFiltersBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

// Set the selected filter button as active and update the slider and filter value accordingly
const setActiveButton = (clickedButton) => {
  filterOptions.forEach((button) => {
    if (button === clickedButton) {
      button.setAttribute("active", "true");
      filterName.innerText = button.innerText;

      // Changing Slider and Text
      if (button.id === "brightness") {
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
      } else if (button.id === "saturation") {
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
      } else if (button.id === "inversion") {
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
      } else {
        filterSlider.max = "100";
        filterSlider.value = grayScale;
        filterValue.innerText = `${grayScale}%`;
      }
    } else {
      button.removeAttribute("active");
    }
  });
};

// Add click event listeners to all filter buttons
filterOptions.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveButton(button);
  });
});

// Reset all filter and transformation settings to their initial values
const resetFilters = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayScale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
};

// Update the selected filter setting based on the slider value and apply the updated filter to the preview image
const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter [active]");
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayScale = filterSlider.value;
  }
  applyFilter();
};

// Add click event listeners to all rotate and flip buttons
rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

// Save the current image with the applied filter and transformation settings
const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayScale}%)`;
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  const link = document.createElement("a");
  link.download = "image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

// Add event listeners for various elements
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
chooseImgBtn.addEventListener("click", () => fileInput.click());
resetFiltersBtn.addEventListener("click", resetFilters);
saveBtn.addEventListener("click", saveImage);
