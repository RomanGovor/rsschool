import { cards } from './cards';

const statisticsContainer = document.querySelector('.statistics');
const tableStatistics = document.querySelector('.table');
const tableCategories = document.querySelector('.table__categories');

export class Statistics {
  constructor() {
    this.getStatistics = this.getStatistics.bind(this);
    this.setStatistics = this.setStatistics.bind(this);
    this.renderStatistics = this.renderStatistics.bind(this);
    this.clearTable = this.clearTable.bind(this);
    this.deleteArrow = this.deleteArrow.bind(this);
  }

  static getStatistics() {
    return JSON.parse(localStorage.getItem('vocabularyStatistics'));
  }

  static setStatistics(vocabulary) {
    localStorage.setItem('vocabularyStatistics', JSON.stringify(vocabulary));
  }

  static initStatistics() {
    const array = this.getStatistics();

    if (array === null) {
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
            // ((wrong / (wrong + correct))*100).toFixed(2)
          };
          vocabulary.push(word);
        }
      }

      this.setStatistics(vocabulary);
    }
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
    for (const elem of vocabulary) {
      const tr = document.createElement('tr');
      tr.classList.add('table__item');
      tr.innerHTML = `
           <td>${elem.word}</td>
           <td>${elem.translation}</td>
           <td>${elem.category}</td>
           <td>${elem.clicks}</td>
           <td>${elem.correct}</td>
           <td>${elem.wrong}</td>
           <td>${elem.perCent}</td>
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
