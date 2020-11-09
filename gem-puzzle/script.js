const modalWindow = document.querySelector(".background__modal");
const menuWindow = document.querySelector(".background__menu");
const settingsMenu = document.querySelector(".settings__menu");
const scoresMenu = document.querySelector(".scores");
const resultsContent = document.querySelector(".scores > table > tbody");
const congratulationContent = document.querySelector(".congratulation__info");
const congratulationAuthor = document.querySelector(".congratulation__author");
const featuresMenu = document.querySelector(".features__menu");


const menuBtn = document.querySelector(".menu");
const solveBtn = document.querySelector(".solve");
const closeMenuBtn = document.querySelector(".close__menu");
const newGameBtn = document.querySelector(".new__game");
const backBtns = document.querySelectorAll(".back");
const settingsBtn = document.querySelector(".settings");
const selectBox = document.querySelector(".select-box");
const clickSoundBtn = document.querySelector(".click-sound");
const clickPictureBtn = document.querySelector(".click-picture");
const bestScoresBtn = document.querySelector(".best__scores");
const closeWinBtn = document.querySelector(".close-win");
const featuresBtn = document.querySelector(".features");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let init = 0, sizeTemp = 0 ,keyNum = 0, imagesParts = [];
const gameWidth = 600;



function getBgGradient() {
  const colors =[
    "#ffcb52", "#ff7b02","#c165dd", "#5c27fe", "#2afeb7", "#08c792", "#5581f1", "#1153fc",
    "#facd68", "#fc76b3", "#00f7a7", "#04f5ed", "#1de5e2", "#b588f7", "#ffe324","#ffb533"
  ];
  document.body.style.backgroundImage = `linear-gradient(45deg,${colors[getRandomInt(colors.length) - 1]}, ${colors[getRandomInt(colors.length) - 1]})`;
}

