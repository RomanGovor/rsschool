// eslint-disable-next-line no-unused-vars
class State {
  constructor(grid, move, time, status, size, image) {
    size = getSize(); // Get properties
    grid = getGrid();
    move = getMoves();
    time = getTimes();
    image = getImage();
    independentVars.sizeTemp = size;

    if (move === 0 && time === 0 && independentVars.init === 0) status = "start";
    independentVars.init++;

    this.grid = grid; // Set properties
    this.move = move;
    this.time = time;
    this.seconds = time % 60;
    this.minutes = (time - (time % 60)) / 60;
    this.status = status;
    this.size = size;
    this.image = image;
    this.getBgGradient();
  }

  static ready() {
    return new State(
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      0,
      0,
      "ready",
      4,
      "1.jpg",
    );
  }

  static restart() {
    setMoves(0);
    setTime(0);
    setSize(independentVars.sizeTemp);
    const grid = setGrid(getRandomGrid(getSize()));
    const img = setImage(`${this.getRandomInt(149)}.jpg`);
    getImagesArray(getSize());
    return new State(grid, 0, 0, "playing", getSize(), img);
  }

  static start() {
    return new State(getRandomGrid(getSize()), 0, 0, "playing", getSize(), getImage());
  }

  getBgGradient() {
    const colors = [
      "#ffcb52", "#ff7b02", "#c165dd", "#5c27fe", "#2afeb7", "#08c792", "#5581f1", "#1153fc",
      "#facd68", "#fc76b3", "#00f7a7", "#04f5ed", "#1de5e2", "#b588f7", "#ffe324", "#ffb533",
    ];
    document.body.style.backgroundImage = `linear-gradient(45deg,${colors[this.getRandomInt(colors.length) - 1]}, ${colors[this.getRandomInt(colors.length) - 1]})`;
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomInt(max) { // Get Random Number
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
}
