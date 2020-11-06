const modalWindow = document.querySelector(".background__modal");
const menuWindow = document.querySelector(".background__menu");
const settingsMenu = document.querySelector(".settings__menu");
const scoresMenu = document.querySelector(".scores");
const resultsContent = document.querySelector(".scores > table > tbody");
const congratulationContent = document.querySelector(".congratulation__info");
const congratulationAuthor = document.querySelector(".congratulation__author");


const menuBtn = document.querySelector(".menu");
const closeMenuBtn = document.querySelector(".close__menu");
const newGameBtn = document.querySelector(".new__game");
const backBtns = document.querySelectorAll(".back");
const settingsBtn = document.querySelector(".settings");
const selectBox = document.querySelector(".select-box");
const clickSoundBtn = document.querySelector("#click-sound");
const bestScoresBtn = document.querySelector(".best__scores");
const closeWinBtn = document.querySelector(".close-win");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let init = 0, sizeTemp = 0 ,keyNum = 0, imagesParts = [];

const gameWidth = 480;

// Get grid from local storage
function getGrid() {
  let str = localStorage.getItem("currentGrid");
  return str === null ? getRandomGrid(getSize()) : getSubArrays(str,getSize());
}

// Get moves from local storage
function getMoves() {
  let moves = localStorage.getItem("currentMoves");
  return moves === null ? 0 : parseInt(moves);
}

// Get size from local storage
function getSize() {
  let size = localStorage.getItem("currentSize");
  if(size === null || size === undefined) this.setSize(4);
  return size === null || size === undefined ? 4 : parseInt(size);
}

// Get time from local storage
function getTimes() {
  let time = localStorage.getItem("currentTime");
  return time === null ? 0 : parseInt(time);
}

// Get image from local storage
function getImage() {
  let image = localStorage.getItem("currentImage");
  return image === null ? "1.jpg" : image;
}

// Set grid to local storage
function setGrid(grid) {
  return localStorage.setItem("currentGrid", grid);
}

// Set moves to local storage
function setMoves(move) {
  return localStorage.setItem("currentMoves", move);
}

// Set time to  local storage
function setTime(time) {
  return localStorage.setItem("currentTime", time);
}

// Set size to  local storage
function setSize(size) {
  return localStorage.setItem("currentSize", size);
}

// Set image to  local storage
function setImage(img) {
  return localStorage.setItem("currentImage", img);
}



class Box {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1, this.size);
  }

  getRightBox() {
    if (this.x === this.size - 1) return null;
    return new Box(this.x + 1, this.y, this.size);
  }

  getBottomBox() {
    if (this.y === this.size - 1) return null;
    return new Box(this.x, this.y + 1, this.size);
  }

  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y, this.size);
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

const isSolved = (grid) => {
  return JSON.stringify(grid) === JSON.stringify(getConstArray(grid.length));
};


// Формирование рандомного поля
const getRandomGrid = (size) => {
  let grid = getConstArray(size);

  // Перемешать
  let blankBox = new Box(size - 1, size - 1, size);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(grid, blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }

  // Если выпало правильное решение
  if (isSolved(grid)) return getRandomGrid(size);
  return grid;
};

// Получение подмассивов
function getSubArrays(str,size){
  let grid = [], subGrid = [], array = str.split(",");

  for(let i = 0; i < array.length; i++) {
    if((i % size === 0) && i !== 0) {
      grid.push(subGrid);
      subGrid = [];
    }
    subGrid.push(parseInt(array[i]));
  }
  grid.push(subGrid);

  return grid;
}

class State {
  constructor(grid, move, time, status, size, image) {
    size = getSize();
    grid = getGrid();
    move = getMoves();
    time = getTimes();
    image = getImage();
    sizeTemp = size;

    if(move === 0 && time === 0 && init === 0) status = "start";
    init++;

    this.grid = grid;
    this.move = move;
    this.time = time;
    this.seconds = time % 60;
    this.minutes = (time - (time % 60))/60;
    this.status = status;
    this.size = size;
    this.image = image;
  }

  static ready() {
    return new State(
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      0,
      0,
      "ready",
      4,
      "1.jpg"
    );
  }

