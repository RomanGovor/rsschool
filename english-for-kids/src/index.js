import { cards } from './js/cards';
import { Card } from './js/Card';
import { Extra } from './js/Extra';
import { Statistics } from './js/Statistics';

const headerMenu = document.querySelector('.header__menu-list');
const bgBurger = document.querySelector('.background__burger');
const categoriesCards = document.querySelector('.categories-cards');
const menuCategories = document.querySelector('.menu-list-ul');
const backgroundResult = document.querySelector('.background__result');
const backgroundImg = document.querySelector('.background__img > img');
const backgroundTitle = document.querySelector('.background__title');
const playElements = document.querySelector('.play-elements');
const statisticsContainer = document.querySelector('.statistics');
const tableStatistics = document.querySelector('.table');

const burgerBtn = document.querySelector('.burger-menu__lines');
const switchTrain = document.querySelector('.switch__train');
const switchPlay = document.querySelector('.switch__play');
const switchGameModeBtn = document.querySelector('.switch__checkbox');
const burgerCheckbox = document.querySelector('.burger-menu__checkbox-input');
const gameButton = document.querySelector('.game-button > .button');

const gameSessionParameters = {
  indexCurrentPlayingCard: 0,
  randomCardsArray: [],
  countFails: 0,
};

class Game {
  constructor() {
    this.isStatistics = false;
    this.isMain = true;
    this.isTrain = true;
    this.indexCurrentPage = 0;
    this.gsp = gameSessionParameters;
    this.setEvents();
    this.renderCategoryList(this.indexCurrentPage);
    this.delegateEventsCategories();
    this.delegateEventsOnMenuList();
    Statistics.initStatistics();
  }

  setEvents() {
    switchGameModeBtn.addEventListener('change', () => {
      switchPlay.classList.toggle('none');
      switchTrain.classList.toggle('none');
      headerMenu.classList.toggle('play-color');

      if (gameButton.classList.contains('button-repeat')) {
        this.toggleGameButtonMode();
      }

      this.isTrain = !this.isTrain;
      this.toggleGameMode();
      this.generateRandomCardsArray();
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
        this.letsStartGame();
      } else this.repeatPlayingAudio();
    });

