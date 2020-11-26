export class Extra {
  constructor() {
    this.getRandomInt = this.getRandomInt.bind(this);
  }

  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static getRandomArray(n) {
    const currentArr = [];
    for (let i = 0; i < n; i++) {
      currentArr.push(i);
    }

    const arr = [];
    for (let i = 0; i < n; i++) {
      const removed = currentArr.splice(this.getRandomInt(n - i), 1);
      arr.push(removed[0]);
    }
    return arr;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
