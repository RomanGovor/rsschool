const switchCheckbox = document.querySelector(".switch__checkbox");
const switchTrain = document.querySelector(".switch__train");
const switchPlay = document.querySelector(".switch__play");

switchCheckbox.addEventListener("change", () => {
   switchPlay.classList.toggle("none");
   switchTrain.classList.toggle("none");
   console.log('f');
});