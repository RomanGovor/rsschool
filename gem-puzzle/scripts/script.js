const modalWindow = document.querySelector(".background");
const menuWindow = document.querySelector(".background__menu");
const settingsMenu = document.querySelector(".settings__menu");
const scoresMenu = document.querySelector(".scores");
const resultsContent = document.querySelector(".scores > table > tbody");
const congratulationContent = document.querySelector(".congratulation__info");
const congratulationAuthor = document.querySelector(".congratulation__author");
const featuresMenu = document.querySelector(".features__menu");
const backgroundContainer = document.querySelector(".background__container");


const menuBtn = document.querySelector(".menu");
const solveBtn = document.querySelector(".solve");
const closeMenuBtn = document.querySelector(".close-menu");
const newGameBtn = document.querySelector(".new-game");
const backBtns = document.querySelectorAll(".back");
const settingsBtn = document.querySelector(".settings");
const selectBox = document.querySelector(".select-box");
const clickSoundBtn = document.querySelector(".click-sound");
const clickPictureBtn = document.querySelector(".click-picture");
const bestScoresBtn = document.querySelector(".best-scores");
const closeWinBtn = document.querySelector(".close-win");
const featuresBtn = document.querySelector(".features");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const independentVars = {
  gameWidth : 600,
  sizeTemp : 0,
  keyNum : 0,
  imagesParts : [],
  init : 0,
  months : {
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
  }
};

console.log("Автосохранение происходит автоматически. И при перезагрузке страницы вы продолжите игру");

// Get grid from local storage
// eslint-disable-next-line no-unused-vars
function getGrid() {
  let str = localStorage.getItem("currentGrid");
  return str === null ? getRandomGrid(getSize()) : getSubArrays(str,getSize());
}

// Get moves from local storage
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
function setImage(img) {
  return localStorage.setItem("currentImage", img);
}

// Getting subarray
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

  independentVars.imagesParts = [];
  canvas.width = independentVars.gameWidth / size;
  canvas.height = independentVars.gameWidth / size;

  image.onload = function () {
    const width = image.width, height = image.height;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        ctx.drawImage(image, j * (width / size), i * (height / size),
            width / size, height / size,
            0, 0,
            independentVars.gameWidth / size, independentVars.gameWidth / size);
        independentVars.imagesParts.push(canvas.toDataURL());
      }
    }
  };
}

// eslint-disable-next-line no-unused-vars
async function getDescriptionOfPicture() {
  const res = await fetch("images.json");
  const data = await res.json();
  const name = document.createElement("div");
  const author = document.createElement("div");
  const index = parseInt(getImage().substring(0, getImage().length - 4));

  name.textContent = `${data[index - 1].name} - ${data[index - 1].year}r.`;
  author.textContent = `${data[index - 1].author}`;
  congratulationAuthor.append(name,author);
}

// Check on solved
const isSolved = (grid) => {
  return JSON.stringify(grid) === JSON.stringify(getConstArray(grid.length));
};

// Create new random grid
const getRandomGrid = (size) => {
  let grid = getConstArray(size);

  // Shuffle
  let blankBox = new Box(size - 1, size - 1, size);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
    Box.swapBoxes(grid, blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }

  // If current grid is solved
  if (isSolved(grid)) return getRandomGrid(size);
  return grid;
};


