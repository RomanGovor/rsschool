import { cards } from './js/cards';

const switchTrain = document.querySelector('.switch__train');
const bgBurger = document.querySelector('.background__burger');
const card = document.querySelector('.card');
const front = document.querySelector('.front');
const back = document.querySelector('.back');

const burgerBtn = document.querySelector('.burger-menu__lines');
const rotateButton = document.querySelector('.roll-button');
const switchPlay = document.querySelector('.switch__play');
const switchCheckbox = document.querySelector('.switch__checkbox');

class Game {
  constructor() {
    this.isMain = true;
    this.setEvents();
  }

  setEvents() {
    switchCheckbox.addEventListener('change', () => {
      switchPlay.classList.toggle('none');
      switchTrain.classList.toggle('none');
    });

    burgerBtn.addEventListener('click', () => {
      bgBurger.classList.toggle('blackout');
    });

    bgBurger.addEventListener('click', () => {
      bgBurger.classList.toggle('blackout');
    });

    rotateButton.addEventListener('click', () => {
      front.classList.add('front-rotate');
      // card.lastChild.classList.add('back-rotate');
      back.style.transform = 'rotateY(360deg)';
    });

    card.addEventListener('mouseleave', () => {
      front.classList.remove('front-rotate');
      // card.lastChild.classList.remove('back-rotate');
      back.style.transform = 'rotateY(180deg)';
    });
  }
}

const GAME = new Game();
