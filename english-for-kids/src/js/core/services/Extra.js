export class Extra {
  constructor() {
    this.getRandomInt = this.getRandomInt.bind(this);
  }

  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static getRandomArray(length, must) {
    const currentArr = [];
    for (let i = 0; i < must; i++) {
      currentArr.push(i);
    }

    const arr = [];
    for (let i = 0; i < length; i++) {
      const removed = currentArr.splice(this.getRandomInt(must - i), 1);
      arr.push(removed[0]);
    }
    return arr;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
