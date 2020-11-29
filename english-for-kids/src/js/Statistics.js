import { cards } from './cards';

const statisticsContainer = document.querySelector('.statistics');
const tableStatistics = document.querySelector('.table');
const tableCategories = document.querySelector('.table__categories');
const resetStatisticsBtn = document.querySelector('.statistics__button-reset');
const repeatStatisticsBtn = document.querySelector('.statistics__button-repeat');

export class Statistics {
  constructor() {
    this.getStatistics = this.getStatistics.bind(this);
    this.setStatistics = this.setStatistics.bind(this);
    this.renderStatistics = this.renderStatistics.bind(this);
    this.clearTable = this.clearTable.bind(this);
    this.deleteArrow = this.deleteArrow.bind(this);
    this.delegateTableCategories = this.delegateTableCategories.bind(this);
    this.sortingTable = this.sortingTable.bind(this);
    this.resetStatistics = this.resetStatistics.bind(this);
    this.createStatisticsStorage = this.createStatisticsStorage.bind(this);
  }

  static getStatistics() {
    return JSON.parse(localStorage.getItem('vocabularyStatistics'));
  }

  static setStatistics(vocabulary) {
    localStorage.setItem('vocabularyStatistics', JSON.stringify(vocabulary));
  }

  static resetStatistics() {
    resetStatisticsBtn.addEventListener('click', () => {
      localStorage.removeItem('vocabularyStatistics');
      this.createStatisticsStorage();
    });
  }

  static delegateTableCategories() {
    tableCategories.addEventListener('click', (event) => {
      const td = event.target.closest('td');

      if (!td) return;
      if (!tableCategories.contains(td)) return;

      let parameter = td.textContent;

      let operation = 'up';
      if (td.childElementCount === 1 && td.firstChild.textContent === '▼') operation = 'down';

      if (parameter.includes('▼') || parameter.includes('▲')) {
        parameter = parameter.slice(1);
        td.textContent = parameter;
      }

      const vocabulary = this.sortingTable(parameter.toLowerCase(), operation);
      this.renderStatistics(vocabulary);

      if (operation === 'up') td.innerHTML = `<span>&#9660;</span>${parameter}`;
      else td.innerHTML = `<span>&#9650;</span>${parameter}`;
    });
  }

  static sortingTable(parameter, operation) {
    const vocabulary = this.getStatistics();
    let newVoc = [];

    if (parameter === '% fails') parameter = 'perCent';

    if (parameter === 'word' || parameter === 'translation'
      || parameter === 'category' || parameter === 'clicks'
      || parameter === 'correct' || parameter === 'wrong'
      || parameter === 'perCent') {
      const sortUp = (prev, next) => {
        if (prev[parameter] < next[parameter]) return -1;
        return 1;
      };
      const sortDown = (prev, next) => {
        if (next[parameter] < prev[parameter]) return -1;
        return 1;
      };
      const sortFunc = operation === 'up' ? sortUp : sortDown;

      newVoc = [].concat(vocabulary.sort(sortFunc));
    } else {
      newVoc = [].concat(vocabulary);
    }
    return newVoc;
  }

  static initStatistics() {
    const array = this.getStatistics();
    this.delegateTableCategories();
    this.resetStatistics();

    if (array === null) this.createStatisticsStorage();
  }

  static createStatisticsStorage() {
    const vocabulary = [];
    const categoryLength = cards.length;

    for (let i = 1; i < categoryLength; i++) {
      const propertiesLength = cards[i].properties.length;

      for (let j = 0; j < propertiesLength; j++) {
        const word = {
          word: `${cards[i].properties[j].word}`,
          translation: `${cards[i].properties[j].translation}`,
          category: `${cards[i].category}`,
          clicks: 0,
          correct: 0,
          wrong: 0,
          perCent: '0.00',
        };
        vocabulary.push(word);
      }
    }

    this.renderStatistics(vocabulary);
    this.setStatistics(vocabulary);
  }

  static addClick(word, isTrain, isGoodAnswer) {
    const vocabulary = this.getStatistics();

    for (let i = 0; i < vocabulary.length; i++) {
      if (word === vocabulary[i].word) {
        if (isTrain) vocabulary[i].clicks += 1;
        else {
          if (isGoodAnswer) vocabulary[i].correct += 1;
          else vocabulary[i].wrong += 1;
          vocabulary[i].perCent = `${((vocabulary[i].wrong / (vocabulary[i].wrong + vocabulary[i].correct)) * 100).toFixed(2)}`;
        }

        break;
      }
    }
    this.setStatistics(vocabulary);
  }

  static closeStatistics() {
    statisticsContainer.classList.add('none');
  }

  static openStatistics() {
    statisticsContainer.classList.remove('none');
    const vocabulary = this.getStatistics();
    this.renderStatistics(vocabulary);
  }

  static renderStatistics(vocabulary) {
    this.clearTable();
    this.deleteArrow();
    for (let i = 0; i < vocabulary.length; i++) {
      const tr = document.createElement('tr');
      tr.classList.add('table__item');
      tr.innerHTML = `
           <td>${vocabulary[i].word}</td>
           <td>${vocabulary[i].translation}</td>
           <td>${vocabulary[i].category}</td>
           <td>${vocabulary[i].clicks}</td>
           <td>${vocabulary[i].correct}</td>
           <td>${vocabulary[i].wrong}</td>
           <td>${vocabulary[i].perCent}</td>
      `;
      tableStatistics.append(tr);
    }
  }

  static clearTable() {
    while (tableStatistics.childElementCount !== 2) {
      tableStatistics.removeChild(tableStatistics.lastChild);
    }
  }

  static deleteArrow() {
    for (let i = 0; i < tableCategories.children.length; i++) {
      if (tableCategories.children[i].childElementCount) {
        tableCategories.children[i].removeChild(tableCategories.children[i].firstChild);
        break;
      }
    }
  }
}
