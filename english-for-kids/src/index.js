import { cards } from './js/cards';
import { Card } from './js/Card';

const switchTrain = document.querySelector('.switch__train');
const bgBurger = document.querySelector('.background__burger');
const categoriesCards = document.querySelector('.categories-cards');
const menuCategories = document.querySelector('.menu-list-ul');

const burgerBtn = document.querySelector('.burger-menu__lines');
const switchPlay = document.querySelector('.switch__play');
const switchCheckbox = document.querySelector('.switch__checkbox');
const burgerCheckbox = document.querySelector('.burger-menu__checkbox-input');

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
    });

    burgerBtn.addEventListener('click', () => {
      this._toggleBurger();
    });

    bgBurger.addEventListener('click', () => {
      this._toggleBurger();
    });
  }

  _toggleBurger() {
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
    });
  }

  delegateEventsOnMenuList() {
    menuCategories.addEventListener('click', (event) => {
      const li = event.target.closest('li');

      if (!li) return;
      if (!menuCategories.contains(li)) return;

      burgerCheckbox.checked = burgerCheckbox.checked === false;
      this._toggleBurger();
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
      new Card(this.isMain, cards[index].properties[i]);
    }
  }
}

const GAME = new Game();