    backgroundResult.addEventListener('click', () => {
      backgroundResult.classList.toggle('result');
      backgroundImg.classList.toggle('width-middle');
      backgroundImg.removeAttribute('src');
      backgroundTitle.textContent = '';
      this.updateCurrentCategory('Main page');
    });
  }

  letsStartGame() {
    this.gsp.indexCurrentPlayingCard = 0;
    this.repeatPlayingAudio();
  }

  repeatPlayingAudio() {
    const index = this.gsp.randomCardsArray[this.gsp.indexCurrentPlayingCard];
    const url = cards[this.indexCurrentPage].properties[index].audioSrc;
    Card.playAudio(url);
  }

  generateRandomCardsArray() {
    if (!this.isTrain) {
      if (this.isMain || this.isStatistics) this.gsp.randomCardsArray = [];
      else {
        const { length } = cards[this.indexCurrentPage].properties;
        this.gsp.randomCardsArray = Extra.getRandomArray(length);
      }
    } else this.gsp.randomCardsArray = [];
  }

  toggleGameButtonMode() {
    gameButton.classList.toggle('button-start');
    gameButton.classList.toggle('button-repeat');
  }

  toggleGameMode() {
    document.querySelectorAll('.separator').forEach((elem) => {
      elem.classList.toggle('play-color');
    });

    if (!this.isMain && !this.isStatistics) {
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
    headerMenu.classList.toggle('overflow-normal');
  }

  delegateEventsCategories() {
    categoriesCards.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      const section = event.target.closest('section');

      if (!(button || section)) return;
      if (!(categoriesCards.contains(button) || categoriesCards.contains(section))) return;

      if (button) this.addEventRollButton(button);
      else if (this.isMain) this.addEventMainCard(section);
      else if (this.isTrain) {
        Card.searchPathToAudioByCard(section, this.indexCurrentPage);
        const word = section.getAttribute('word');
        Statistics.addClick(word, true);
      } else if (gameButton.classList.contains('button-repeat')) this.checkOnTrueAnswer(section);
    });
  }

  checkOnTrueAnswer(card) {
    if (!card.classList.contains('disabled')) {
      const word = card.getAttribute('word');
      let success; let correct; let error; let fail;
      const index = this.gsp.randomCardsArray[this.gsp.indexCurrentPlayingCard];
      const trueWord = cards[this.indexCurrentPage].properties[index].word;

      if (word === trueWord) {
        this.addStar(true);
        Statistics.addClick(trueWord, false, true);

        if (this.gsp.indexCurrentPlayingCard + 1
          === cards[this.indexCurrentPage].properties.length) {
          this.gsp.indexCurrentPlayingCard = 0;
          backgroundResult.classList.toggle('result');

          if (this.gsp.countFails === 0) {
            success = '../src/assets/audio/others/success.mp3';
            backgroundImg.setAttribute('src', '../src/assets/images/others/win.png');
          } else {
            fail = '../src/assets/audio/others/failure.mp3';
            backgroundImg.setAttribute('src', '../src/assets/images/others/fail.png');
            backgroundTitle.textContent = `Mistakes: ${this.gsp.countFails} :(`;
            backgroundImg.classList.toggle('width-middle');
          }
          this.removeStarContainer();
        } else {
          this.gsp.indexCurrentPlayingCard++;
          correct = '../src/assets/audio/others/correct.mp3';

          Extra.delay(1000).then(() => {
            this.repeatPlayingAudio();
          });

          card.classList.toggle('disabled');
        }
      } else {
        Statistics.addClick(trueWord, false, false);
        this.gsp.countFails++;
        error = '../src/assets/audio/others/error.mp3';
        this.addStar(false);
      }
      const url = success || correct || error || fail;
      Card.playAudio(url);
    }
  }

  removeStarContainer() {
    this.gsp.countFails = 0;
    if (playElements.childElementCount === 2) {
      gameButton.parentElement.classList.toggle('flex-start');
      playElements.removeChild(playElements.lastChild);
    }
  }

  addStar(isTrue) {
    let starContainer = document.querySelector('.star-container');
    if (!starContainer) {
      starContainer = document.createElement('div');
      starContainer.classList.toggle('star-container');
      playElements.append(starContainer);
      starContainer = document.querySelector('.star-container');

      gameButton.parentElement.classList.toggle('flex-start');
    }

    const star = document.createElement('img');
    star.classList.add('star');

    if (isTrue) star.setAttribute('src', '../src/assets/icons/star-win.svg');
    else star.setAttribute('src', '../src/assets/icons/star.svg');

    starContainer.append(star);
  }

  delegateEventsOnMenuList() {
    menuCategories.addEventListener('click', (event) => {
      const li = event.target.closest('li');

      if (!li) return;
      if (!menuCategories.contains(li)) return;

      burgerCheckbox.checked = burgerCheckbox.checked === false;

      this.toggleBurger();
      this.removeStarContainer();
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
    if (str === 'Main page') this.isMain = true;
    else this.isMain = false;

    if (indexCategory !== -1) {
      this.isStatistics = false;
      Statistics.closeStatistics();
      this.changeActiveMenuItem(indexCategory);
      this.renderCategoryList(indexCategory);
    } else {
      this.isStatistics = true;
      this.changeActiveMenuItem(menuCategories.children.length - 1);
      this.clearCardList();
      this.removeStarContainer();
      Statistics.openStatistics();
      gameButton.classList.add('none');
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
    back.classList.add('back-rotate');

    card.addEventListener('mouseleave', () => {
      front.classList.remove('front-rotate');
      back.classList.remove('back-rotate');
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

    this.generateRandomCardsArray();
    if (gameButton.classList.contains('button-repeat')) {
      this.toggleGameButtonMode();
    }
  }
}

const GAME = new Game();
