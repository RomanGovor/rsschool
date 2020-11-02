const modalWindow = document.querySelector('.background__modal');
const menuWindow = document.querySelector('.background__menu');
const settingsMenu = document.querySelector('.settings__menu');

const menuBtn = document.querySelector('.menu');
const closeMenuBtn = document.querySelector('.close__menu');
const newGameBtn = document.querySelector('.new__game');
const backBtn = document.querySelector('.back');
const settingsBtn = document.querySelector('.settings');
let init = 0;

class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  }

  getRightBox() {
    if (this.x === 3) return null;
    return new Box(this.x + 1, this.y);
  }

  getBottomBox() {
    if (this.y === 3) return null;
    return new Box(this.x, this.y + 1);
  }

  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  }

  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox()
    ].filter(box => box !== null);
  }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
  }
}

const swapBoxes = (grid, box1, box2) => {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
};

const isSolved = grid => {
  return (
    grid[0][0] === 1 &&
    grid[0][1] === 2 &&
    grid[0][2] === 3 &&
    grid[0][3] === 4 &&
    grid[1][0] === 5 &&
    grid[1][1] === 6 &&
    grid[1][2] === 7 &&
    grid[1][3] === 8 &&
    grid[2][0] === 9 &&
    grid[2][1] === 10 &&
    grid[2][2] === 11 &&
    grid[2][3] === 12 &&
    grid[3][0] === 13 &&
    grid[3][1] === 14 &&
    grid[3][2] === 15 &&
    grid[3][3] === 0
  );
};


// Формирование рандомного поля
const getRandomGrid = () => {
  let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

  // Перемешать
  let blankBox = new Box(3, 3);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(grid, blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }

  // Если выпало правильное решение
  if (isSolved(grid)) return getRandomGrid();
  return grid;
};

// Получение подмассивов
function getSubArrays(str){
  let grid = [], subGrid = [], array = str.split(',');

  for(let i = 0; i < array.length; i++) {
    if((i % 4 === 0) && i !== 0) {
      grid.push(subGrid);
      subGrid = [];
    }
    subGrid.push(parseInt(array[i]));
  }
  grid.push(subGrid);

  return grid;
}

class State {
  constructor(grid, move, time, status) {
    grid = this.getGrid();
    move = this.getMoves();
    time = this.getTimes();

    if(move === 0 && time === 0 && init === 0) status = "start";
    init++;

    this.grid = grid;
    this.move = move;
    this.time = time;
    this.seconds = time % 60;
    this.minutes = (time - (time % 60))/60;
    this.status = status;
  }


  // Get grid from local storage
  getGrid() {
    let str = localStorage.getItem('currentGrid');
    return str === null ? getRandomGrid() : getSubArrays(str);
  }

  // Get moves from local storage
  getMoves() {
    let moves = localStorage.getItem('currentMoves');
    return moves === null ? 0 : parseInt(moves);
  }

  // Get moves from local storage
  getTimes() {
    let time = localStorage.getItem('currentTime');
    return time === null ? 0 : parseInt(time);
  }

  static ready() {
    return new State(
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      0,
      0,
      "ready"
    );
  }

  static restart() {
    GAME.setMoves(0);
    GAME.setTime(0);
    const grid = GAME.setGrid(getRandomGrid())
    return new State(grid, 0, 0, "playing");
  }

  static start() {
    return new State(getRandomGrid(), 0, 0, "playing");
  }
}

class Game {
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.setEvents();
    this.handleClickBox = this.handleClickBox.bind(this);
  }

  static ready() {
    return new Game(State.ready());
  }

  tick() {
    this.setTime(this.state.time + 1);
    this.setState({ time: this.state.time + 1 });
  }

  // Set grid to local storage
  setGrid(grid) {
    return localStorage.setItem('currentGrid', grid);
  }

  // Set moves to local storage
  setMoves(move) {
    return localStorage.setItem('currentMoves', move);
  }

  // Set time to  local storage
  setTime(time) {
    return localStorage.setItem('currentTime', time);
  }

  // Set Events Listeners
  setEvents() {
    menuBtn.addEventListener('click', () => {
      modalWindow.classList.toggle('blackout');
      modalWindow.style.display = 'flex';
      clearInterval(GAME.tickId);
    });

    closeMenuBtn.addEventListener('click', () => {
      modalWindow.classList.toggle('blackout');
      modalWindow.style.display = 'none';
      this.tickId = setInterval(this.tick, 1000);
    });

    newGameBtn.addEventListener('click', () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      modalWindow.classList.toggle('blackout');
      modalWindow.style.display = 'none';
      this.setState(State.restart());
    });

    settingsBtn.addEventListener('click', () => {
      settingsMenu.style.display = 'flex';
      menuWindow.style.display = 'none';
    });

    backBtn.addEventListener('click', () => {
      settingsMenu.style.display = 'none';
      menuWindow.style.display = 'flex';
    });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  //
  handleClickBox(box) {

    return function() {
      // Получение массива всех возможных ходов
      const nextdoorBoxes = box.getNextdoorBoxes();

      // Если найдена пустая ячейка
      const blankBox = nextdoorBoxes.find(nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0);

      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox);
        this.setMoves(this.state.move + 1);

        if (isSolved(newGrid)) {
          clearInterval(this.tickId);
          this.setState({ status: "won", grid: newGrid, move: this.state.move + 1 });

          //localStorage.setItem("scoreTable", JSON.stringify(array));
        }
        else {
          this.setGrid(newGrid);
          this.setState({ grid: newGrid, move: this.state.move + 1 });
        }
      }

    }.bind(this);

  }

  hideButtons(button) {
    button.classList.add('hide-btn');
    button.textContent = '';
  }

  render() {
    const { grid, move, time, status } = this.state;

    // Render grid
    const newGrid = document.createElement("div");
    newGrid.className = "grid";

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        const button = document.createElement("button");
        if (status === "playing") button.addEventListener("mousedown", this.handleClickBox(new Box(j, i)));

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        button.textContent === "" ? button.classList.toggle('passive') : button.classList.toggle('active');

        status === "ready" || status === "start" ? this.hideButtons(button) : true;

        newGrid.appendChild(button);
      }

    document.querySelector(".grid").replaceWith(newGrid);

    // Render button
    const newButton = document.createElement("button");
    newButton.classList.add('button', 'button-wide');

    if (status === "start") newButton.textContent = "Start";
    if (status === "ready") newButton.textContent = "Continue";
    if (status === "playing") newButton.textContent = "Reset";
    if (status === "won") newButton.textContent = "Play";

    newButton.addEventListener("click", () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      status === "ready" ? this.setState(State.start()) : this.setState(State.restart());
    });

    document.querySelector(".footer button").replaceWith(newButton);

    // Render move Render time
    const timeElement = document.getElementById("time");
    const movesElement =  document.getElementById("move");

    this.seconds = time % 60;
    this.minutes = (time - (time % 60))/60;

    status === "ready" ? timeElement.textContent = `Time: 0:00`: timeElement.textContent = `Time: ${this.minutes}:${this.isZero() ? '0' : ''}${this.seconds}`;
    status === "ready" ? movesElement.textContent = `Move: 0`: movesElement.textContent = `Move: ${move}`;

    // Render message
    status === "won" ? document.querySelector(".message").textContent = "You win!" : document.querySelector(".message").textContent = "";
  }

  isZero() {
    return this.seconds < 10;
  }

}

const GAME = Game.ready();