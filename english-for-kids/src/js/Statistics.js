import { cards } from './cards';
import { Constants } from './Constants';

const statisticsContainer = document.querySelector('.statistics');
const tableStatistics = document.querySelector('.table');
const tableCategories = document.querySelector('.table__categories');
const resetStatisticsBtn = document.querySelector('.statistics__button-reset');

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
    this.windowUnload = this.windowUnload.bind(this);
  }

  static getStatistics() {
    return JSON.parse(localStorage.getItem(Constants.statistics));
  }

  static setStatistics(vocabulary) {
    localStorage.setItem(Constants.statistics, JSON.stringify(vocabulary));
  }

  static resetStatEventListener(event) {
    localStorage.removeItem(Constants.statistics);
    this.createStatisticsStorage();
  }

  static resetStatistics() {
    resetStatisticsBtn.addEventListener('click', () => this.resetStatEventListener());
  }

  static tableEventListener(event) {
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
  }

  static delegateTableCategories() {
    tableCategories.addEventListener('click', (event) => this.tableEventListener(event));
  }

  static sortingTable(parameter, operation) {
    const vocabulary = this.getStatistics();
    let newVoc = [];

    if (parameter === Constants.fails) parameter = Constants.perCent;

    if (parameter === Constants.word || parameter === Constants.translation
      || parameter === Constants.category || parameter === Constants.clicks
      || parameter === Constants.correct || parameter === Constants.wrong
      || parameter === Constants.perCent) {
      const compareUp = (prev, next) => {
        if (prev[parameter] < next[parameter]) return -1;
        return 1;
      };
      const compareDown = (prev, next) => {
        if (next[parameter] < prev[parameter]) return -1;
        return 1;
      };
      const compareFunc = operation === 'up' ? compareUp : compareDown;

      newVoc = [].concat(vocabulary.sort(compareFunc));
    } else {
      newVoc = [].concat(vocabulary);
    }
    return newVoc;
  }

  static initStatistics() {
    const array = this.getStatistics();
    this.delegateTableCategories();
    this.resetStatistics();
    this.windowUnload();
    if (array === null) this.createStatisticsStorage();
  }

  static windowUnload() {
    window.addEventListener('unload', function () {
      resetStatisticsBtn.removeEventListener('click', () => this.resetStatEventListener());
      tableCategories.removeEventListener('click', (event) => this.tableEventListener(event));
    });
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

    vocabulary.forEach((el) => {
      if (word === el.word) {
        if (isTrain) el.clicks += 1;
        else {
          if (isGoodAnswer) el.correct += 1;
          else el.wrong += 1;
          el.perCent = `${((el.wrong / (el.wrong + el.correct)) * 100).toFixed(2)}`;
        }
      }
    });
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
    vocabulary.forEach((el) => {
      const tr = document.createElement('tr');
      tr.classList.add('table__item');
      tr.innerHTML = `
           <td>${el.word}</td>
           <td>${el.translation}</td>
           <td>${el.category}</td>
           <td>${el.clicks}</td>
           <td>${el.correct}</td>
           <td>${el.wrong}</td>
           <td>${el.perCent}</td>
      `;
      tableStatistics.append(tr);
    });
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