getBgGradient();


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
    this.moveFakeButton = this.moveFakeButton.bind(this);
    this.sound = true;
    this.pictureMode = true;
    this.editSizeBox();
    this.setTableRecords();
    getImagesArray(this.state.size);
    this.automatedSolve = false;
    document.querySelector(".message").textContent = "";
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
      featuresMenu.style.display = "none";
      menuWindow.style.display = "flex";
    }));

    selectBox.addEventListener("change", () => {
      sizeTemp = parseInt(selectBox.value);
    });

    clickSoundBtn.addEventListener("change", () => {
      clickSoundBtn.checked ? this.sound = true : this.sound = false;
    });

    clickPictureBtn.addEventListener("change", () => {
      clickPictureBtn.checked ? this.pictureMode = true : this.pictureMode = false;
      this.render();
    });

    bestScoresBtn.addEventListener("click", () => {
      scoresMenu.style.display = "flex";
      menuWindow.style.display = "none";
    });

    featuresBtn.addEventListener("click", () => {
      featuresMenu.style.display = "flex";
      menuWindow.style.display = "none";
    });

    closeWinBtn.addEventListener("click", () => {
      congratulationContent.parentNode.style.display = "none";
      menuWindow.style.display = "none";
      modalWindow.classList.toggle("blackout");
    });

    solveBtn.addEventListener("click", () => {
      if(this.state.status === "playing") this.isSolved(this.state.grid);
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

    while (congratulationAuthor.childElementCount !== 0)
      congratulationAuthor.removeChild(congratulationAuthor.firstChild);

    modalWindow.classList.toggle("blackout");
    modalWindow.style.display = "flex";
    menuWindow.style.display = "none";
    congratulationContent.parentNode.style.display = "block";

    movesElem.textContent = `Moves: ${obj.moves - 1}`;
    timeElem.textContent = `Time: ${minutes}m ${seconds}s`;
    timeElem.style.marginLeft = "3vw";

    congratulationContent.append(movesElem,timeElem);

    if(this.pictureMode) getJSON();

    document.querySelector(".message").textContent = "You win!";
  }

  isSolved(grid) {
    let totalCount = 0, rowZero = 0, fl = true;
    const arr = grid.flat();
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] === 0) {
        rowZero = Math.ceil((i + 1) / Math.sqrt(arr.length));}
      else if(i + 1 !== arr[i] || !fl) {
        fl = false;
        let count = 0;
        for(let j = 0; j < i + 1; j++) {
          // eslint-disable-next-line no-unused-vars
          if(arr[j] > arr[i]) count++;
        }
        // eslint-disable-next-line no-unused-vars
        totalCount += count;
      }
    }
    if(Math.sqrt(arr.length) % 2 === 0) {
      if(((rowZero + 1) % 2 === 1 && totalCount % 2 === 0) || ((rowZero + 1) % 2 === 0 && totalCount % 2 === 1)) {
        document.querySelector(".message").textContent = "Can be solved";
        this.toSolve(grid);
      }
      else document.querySelector(".message").textContent = "Can not be solved";
    } else {
      if(totalCount % 2 === 0) {
        document.querySelector(".message").textContent = "Can be solved";
        this.toSolve(grid);
      }
      else document.querySelector(".message").textContent = "Can not be solved";
    }
  }

  toSolve(grid) {
    const bg = document.querySelector(".transparent_bg");
    if(bg.style.display === "none" || bg.style.display === "") {
      bg.style.display = "flex";
      this.automatedSolve = true;

      let newGrid = [];
      for (let i = 0; i < grid.length; i++) {
        let subGrid = [];
        for (let j = 0; j < grid.length; j++) {
          if (grid[i][j] === 0) subGrid.push("");
          else subGrid.push(grid[i][j]);
        }
        newGrid.push(subGrid);
      }

      const solver = new NPuzzleSolver(newGrid);
      const solution = solver.solve();

      const countMoveToSolve = solution.length;
      let i = 0, solving = this.automatedSolve;
      console.log(solution);

      let fakeMove = this.moveFakeButton.bind(this);

      // eslint-disable-next-line no-inner-declarations
      function moving() {
        if (i < countMoveToSolve && !modalWindow.classList.contains("blackout")) {
          const blankBox = new Box(solution[i].empty.x, solution[i].empty.y, grid.length);
          const box = new Box(solution[i].piece.x, solution[i].piece.y, grid.length);
          const button = document.querySelector(`body > div.game > div > button:nth-child(${grid.length * box.y + (box.x + 1)})`);
          fakeMove(box, blankBox, button, false);
          i++;
          // eslint-disable-next-line no-unused-vars
          setTimeout(moving.bind(this), 300);
        } else {
          bg.style.display = "none";
          // eslint-disable-next-line no-unused-vars
          solving = false;
        }
      }
      moving();
      console.log(this.automatedSolve);
    }
  }

  updateGridBoxes(box,blankBox) {
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

      const bg = document.querySelector(".transparent_bg");
      if(bg.style.display !== "flex") {
        this.updateRecords(obj);
      }
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

      if(document.querySelector(".b") !== null)
        document.body.removeChild(document.querySelector(".b"));

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

  }

  keydownClickBox(key, size) {
    const bg = document.querySelector(".transparent_bg");
    if(bg.style.display !== "flex") {
      if (document.querySelector(".b") === null && this.state.status === "playing") {
        let fl = true, box = 0, blankBox;

        switch (key) {
          case 37: // left
            for (let i = 0; i < size; i++) {
              if (this.state.grid[i][size - 1] === 0) {
                fl = !fl;
                break;
              }
            }
            break;
          case 39: // right
            for (let i = 0; i < size; i++) {
              if (this.state.grid[i][0] === 0) {
                fl = !fl;
                break;
              }
            }
            break;
          case 38: // top
            for (let i = 0; i < size; i++) {
              if (this.state.grid[size - 1][i] === 0) {
                fl = !fl;
                break;
              }
            }
            break;
          case 40: // bottom
            for (let i = 0; i < size; i++) {
              if (this.state.grid[0][i] === 0) {
                fl = !fl;
                break;
              }
            }
            break;
        }

        if (fl) {
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              if (this.state.grid[i][j] === 0) {
                box = new Box(j, i, size);
                switch (key) {
                  case 37: // left
                    blankBox = new Box(j + 1, i, size);
                    break;
                  case 39: // right
                    blankBox = new Box(j - 1, i, size);
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
          document.querySelector(".message").textContent = "";
        }
      }
    }
  }

  handleClickBox(box,button) {
    if(document.querySelector(".b") === null) {
      return function () {
        const nextdoorBoxes = box.getNextdoorBoxes();
        const blankBox = nextdoorBoxes.find(nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0);
        document.querySelector(".message").textContent = "";

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

        if(this.pictureMode) {
          let index = grid[i][j] === 0 ? Math.pow(size, 2): grid[i][j];
          button.style.backgroundImage = `url('${imagesParts[index]}')`;
        }

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
      document.querySelector(".message").textContent = "";
    });

    document.querySelector(".footer button").replaceWith(newButton);

    // Render move Render time
    const timeElement = document.getElementById("time");
    const movesElement = document.getElementById("move");

    this.seconds = time % 60;
    this.minutes = (time - (time % 60)) / 60;

    status === "ready" ? timeElement.textContent = "Time: 0:00" : timeElement.textContent = `Time: ${this.minutes}:${this.isZero() ? "0" : ""}${this.seconds}`;
    status === "ready" ? movesElement.textContent = "Move: 0" : movesElement.textContent = `Move: ${move}`;
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
  imagesParts.push(`assets/images/${getImage()}`);

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

  name.textContent = `${data[index - 1].name} - ${data[index - 1].year}r.`;
  author.textContent = `${data[index - 1].author}`;
  congratulationAuthor.append(name,author);
}


const GAME = Game.ready();














function NPuzzleSolver(toSolve) {
  this.grid = [];
  this.fixed = [];
  this.numbers = [];
  this.solution = [];
  this.originalGrid = toSolve;
}

NPuzzleSolver.prototype.setupSolver = function() {
  this.numbers = [];
  this.fixed = [];
  this.grid = [];

  for(let i = 0; i < this.originalGrid.length; i++) {
    this.fixed[i] = [];
    this.grid[i] = [];
    for(let j = 0; j < this.originalGrid.length; j++) {
      let num = this.originalGrid[i][j];
      this.grid[i][j] = num;
      this.fixed[i][j] = false;
      this.numbers[num] = { x : j, y : i };
    }
  }
};

NPuzzleSolver.prototype.solve = function() {
  this.setupSolver();
  try {
    this.solveGrid(this.grid.length);
  } catch (err) {
    console.log(err.message);
    return null;
  }
  return this.solution;
};

NPuzzleSolver.prototype.solveGrid = function(size) {
  if(size > 2) {
    // pattern solve nxn squares greater than 2x2
    this.solveRow(size); // solve the upper row first
    this.solveColumn(size); // solve the left column next
    this.solveGrid(size - 1); // now we can solve the sub (n-1)x(n-1) puzzle
  } else if(size === 2) {
    this.solveRow(size); // solve the row like normal
    // rotate last two numbers if they arent in place
    if(this.grid[this.grid.length - 1][this.grid.length - size] === "") {
      this.swapE({ x : this.grid.length - 1, y : this.grid.length - 1});
    }
  } // smaller than 2 is solved by definition
};

NPuzzleSolver.prototype.solveRow = function(size) {
  let rowNumber = this.grid.length - size;
  // using row number here because this is also our starting column
  for(let i = rowNumber; i < this.grid.length - 2; i++) {
    let number = rowNumber * this.grid.length + (i + 1); // calculate the number that is suppose to be at this position
    this.moveNumberTowards(number, { x : i, y : rowNumber});
    this.fixed[rowNumber][i] = true;
  }
  let secondToLast = rowNumber * this.grid.length + this.grid.length - 1;
  let last = secondToLast + 1;
  // position second to last number
  this.moveNumberTowards(secondToLast, { x : this.grid.length - 1, y : rowNumber });
  // position last number
  this.moveNumberTowards(last, { x : this.grid.length - 1, y : rowNumber + 1 });
  // double check to make sure they are in the right position
  if(this.numbers[secondToLast].x !== this.grid.length - 1 || this.numbers[secondToLast].y !== rowNumber ||
      this.numbers[last].x !== this.grid.length - 1 || this.numbers[last].y !== rowNumber + 1) {
    // the ordering has messed up
    this.moveNumberTowards(secondToLast, {x : this.grid.length - 1, y : rowNumber });
    this.moveNumberTowards(last, { x : this.grid.length - 2, y : rowNumber });
    this.moveEmptyTo({ x : this.grid.length - 2, y : rowNumber + 1 });
    // the numbers will be right next to each other
    let pos = { x : this.grid.length - 1, y : rowNumber + 1}; // square below last one in row
    let moveList = ["ul", "u", "", "l", "dl", "d", "", "l", "ul", "u", "", "l", "ul", "u", "", "d"];
    this.applyRelativeMoveList(pos, moveList);
    // now we reversed them, the puzzle is solveable!
  }
  // do the special
  this.specialTopRightRotation(rowNumber);
  // now the row has been solved :D
};

NPuzzleSolver.prototype.solveColumn = function(size) {
  let colNumber = this.grid.length - size;
  // use column number as this is the starting row
  for(let i = colNumber; i < this.grid.length - 2; i++) {
    let number = i * this.grid.length + 1 + colNumber;
    this.moveNumberTowards(number, { x : colNumber, y : i});
    this.fixed[i][colNumber] = true;
  }
  let secondToLast = (this.grid.length - 2) * this.grid.length + 1 + colNumber;
  let last = secondToLast + this.grid.length;
  // position second to last number
  this.moveNumberTowards(secondToLast, { x : colNumber, y : this.grid.length - 1 });
  // position last number
  this.moveNumberTowards(last, { x : colNumber + 1, y : this.grid.length - 1});

  // double check to make sure they are in the right position
  if(this.numbers[secondToLast].x !== colNumber || this.numbers[secondToLast].y !== this.grid.length - 1 ||
      this.numbers[last].x !== colNumber + 1 || this.numbers[last].y !== this.grid.length - 1) {
    // this happens because the ordering of the two numbers is reversed, we have to reverse them
    this.moveNumberTowards(secondToLast, { x : colNumber, y : this.grid.length - 1});
    this.moveNumberTowards(last, { x : colNumber, y : this.grid.length - 2});
    this.moveEmptyTo({ x : colNumber + 1, y : this.grid.length - 2});
    // the numbers will be stacked and the empty should be to the left of the last number
    let pos = { x : colNumber + 1, y : this.grid.length - 1 };
    let moveList = ["ul", "l", "", "u", "ur", "r", "", "u", "ul", "l", "", "u", "ul", "l", "", "r"];
    this.applyRelativeMoveList(pos, moveList);
    // now the order has been officially reversed
  }

  // do the special
  this.specialLeftBottomRotation(colNumber);
  // now the column is solved
};

NPuzzleSolver.prototype.applyRelativeMoveList = function(pos, list) {
  for(let i = 0; i < list.length; i++) {
    if(list[i] === "") {
      this.swapE(pos);
    } else {
      this.swapE(this.offsetPosition(pos, list[i]));
    }
  }
};

NPuzzleSolver.prototype.moveNumberTowards = function(num, dest) {
  // dont bother if the piece is in the right place, it can cause odd things to happen with the space
  if(this.numbers[num].x === dest.x && this.numbers[num].y === dest.y) return; // dont bother

  // choose where we want the empty square
  this.makeEmptyNeighborTo(num);
  // now empty will be next to our number and thats all we need
  while(this.numbers[num].x !== dest.x || this.numbers[num].y !== dest.y) {
    let direction = this.getDirectionToProceed(num, dest);
    if(!this.areNeighbors(num, "")) {
      throw "cannot rotate without empty";
    }
    if(direction === "u" || direction === "d") {
      this.rotateVertical(num, (direction === "u"));
    } else {
      this.rotateHorizontal(num, (direction === "l"));
    }
  }
};

NPuzzleSolver.prototype.rotateHorizontal = function(num, leftDirection) {
  let side = (leftDirection) ? "l" : "r";
  let other = (leftDirection) ? "r" : "l";
  let empty = this.numbers[""];
  let pos = this.numbers[num];
  if(empty.y !== pos.y) {
    // the empty space is above us
    let location = (empty.y < pos.y) ? "u" : "d";
    if(!this.moveable(this.offsetPosition(pos, location + side)) || !this.moveable(this.offsetPosition(pos, location))) {
      this.swapE(this.offsetPosition(pos, location + other));
      this.swapE(this.offsetPosition(pos, other));
      this.proper3By2RotationHorizontal(pos, leftDirection);
    } else {
      this.swapE(this.offsetPosition(pos, location + side));
      this.swapE(this.offsetPosition(pos, side));
    }
  } else if((empty.x < pos.x && !leftDirection) || (empty.x > pos.x && leftDirection)) {
    // its on the opposite that we want it on
    this.proper3By2RotationHorizontal(pos, leftDirection);
  }
  // now it is in the direction we want to go so just swap
  this.swapE(pos);
};

NPuzzleSolver.prototype.proper3By2RotationHorizontal = function(pos, leftDirection) {
  let side = (leftDirection) ? "l" : "r";
  let other = (leftDirection) ? "r" : "l";
  let location = "u"; // assume up as default
  if(this.moveable(this.offsetPosition(pos, "d" + side)) && this.moveable(this.offsetPosition(pos, "d")) && this.moveable(this.offsetPosition(pos, "d" + other))) {
    location = "d";
  } else if(!this.moveable(this.offsetPosition(pos, "u" + side)) || !this.moveable(this.offsetPosition(pos, "u")) || !this.moveable(this.offsetPosition(pos, "u" + other))) {
    throw "unable to move up all spots fixed";
  }
  this.swapE(this.offsetPosition(pos, location + other));
  this.swapE(this.offsetPosition(pos, location));
  this.swapE(this.offsetPosition(pos, location + side));
  this.swapE(this.offsetPosition(pos, side));
};

NPuzzleSolver.prototype.rotateVertical = function(num, upDirection) {
  let toward = (upDirection) ? "u" : "d";
  let away = (upDirection) ? "d" : "u";

  let empty = this.numbers[""];
  let pos = this.numbers[num];
  if(empty.x !== pos.x) {
    // its to the right or left
    let side = (empty.x < pos.x) ? "l" : "r";
    if(!this.moveable(this.offsetPosition(pos, toward + side)) || !this.moveable(this.offsetPosition(pos, side))) {
      this.swapE(this.offsetPosition(pos, away + side));
      this.swapE(this.offsetPosition(pos, away));
      this.proper2By3RotationVertical(pos, upDirection);
    } else {
      this.swapE(this.offsetPosition(pos, toward + side));
      this.swapE(this.offsetPosition(pos, toward));
    }
  } else if((empty.y < pos.y && !upDirection) || (empty.y > pos.y && upDirection)) {
    // its in the opposite direction we want to go
    this.proper2By3RotationVertical(pos, upDirection);
  }
  // now the empty is in the direction we need to go
  // so just swap with it
  this.swapE(pos);
};

NPuzzleSolver.prototype.proper2By3RotationVertical = function(pos, upDirection) {
  let toward = (upDirection) ? "u" : "d";
  let away = (upDirection) ? "d" : "u";

  let side = "r"; // default to right column usage
  if(this.moveable(this.offsetPosition(pos, toward + "l")) && this.moveable(this.offsetPosition(pos, "l")) && this.moveable(this.offsetPosition(pos, away + "l"))) {
    side = "l";
  } else if(!this.moveable(this.offsetPosition(pos, toward + "r")) || !this.moveable(this.offsetPosition(pos, "r")) || !this.moveable(this.offsetPosition(pos, away + "r"))) {
    throw "Unable to preform move, the puzzle is quite possibly unsolveable";
  }
  this.swapE(this.offsetPosition(pos, away + side));
  this.swapE(this.offsetPosition(pos, side));
  this.swapE(this.offsetPosition(pos, toward + side));
  this.swapE(this.offsetPosition(pos, toward));
};

NPuzzleSolver.prototype.specialTopRightRotation = function(top) {
  // lock the two pieces
  this.fixed[top][this.grid.length - 1] = true;
  this.fixed[top + 1][this.grid.length - 1] = true;
  // preform the swap
  let topRight = { x : this.grid.length - 1, y : top};
  this.moveEmptyTo(this.offsetPosition(topRight, "l"));
  this.swapE(topRight);
  this.swapE(this.offsetPosition(topRight, "d"));
  // lock proper pieces and unlock extra from next row
  this.fixed[top + 1][this.grid.length - 1] = false;
  this.fixed[topRight.y][topRight.x - 1] = true;
};

NPuzzleSolver.prototype.specialLeftBottomRotation = function(left) {
  // lock the two pieces
  this.fixed[this.grid.length - 1][left] = true;
  this.fixed[this.grid.length - 1][left + 1] = true;
  // preform the swap
  let leftBottom = { x : left, y : this.grid.length - 1};
  this.moveEmptyTo(this.offsetPosition(leftBottom, "u"));
  this.swapE(leftBottom);
  this.swapE(this.offsetPosition(leftBottom, "r"));
  // lock proper pieces and unlock extras from next column
  this.fixed[this.grid.length - 1][left + 1] = false;
  this.fixed[leftBottom.y - 1][leftBottom.x] = true;
};

NPuzzleSolver.prototype.getDirectionToProceed = function(num, dest) {
  let cur = this.numbers[num];
  let diffx = dest.x - cur.x;
  let diffy = dest.y - cur.y;
  // case 1, we need to move left and are not being blocked
  if(diffx < 0 && this.moveable({x : cur.x - 1, y : cur.y})) {
    return "l";
  }
  // case 2, we need to move right and are not being blocked
  if(diffx > 0 && this.moveable({x : cur.x + 1, y : cur.y})) {
    return "r";
  }
  // case 3, we need to move up
  if(diffy < 0 && this.moveable({x : cur.x, y : cur.y - 1})) {
    return "u";
  }
  // case 4, we need to move down
  if(diffy > 0 && this.moveable({x : cur.x, y : cur.y + 1})) {
    return "d";
  }
  throw "There is no valid move, the puzzle was incorrectly shuffled";
};

// eslint-disable-next-line no-unused-vars
NPuzzleSolver.prototype.makeEmptyNeighborTo = function(num, boundry) {
  let gotoPos = this.numbers[num];
  let counter = 1;
  while((this.numbers[""].x !== gotoPos.x || this.numbers[""].y !== gotoPos.y) && !this.areNeighbors("", num)) {
    this.movingEmptyLoop(gotoPos);
    counter++;
    if(counter > 100) {
      throw "Infinite loop hit while solving the puzzle, it is quite likely this puzzle is invalid";
    }
  }
};

NPuzzleSolver.prototype.moveEmptyTo = function(pos) {
  // check to see if the pos is a fixed number
  if(this.fixed[pos.y][pos.x]) {
    throw "cannot move empty to a fixed position";
  }
  let counter = 1;
  while(this.numbers[""].x !== pos.x || this.numbers[""].y !== pos.y) {
    this.movingEmptyLoop(pos);
    counter++;
    if(counter > 100) {
      console.log("problem trying to move the piece");
      break;
    }
  }
};

NPuzzleSolver.prototype.movingEmptyLoop = function(pos) {
  let empty = this.numbers[""];
  let diffx = empty.x - pos.x;
  let diffy = empty.y - pos.y;
  if(diffx < 0 && this.canSwap(empty, this.offsetPosition(empty, "r"))) {
    this.swap(empty, this.offsetPosition(empty, "r"));
  } else if(diffx > 0 && this.canSwap(empty, this.offsetPosition(empty, "l"))) {
    this.swap(empty, this.offsetPosition(empty, "l"));
  } else if(diffy < 0 && this.canSwap(empty, this.offsetPosition(empty, "d"))) {
    this.swap(empty, this.offsetPosition(empty, "d"));
  } else if(diffy > 0 && this.canSwap(empty, this.offsetPosition(empty, "u"))) {
    this.swap(empty, this.offsetPosition(empty, "u"));
  }
};

NPuzzleSolver.prototype.offsetPosition = function(pos, direction) {
  if(direction === "u") {
    return { x : pos.x , y : pos.y - 1 };
  } else if(direction === "d") {
    return { x : pos.x , y : pos.y + 1 };
  } else if(direction === "l") {
    return { x : pos.x - 1 , y : pos.y };
  } else if(direction === "r") {
    return { x : pos.x + 1 , y : pos.y };
  } else if(direction === "ul") {
    return { x : pos.x - 1, y : pos.y - 1};
  } else if(direction === "ur") {
    return { x : pos.x + 1, y : pos.y - 1};
  } else if(direction === "dl") {
    return { x : pos.x - 1, y : pos.y + 1};
  } else if(direction === "dr") {
    return { x : pos.x + 1, y : pos.y + 1};
  }
  return pos;
};

NPuzzleSolver.prototype.areNeighbors = function(first, second) {
  let num1 = this.numbers[first];
  let num2 = this.numbers[second];
  return (Math.abs(num1.x - num2.x) === 1 && num1.y === num2.y) || (Math.abs(num1.y - num2.y) === 1 && num1.x === num2.x);
};

NPuzzleSolver.prototype.moveable = function(pos) {
  return this.validPos(pos) && !this.fixed[pos.y][pos.x];
};

NPuzzleSolver.prototype.validPos = function(pos) {
  return !(pos.x < 0 || pos.x >= this.grid.length || pos.y < 0 || pos.y >= this.grid.length);
};

NPuzzleSolver.prototype.canSwap = function(pos1, pos2) {
  if(!this.validPos(pos1) || !this.validPos(pos2)) {
    return false;
  }
  let num1 = this.grid[pos1.y][pos1.x];
  let num2 = this.grid[pos2.y][pos2.x];
  if(!this.areNeighbors(num1, num2)) {
    return false;
  }
  // check fixed positions
  return !(this.fixed[pos1.y][pos1.x] || this.fixed[pos2.y][pos2.x]);
};

NPuzzleSolver.prototype.swapE = function(pos) {
  this.swap(this.numbers[""], pos);
};

NPuzzleSolver.prototype.swap = function(pos1, pos2) {
  let num1 = this.grid[pos1.y][pos1.x];
  let num2 = this.grid[pos2.y][pos2.x];
  // guard against illegal moves
  if(!this.areNeighbors(num1, num2)) {
    throw "These numbers are not neighbors and cannot be swapped";
  }
  if(num1 !== "" && num2 !== "") {
    throw "You must swap with an empty space";
  }
  let oldPos1 = this.numbers[num1];
  this.numbers[num1] = this.numbers[num2];
  this.numbers[num2] = oldPos1;
  this.grid[pos1.y][pos1.x] = num2;
  this.grid[pos2.y][pos2.x] = num1;
  this.solution.push({empty : (num1 === "") ? pos1 : pos2,
    piece : (num1 === "") ? pos2 : pos1,
    number : (num1 === "") ? num2 : num1});
};