class Game{
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.tick = this.tick.bind(this);// Set time to update grid
    this.render();                   // Render Grid
    this.setEvents();                // Set all handlers events
    this.handleClickBox = this.handleClickBox.bind(this);
    this.moveFakeButton = this.moveFakeButton.bind(this);
    this.checkOnEmptyBox = this.checkOnEmptyBox.bind(this);
    this.editSizeBox();              // Update size of grid
    this.setTableRecords();          // Set personal best scores
    this.sound = true;               // Flag of sound click
    this.pictureMode = true;         // Flag of picture mode
    getImagesArray(this.state.size); // Get array of small picture
    this.automatedSolve = false;     // Flag of automated solve mode
    document.querySelector(".message").textContent = ""; // Set state dialog message
    this.dragBtn = -1;               // Number of drag element

  }

  static ready() { // Set state of game in ready
    return new Game(State.ready());
  }

  static keyPress(e) { // Keypress handling
    if (window.event) {
      independentVars.keyNum = window.event.keyCode;
    }
    else if (e) {
      independentVars.keyNum = e.which;
    }
  }

  tick() { // Update grid each second
    setTime(this.state.time + 1);
    this.setState({ time: this.state.time + 1 });
  }

  playSound() { // Play sounds on moving button
      const sound = document.querySelector(".shift__sound");
      sound.currentTime = 0;
      sound.play();
  }

  editSizeBox() { // Change next size of grid
    selectBox.value = getSize();
  }

  setTableRecords () {  // Set updated table records
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

  removeTableRecords() {   // Clear table records
      while (resultsContent.childElementCount !== 1)
        resultsContent.removeChild(resultsContent.lastChild);
  }

  setEvents() {     // Set Events Listeners
    menuBtn.addEventListener("click", () => {
      this.setOffsetOfMenu();
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
      independentVars.sizeTemp = parseInt(selectBox.value);
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
      modalWindow.style.display = "none";
      modalWindow.classList.toggle("blackout");
    });

    solveBtn.addEventListener("click", () => {
      if(this.state.status === "playing") this.canThisBeResolved(this.state.grid);
    });
  }

  setState(newState) { // Set new state of grid
    this.state = { ...this.state, ...newState };
    this.render();
  }

  updateRecords(obj) {   // Updates array of records
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

  isWin(obj) { // If solve the game
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

    if(this.pictureMode) getDescriptionOfPicture();

    document.querySelector(".message").textContent = "You win!";
  }

  canThisBeResolved(grid) { // Check on solve
    let totalCount = 0, rowZero = 0, fl = true;
    const arr = grid.flat();
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] === 0) {
        rowZero = Math.ceil((i + 1) / Math.sqrt(arr.length));
      }
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

      const solver = new Solver(newGrid);
      const solution = solver.solve();

      const countMoveToSolve = solution.length;
      let i = 0, fakeMove = this.moveFakeButton.bind(this);

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
        }
      }
      moving();
    }
  }

  updateGridBoxes(box,blankBox) { // Update boxes
    const newGrid = [...this.state.grid];
    Box.swapBoxes(newGrid, box, blankBox);

    setMoves(this.state.move + 1);
    if(this.sound) this.playSound();

    if (isSolved(newGrid)) {
      clearInterval(this.tickId);

      this.setState({ status: "won", grid: newGrid, move: this.state.move + 1 });
      const date = new Date();
      const obj = {
        date: `${date.getDate()} ${independentVars.months[date.getMonth()]} ${date.getFullYear()}`,
        moves: this.state.move + 1,
        time: this.state.time,
        size: `${this.state.size}x${this.state.size}`
      };

      this.setOffsetOfMenu();
      const bg = document.querySelector(".transparent_bg");
      if(bg.style.display !== "flex") {
        this.updateRecords(obj);
      }
      this.isWin(obj);

      const movesElement =  document.getElementById("move");
      movesElement.textContent = `Move: ${obj.moves}`;

      setMoves(0);
      setTime(0);
      setSize(independentVars.sizeTemp);
      setGrid(getRandomGrid(getSize()));
    }
    else {
      setGrid(newGrid);
      this.setState({ grid: newGrid, move: this.state.move + 1 });
    }
  }

  moveFakeButton(box, blankBox, button, isInversion) { // Create fake box, then will be do effect of moving
      button.classList.toggle("passive");
      button.classList.toggle("active");

      if(document.querySelector(".b") !== null)
        document.body.removeChild(document.querySelector(".b"));

      let b = document.createElement("button");
      b.classList.add("active","b");
      b.textContent = button.textContent;
      b.style.width = `${independentVars.gameWidth/box.size}px`;
      b.style.height = `${independentVars.gameWidth/box.size}px`;

      b.style.backgroundImage = button.style.backgroundImage;

      b.style.top = `${button.offsetTop}px`;
      b.style.left = `${button.offsetLeft}px`;

      document.body.append(b);
      button.textContent = "";
      button.style.backgroundImage = "";

      const fakeButton = document.querySelector(".b");

      if(box.x + 1 === blankBox.x)
        fakeButton.style.left = isInversion ? `${button.offsetLeft - independentVars.gameWidth/box.size}px` :`${button.offsetLeft + independentVars.gameWidth/box.size}px`;
      if(box.x - 1 === blankBox.x)
        fakeButton.style.left = isInversion ? `${button.offsetLeft + independentVars.gameWidth/box.size}px` :`${button.offsetLeft - independentVars.gameWidth/box.size}px`;
      if(box.y + 1 === blankBox.y)
        fakeButton.style.top = isInversion ? `${button.offsetTop - independentVars.gameWidth/box.size}px` :`${button.offsetTop + independentVars.gameWidth/box.size}px`;
      if(box.y - 1 === blankBox.y)
        fakeButton.style.top = isInversion ? `${button.offsetTop + independentVars.gameWidth/box.size}px` :`${button.offsetTop - independentVars.gameWidth/box.size}px`;

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      delay(300).then(() => {
        this.updateGridBoxes(box,blankBox);
        document.body.removeChild(fakeButton);
        this.render();
      });

  }

  keydownClickBox(key, size) { // Keydown update grid
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

  handleClickBox(box,button) { // Click on box
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

  dragndrop(button,box) {
    // Make prototype of checkOnEmptyBox function
    const checkBoxes = this.checkOnEmptyBox.bind(this);

    button.classList.toggle("passive");
    button.classList.toggle("active");

    this.dragBtn = parseInt(button.textContent);

    let currentGridPosX = box.x;
    let currentGridPosY = box.y;

    button.addEventListener("dragend", (event) => {
      const widthBtn = independentVars.gameWidth/box.size;
      // Coordinates first button
      const startPosObj = this.getPositionElementOnPage(".grid > button:nth-child(1)");
      const startPosLeft = startPosObj.left, startPosTop = startPosObj.top;

      // Next coordinates
      const nextGridPosX = Math.floor((event.clientX - startPosLeft)/ widthBtn);
      const nextGridPosY = Math.floor((event.clientY - startPosTop) / widthBtn);

      this.dragBtn = -1;

      // Check coordinate
      if(nextGridPosX >= 0 && nextGridPosX <= box.size - 1 && nextGridPosY >= 0 && nextGridPosY <= box.size - 1) {
        checkBoxes(new Box(currentGridPosX,currentGridPosY,box.size),new Box(nextGridPosX,nextGridPosY,box.size));
      } else {
        this.render();
      }

      currentGridPosX = -1;
      currentGridPosY = -1;

      button.classList.toggle("passive");
      button.classList.toggle("active");
    });
  }

  checkOnEmptyBox(box,otherBox) { // If dropped element is empty
    if(document.querySelector(".b") === null) {
      const nextdoorBoxes = box.getNextdoorBoxes();
      const blankBox = nextdoorBoxes.find(nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0);
      document.querySelector(".message").textContent = "";

      if (blankBox && blankBox.x === otherBox.x && blankBox.y === otherBox.y) {
        this.updateGridBoxes(box,blankBox);
      }
    }
  }

  getPositionElementOnPage(selector) { // Get position of element;
    const firstBtn = document.querySelector(selector);
    const box = firstBtn.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  setOffsetOfMenu() {
    const game = document.querySelector(".game");
    const coorditates = this.getPositionElementOnPage(".game");

    backgroundContainer.style.top = `${coorditates.top}px`;
    backgroundContainer.style.left = `${coorditates.left}px`;
    backgroundContainer.style.width = `${game.offsetWidth}px`;
    backgroundContainer.style.height = `${game.offsetHeight}px`;
  }

  hideButtons(button) { // Hide button
    button.classList.add("hide-btn");
    button.textContent = "";
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {grid, move, time, status, size, image} = this.state;

    // Render grid
    const newGrid = document.createElement("div");
    newGrid.className = "grid";
    newGrid.style.gridTemplateRows = `repeat(${size}, ${independentVars.gameWidth / size}px)`;
    newGrid.style.gridTemplateColumns = `repeat(${size}, ${independentVars.gameWidth / size}px)`;

    // Check on fake button on HTML
    const but = document.querySelector(".b");
    let hideBtn = 0;
    if (but !== null) {   // If fake button here
      hideBtn = parseInt(but.textContent); // Get number of fake button
    }

    // Allow drag n drop
    newGrid.ondragover = function (event) {
      event.preventDefault();
    };

    for (let i = 0; i < size; i++)
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");

        if (status === "playing") {
          button.addEventListener("click", this.handleClickBox(new Box(j, i, size), button));
          button.setAttribute("draggable","true"); // Allow moving element
          button.addEventListener("dragstart", () => this.dragndrop(button,new Box(j, i, size)));
        }

        // key control
        if (status === "playing") window.onkeydown = () => {
          if (independentVars.keyNum === 37 || independentVars.keyNum === 38 || independentVars.keyNum === 39 || independentVars.keyNum === 40) this.keydownClickBox(independentVars.keyNum, size);
        };

        // picture mode enable
        if(this.pictureMode && independentVars.imagesParts.length !== 0) {
          let index = grid[i][j] === 0 ? Math.pow(size, 2) - 1: grid[i][j] - 1;
          button.style.backgroundImage = `url('${independentVars.imagesParts[index]}')`;
        }

        button.textContent = grid[i][j] === 0 || grid[i][j] === hideBtn || grid[i][j] === this.dragBtn ? "" : grid[i][j].toString();
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

  isZero() { // Check on
    return this.seconds < 10;
  }
}

window.addEventListener("DOMContentLoaded", function () {
  document.onkeydown = Game.keyPress;
});

const GAME = Game.ready();