  static restart() {
    setMoves(0);
    setTime(0);
    setSize(sizeTemp);
    const grid = setGrid(getRandomGrid(getSize()));
    const img = setImage(`${getRandomInt(149)}.jpg`);
    getImagesArray(getSize());
    return new State(grid, 0, 0, "playing", getSize(),img);
  }

  static start() {
    return new State(getRandomGrid(getSize()), 0, 0, "playing", getSize(),getImage());
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
}

class Game{
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);
    this.render();
    this.setEvents();
    this.handleClickBox = this.handleClickBox.bind(this);
    this.sound = true;
    this.editSizeBox();
    this.setTableRecords();
    getImagesArray(this.state.size);
  }

  static ready() {
    return new Game(State.ready());
  }

  static keyPress(e) {
    if (window.event) {
      keyNum = window.event.keyCode;
      console.log(keyNum);
    }
    else if (e) {
      keyNum = e.which;
    }
  }

  tick() {
    setTime(this.state.time + 1);
    this.setState({ time: this.state.time + 1 });
  }

  playSound() {
      const sound = document.querySelector(".shift__sound");
      sound.currentTime = 0;
      sound.play();
  }

  editSizeBox() {
    selectBox.value = getSize();
  }

  setTableRecords () {
    const array = JSON.parse(localStorage.getItem("tableScores"));
    if(array !== null) {
      for(let el of array) {
          const tr = document.createElement("tr");
          let par1 = document.createElement("td");
          par1.classList.add("results-element__item");

          let par2 = document.createElement("td");
          par2.classList.add("results-element__item");

          let par3 = document.createElement("td");
          par3.classList.add("results-element__item");

          let par4 = document.createElement("td");
          par4.classList.add("results-element__item");

          par1.textContent = el.date;
          par2.textContent = el.moves;
          par3.textContent = el.size;

          const seconds = parseInt(el.time) % 60;
          const minutes = (parseInt(el.time) - (parseInt(el.time) % 60))/60;

          par4.textContent = `${minutes}m ${seconds}s`;
          tr.append(par1,par2,par3,par4);
          resultsContent.append(tr);
      }
    }
  }

  removeTableRecords() {
      while (resultsContent.childElementCount !== 1)
        resultsContent.removeChild(resultsContent.lastChild);
  }
  // Set Events Listeners
  setEvents() {
    menuBtn.addEventListener("click", () => {
      modalWindow.classList.toggle("blackout");
      modalWindow.style.display = "flex";
      congratulationContent.parentNode.style.display = "none";
      menuWindow.style.display = "flex";
      clearInterval(GAME.tickId);
    });

    closeMenuBtn.addEventListener("click", () => {
      modalWindow.classList.toggle("blackout");
      modalWindow.style.display = "none";
      this.tickId = setInterval(this.tick, 1000);
    });

    newGameBtn.addEventListener("click", () => {
      clearInterval(this.tickId);
      this.tickId = setInterval(this.tick, 1000);
      modalWindow.classList.toggle("blackout");
      modalWindow.style.display = "none";
      this.setState(State.restart());
    });

    settingsBtn.addEventListener("click", () => {
      settingsMenu.style.display = "flex";
      menuWindow.style.display = "none";
    });

    backBtns.forEach(btn => btn.addEventListener("click", () => {
      scoresMenu.style.display = "none";
      settingsMenu.style.display = "none";
      menuWindow.style.display = "flex";
    }));

    selectBox.addEventListener("change", () => {
      sizeTemp = parseInt(selectBox.value);
    });

    clickSoundBtn.addEventListener("change", () => {
      clickSoundBtn.checked ? this.sound = true : this.sound = false;
    });

    bestScoresBtn.addEventListener("click", () => {
      scoresMenu.style.display = "flex";
      menuWindow.style.display = "none";
    });

    closeWinBtn.addEventListener("click", () => {
      congratulationContent.parentNode.style.display = "none";
      menuWindow.style.display = "none";
      modalWindow.classList.toggle("blackout");
    });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  updateRecords(obj) {
    let array = JSON.parse(localStorage.getItem("tableScores"));
    if(array !== null) {
      array.push(obj);
      array.sort(function (a, b) {return a.time - b.time;});
      if(array.length === 11) array.pop();
      localStorage.setItem("tableScores", JSON.stringify(array));
    } else {
      const arr = [];
      arr.push(obj);
      localStorage.setItem("tableScores", JSON.stringify(arr));
    }
    this.removeTableRecords();
    this.setTableRecords();
  }

  isWin(obj) {
    const seconds = parseInt(obj.time) % 60;
    const minutes = (parseInt(obj.time) - (parseInt(obj.time) % 60))/60;
    const movesElem = document.createElement("div");
    const timeElem = document.createElement("div");

    while (congratulationContent.childElementCount !== 0)
      congratulationContent.removeChild(congratulationContent.firstChild);

    modalWindow.classList.toggle("blackout");
    modalWindow.style.display = "flex";
    menuWindow.style.display = "none";
    congratulationContent.parentNode.style.display = "block";

    movesElem.textContent = `Moves: ${obj.moves - 1}`;
    timeElem.textContent = `Time: ${minutes}m ${seconds}s`;
    timeElem.style.marginLeft = "3vw";

    congratulationContent.append(movesElem,timeElem);
    getJSON();
  }

  updateGridBoxes (box,blankBox) {
    const newGrid = [...this.state.grid];
    swapBoxes(newGrid, box, blankBox);
    setMoves(this.state.move + 1);
    if(this.sound) this.playSound();

    if (isSolved(newGrid)) {
      clearInterval(this.tickId);

      this.setState({ status: "won", grid: newGrid, move: this.state.move + 1 });
      const date = new Date();
      const obj = {
        date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
        moves: this.state.move + 1,
        time: this.state.time,
        size: `${this.state.size}x${this.state.size}`
      };
      this.updateRecords(obj);
      this.isWin(obj);

      const movesElement =  document.getElementById("move");
      movesElement.textContent = `Move: ${obj.moves}`;

      setMoves(0);
      setTime(0);
      setSize(sizeTemp);
      setGrid(getRandomGrid(getSize()));
    }
    else {
      setGrid(newGrid);
      this.setState({ grid: newGrid, move: this.state.move + 1 });
    }
  }

  moveFakeButton(box, blankBox, button, isInversion) {

    button.classList.toggle("passive");
    button.classList.toggle("active");

    let b = document.createElement("button");
    b.classList.add("active","b");
    b.textContent = button.textContent;
    b.style.width = `${gameWidth/box.size}px`;
    b.style.height = `${gameWidth/box.size}px`;

    b.style.backgroundImage = button.style.backgroundImage;

    b.style.top = `${button.offsetTop}px`;
    b.style.left = `${button.offsetLeft}px`;
    document.body.append(b);
    button.textContent = "";
    button.style.backgroundImage = "";

    const fakeButton = document.querySelector(".b");

    if(box.x + 1 === blankBox.x)
      fakeButton.style.left = isInversion ? `${button.offsetLeft - gameWidth/box.size}px` :`${button.offsetLeft + gameWidth/box.size}px`;
    if(box.x - 1 === blankBox.x)
      fakeButton.style.left = isInversion ? `${button.offsetLeft + gameWidth/box.size}px` :`${button.offsetLeft - gameWidth/box.size}px`;
    if(box.y + 1 === blankBox.y)
      fakeButton.style.top = isInversion ? `${button.offsetTop - gameWidth/box.size}px` :`${button.offsetTop + gameWidth/box.size}px`;
    if(box.y - 1 === blankBox.y)
      fakeButton.style.top = isInversion ? `${button.offsetTop + gameWidth/box.size}px` :`${button.offsetTop - gameWidth/box.size}px`;


    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    delay(300).then(() => {
      this.updateGridBoxes(box,blankBox);
      document.body.removeChild(fakeButton);
      this.render();
    });

    // fakeButton.addEventListener('transitionend', () => {
    //   this.updateGridBoxes(box,blankBox)
    //   document.body.removeChild(fakeButton);
    //   // fakeButton.remove();
    //   this.render();
    // });
  }

  keydownClickBox(key, size) {
    if(document.querySelector(".b") === null) {
      let fl = true, box = 0, blankBox;

      switch (key) {
        case 37: // left
          for (let i = 0; i < size; i++) {
            if(this.state.grid[i][size - 1] === 0) {fl = !fl; break;}
          }
          break;
        case 39: // right
          for (let i = 0; i < size; i++) {
            if(this.state.grid[i][0] === 0) {fl = !fl; break;}
          }
          break;
        case 38: // top
          for (let i = 0; i < size; i++) {
            if(this.state.grid[size - 1][i] === 0) {fl = !fl; break;}
          }
          break;
        case 40: // bottom
          for (let i = 0; i < size; i++) {
            if(this.state.grid[0][i] === 0) {fl = !fl; break;}
          }
          break;
      }

      if(fl) {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (this.state.grid[i][j] === 0) {
              box = new Box(j, i, size);
              switch (key) {
                case 37: // left
                  blankBox = new Box( j + 1, i, size);
                  break;
                case 39: // right
                  blankBox = new Box(j - 1 ,i , size);
                  break;
                case 38: // top
                  blankBox = new Box(j, i + 1, size);
                  break;
                case 40: // bottom
                  blankBox = new Box(j, i - 1, size);
                  break;
              }
              break;
            }
          }
        }

        const button = document.querySelector(`body > div.game > div > button:nth-child(${size * blankBox.y + (blankBox.x + 1)})`);
        this.moveFakeButton(box, blankBox, button, true);
        //this.updateGridBoxes(box,blankBox);
      }
    }

  }

  handleClickBox(box,button) {
    if(document.querySelector(".b") === null) {
      return function () {
        const nextdoorBoxes = box.getNextdoorBoxes();
        const blankBox = nextdoorBoxes.find(nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0);

        if (blankBox) {
          this.moveFakeButton(box, blankBox, button, false);
        }

      }.bind(this);
    }
  }

  handleClickBoxA(box) {
    if(document.querySelector(".b") === null) {
      return function () {
        const nextdoorBoxes = box.getNextdoorBoxes();
        const blankBox = nextdoorBoxes.find(nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0);

        if (blankBox) {
          this.updateGridBoxes(box,blankBox);
        }

      }.bind(this);
    }
  }

  hideButtons(button) {
    button.classList.add("hide-btn");
    button.textContent = "";
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {grid, move, time, status, size, image} = this.state;

    // Render grid
    const newGrid = document.createElement("div");
    newGrid.className = "grid";
    newGrid.style.gridTemplateRows = `repeat(${size}, ${gameWidth / size}px)`;
    newGrid.style.gridTemplateColumns = `repeat(${size}, ${gameWidth / size}px)`;

    const but = document.querySelector(".b");
    let hideBtn = 0;
    if (but !== null) {
      hideBtn = parseInt(but.textContent);
    }

    for (let i = 0; i < size; i++)
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        if (status === "playing") button.addEventListener("mousedown", this.handleClickBox(new Box(j, i, size), button));

        // if (status === "playing") button.onmousedown = function(event) {
        //
        //   button.classList.toggle("passive");
        //   button.classList.toggle("active");
        //
        //   let b = document.createElement("button");
        //   b.classList.add("active","b");
        //   b.textContent = button.textContent;
        //   b.style.width = `${gameWidth/size}px`;
        //   b.style.height = `${gameWidth/size}px`;
        //
        //   b.style.top = `${button.offsetTop}px`;
        //   b.style.left = `${button.offsetLeft}px`;
        //   document.body.append(b);
        //   button.textContent = "";
        //
        //   // eslint-disable-next-line no-unused-vars
        //   const fakeButton = document.querySelector(".b");
        //
        //   document.body.append(fakeButton);
        //   // и установим абсолютно спозиционированный мяч под курсор
        //
        //   moveAt(event.pageX, event.pageY);
        //
        //   // передвинуть мяч под координаты курсора
        //   // и сдвинуть на половину ширины/высоты для центрирования
        //   function moveAt(pageX, pageY) {
        //     fakeButton.style.left = pageX - fakeButton.offsetWidth / 2 + "px";
        //     fakeButton.style.top = pageY - fakeButton.offsetHeight / 2 + "px";
        //   }
        //
        //   function onMouseMove(event) {
        //     moveAt(event.pageX, event.pageY);
        //   }
        //
        //   fakeButton.ondragstart = function() {
        //     return false;
        //   };
        //
        //   // (3) перемещать по экрану
        //   document.addEventListener("mousemove", onMouseMove);
        //
        //   // (4) положить мяч, удалить более ненужные обработчики событий
        //   fakeButton.onmouseup = function() {
        //     document.removeEventListener("mousemove", onMouseMove);
        //     fakeButton.onmouseup = null;
        //     this.handleClickBoxA(new Box(j, i, size));
        //     // button.classList.toggle('passive');
        //     // button.classList.toggle('active');
        //   };
        // };

        if (status === "playing") window.onkeydown = () => {
          if (keyNum === 37 || keyNum === 38 || keyNum === 39 || keyNum === 40) this.keydownClickBox(keyNum, size);
        };

        let index = grid[i][j] === 0 ? Math.pow(size, 2): grid[i][j];
        button.style.backgroundImage = `url('${imagesParts[index]}')`;

        button.textContent = grid[i][j] === 0 || grid[i][j] === hideBtn ? "" : grid[i][j].toString();
        button.textContent === "" ? button.classList.toggle("passive") : button.classList.toggle("active");
        if(status === "won") {
          button.textContent = "";
          button.classList.remove("passive");
          button.classList.add("active");
        }

        status === "ready" || status === "start" ? this.hideButtons(button) : true;

        newGrid.appendChild(button);
      }

    document.querySelector(".grid").replaceWith(newGrid);

    // Render button
    const newButton = document.createElement("button");
    newButton.classList.add("button", "button-wide");

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
    const movesElement = document.getElementById("move");

    this.seconds = time % 60;
    this.minutes = (time - (time % 60)) / 60;

    status === "ready" ? timeElement.textContent = "Time: 0:00" : timeElement.textContent = `Time: ${this.minutes}:${this.isZero() ? "0" : ""}${this.seconds}`;
    status === "ready" ? movesElement.textContent = "Move: 0" : movesElement.textContent = `Move: ${move}`;

    // Render message
    status === "won" ? document.querySelector(".message").textContent = "You win!" : document.querySelector(".message").textContent = "";
  }
  isZero() {
    return this.seconds < 10;
  }
}

