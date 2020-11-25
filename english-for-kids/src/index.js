import { cards } from './js/cards';
import { Card } from './js/Card';

const headerMenu = document.querySelector('.header__menu-list');
const bgBurger = document.querySelector('.background__burger');
const categoriesCards = document.querySelector('.categories-cards');
const menuCategories = document.querySelector('.menu-list-ul');

const burgerBtn = document.querySelector('.burger-menu__lines');
const switchTrain = document.querySelector('.switch__train');
const switchPlay = document.querySelector('.switch__play');
const switchCheckbox = document.querySelector('.switch__checkbox');
const burgerCheckbox = document.querySelector('.burger-menu__checkbox-input');
const gameButton = document.querySelector('.game-button > .button');

class Game {
  constructor() {
    this.isMain = true;
    this.isTrain = true;
    this.indexCurrentPage = 0;
    this.setEvents();
    this.renderCategoryList(this.indexCurrentPage);
    this.delegateEventsCategories();
    this.delegateEventsOnMenuList();
  }

  setEvents() {
    switchCheckbox.addEventListener('change', () => {
      switchPlay.classList.toggle('none');
      switchTrain.classList.toggle('none');
      headerMenu.classList.toggle('play-color');

      if (gameButton.classList.contains('button-repeat')) {
        this.toggleGameButtonMode();
      }

      this.isTrain = !this.isTrain;
      this.toggleGameMode();
    });

    burgerBtn.addEventListener('click', () => {
      this.toggleBurger();
    });

    bgBurger.addEventListener('click', () => {
      this.toggleBurger();
    });

    gameButton.addEventListener('click', () => {
      if (gameButton.classList.contains('button-start')) {
        this.toggleGameButtonMode();
      }
    });
  }

  toggleGameButtonMode() {
    gameButton.classList.toggle('button-start');
    gameButton.classList.toggle('button-repeat');
  }

  toggleGameMode() {
    document.querySelectorAll('.separator').forEach((elem) => {
      elem.classList.toggle('play-color');
    });

    if (!this.isMain) {
      gameButton.classList.toggle('none');

      document.querySelectorAll('.front').forEach((elem) => {
        elem.children[0].classList.toggle('full-height');
        elem.children[1].classList.toggle('none');
        elem.children[2].classList.toggle('none');
      });
    }
  }

  toggleBurger() {
    bgBurger.classList.toggle('blackout');
    document.body.classList.toggle('overflow-hidden');
  }

  delegateEventsCategories() {
    categoriesCards.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      const section = event.target.closest('section');

      if (!(button || section)) return;
      if (!(categoriesCards.contains(button) || categoriesCards.contains(section))) return;

      if (button) this.addEventRollButton(button);
      else if (this.isMain) this.addEventMainCard(section);
      else {
        this.playAudio(section);
      }
    });
  }

  playAudio(card) {
    const word = card.getAttribute('word');
    let url = '';
    for (let i = 0; i < cards[this.indexCurrentPage].properties.length; i++) {
      if (cards[this.indexCurrentPage].properties[i].word === word) {
        url = cards[this.indexCurrentPage].properties[i].audioSrc;
        break;
      }
    }
    const audioObj = new Audio(url);
    audioObj.currentTime = 0;
    audioObj.play();
  }

  delegateEventsOnMenuList() {
    menuCategories.addEventListener('click', (event) => {
      const li = event.target.closest('li');

      if (!li) return;
      if (!menuCategories.contains(li)) return;

      burgerCheckbox.checked = burgerCheckbox.checked === false;
      this.toggleBurger();
      this.updateCurrentCategory(li.textContent);
    });
  }

  updateCurrentCategory(str) {
    let indexCategory = -1;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].category === str) {
        indexCategory = i;
        break;
      }
    }
    str === 'Main page' ? this.isMain = true : this.isMain = false;
    if (indexCategory !== -1) {
      this.changeActiveMenuItem(indexCategory);
      this.renderCategoryList(indexCategory);
    }
  }

  changeActiveMenuItem(newIndex) {
    menuCategories.children[this.indexCurrentPage].classList.toggle('active-item');
    this.indexCurrentPage = newIndex;
    menuCategories.children[this.indexCurrentPage].classList.toggle('active-item');
  }

  addEventMainCard(card) {
    const title = card.getAttribute('word');
    this.updateCurrentCategory(title);
  }

  addEventRollButton(button) {
    const card = button.parentElement.parentElement.parentElement.parentElement;
    const front = card.firstChild;
    const back = card.lastChild;

    front.classList.add('front-rotate');
    back.style.transform = 'rotateY(360deg)';

    card.addEventListener('mouseleave', () => {
      front.classList.remove('front-rotate');
      // card.lastChild.classList.remove('back-rotate');
      back.style.transform = 'rotateY(180deg)';
    });
  }

  clearCardList() {
    while (categoriesCards.childElementCount !== 0) {
      categoriesCards.removeChild(categoriesCards.firstChild);
    }
  }

  renderCategoryList(index) {
    this.clearCardList();
    for (let i = 0; i < cards[index].properties.length; i++) {
      new Card(this.isTrain, this.isMain, cards[index].properties[i]);
    }

    if (!this.isTrain) gameButton.classList.remove('none');
    if (this.isMain) gameButton.classList.add('none');

    if (gameButton.classList.contains('button-repeat')) {
      this.toggleGameButtonMode();
    }
  }
}

const GAME = new Game();