window.addEventListener("DOMContentLoaded", function () {
  document.onkeydown = Game.keyPress;
});

const months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};

function getConstArray(size){
  let array = [], subArray = [];

  for(let i = 1; i <= Math.pow(size,2); i++) {
    if(i % size === 0) {
      i === Math.pow(size,2) ? subArray.push(0) : subArray.push(i);
      array.push(subArray);
      subArray = [];
    } else {
      subArray.push(i);
    }
  }

  return array;
}

function getImagesArray(size) {
  let image = new Image();
  image.src = `assets/images/${getImage()}`;
  imagesParts = [];
  imagesParts.push("");

  canvas.width = gameWidth / size;
  canvas.height = gameWidth / size;

  image.onload = function () {
    const width = image.width, height = image.height;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        ctx.drawImage(image, j * (width / size), i * (height / size),
            width / size, height / size,
            0, 0,
            gameWidth / size, gameWidth / size);
        imagesParts.push(canvas.toDataURL());
      }
    }
  };
}

async function getJSON() {
  const res = await fetch("images.json");
  const data = await res.json();
  const name = document.createElement("div");
  const author = document.createElement("div");
  const index = parseInt(getImage().substring(0, getImage().length - 4));

  while (congratulationAuthor.childElementCount !== 0)
    congratulationAuthor.removeChild(congratulationAuthor.firstChild);

  name.textContent = `${data[index - 1].name} - ${data[index - 1].year}r.`;
  author.textContent = `${data[index - 1].author}`;
  congratulationAuthor.append(name,author);
}

const GAME = Game.ready();