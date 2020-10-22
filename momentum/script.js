// Objects for Date

const daysWeek = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
};

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}


// DOM Elements
const time = document.querySelector('.time'),
    greeting = document.querySelector('.greeting'),
    name = document.querySelector('.name'),
    focus = document.querySelector('.focus'),
    date = document.querySelector('.date');

const bg = document.querySelector('.for_bg'),
    arrowLeft = document.querySelector('.arrow-left'),
    arrowRight = document.querySelector('.arrow-right'),
    currentImgIndex = document.querySelector('.current-img');

const blockquote = document.querySelector('blockquote'),
      figcaption = document.querySelector('figcaption'),
      btn = document.querySelector('.btn');

let arrImg = getArrayImages(),currentDay = new Date().getDate(), currentHour = new Date().getHours(),currentIndex = currentHour,prevIndex = currentIndex;

// Initial data
function initialData() {
    bg.style.background = `url('${arrImg[currentHour]}')`;
    currentImgIndex.textContent = `${currentIndex}`;
}

// Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
    setTimeout(showTime, 1000);
}

// Show Date
function getDate() {
    let day = new Date().getDate();

    if(day !== currentDay) {
        getInfoDate();
        currentDay = day;
    }
   // console.log(window.getComputedStyle( arrowLeft ,null).getPropertyValue('background-color'));
    setTimeout(getDate, 1000);
}

function getInfoDate() {
    let today = new Date(),
        dayOfWeek = today.getDay(),
        day = today.getDate(),
        month = today.getMonth(),
        year = today.getFullYear();

    date.innerText = `${daysWeek[dayOfWeek]}, ${day} ${months[month]} ${year}`;
}

// Generate array background images
function getArrayImages() {
    const indexArray = randomArray(24);

    let arr = [];
    for(let i = 0 ; i < 6; i++) {
        arr[i] = `assets/images/night/night-${indexArray[i]}.jpg`;
        arr[i + 6] = `assets/images/morning/morning-${indexArray[i + 6]}.jpg`;
        arr[i + 12] = `assets/images/afternoon/afternoon-${indexArray[i +12]}.jpg`;
        arr[i + 18] = `assets/images/evening/evening-${indexArray[i + 18]}.jpg`;
    }
    return arr;
}

/* Generate random values */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/* Generate random array of numbers */
function randomArray(n) {
    let currentArr = [];
    for (let i = 0; i < n; i++) {
        currentArr.push(i + 1);
    }

    let arr = [];
    for (let i = 0; i < n; i++) {
        let removed = currentArr.splice(getRandomInt(n - i), 1);
        arr.push(removed[0]);
    }
    return arr;
}

// Add Zeros
function addZero(n) {
    return (parseInt(n,10) < 10 ? '0' : '') + n;
}

// Set Bg and Greeting
function setBgGreet() {
    let today = new Date(),
       hour = today.getHours();

    if(hour !== currentHour) {
        currentHour = hour;
        prevIndex = currentIndex;
        currentIndex = currentHour;
        setStyles(currentHour)
        updateBackground(currentHour);
        currentImgIndex.textContent = `${currentHour}`;
    }
    setTimeout(setBgGreet, 1000);
}

// Set color styles
function setStyles(hour) {
    if(hour < 6) {                              // Night
        greeting.textContent = 'Good Night,';
        document.body.style.color = 'white';
        updateArrows(true);
    } else if (hour < 12) {                     // Morning
        greeting.textContent = 'Good Morning,';
        document.body.style.color = 'white';                 ///////////////////////
        updateArrows(true);
    } else if(hour < 18) {                      // Afternoon
        greeting.textContent = 'Good Afternoon,';
        document.body.style.color = 'white';                 /////////////////////
        updateArrows(true);
    } else {                                    // Evening
        greeting.textContent = 'Good Evening,';
        document.body.style.color = 'white';
        updateArrows(true);
    }
}

// Update arrows
function updateArrows(isNight) {
    const element = document.createElement('img');
    element.classList.add("arrow", 'left');
    if(isNight) {
        element.setAttribute('src','assets/icons/left-arrow-white.svg')
    } else {
        element.setAttribute('src','assets/icons/left-arrow.svg')
    }
    document.querySelector('.left').replaceWith(element);

    const element1 = document.createElement('img');
    element1.classList.add("arrow", 'right');
    if(isNight) {
        element1.setAttribute('src','assets/icons/right-arrow-white.svg')
    } else {
        element1.setAttribute('src','assets/icons/right-arrow.svg')
    }
    document.querySelector(`.right`).replaceWith(element1);

    if(isNight) {
        document.querySelector('.current-img').style.color = 'white';
    } else {
        document.querySelector('.current-img').style.color = 'black';
    }
}

// Update background
function updateBackground(index) {
    const element = document.createElement('div');
    document.body.style.background = `url(${arrImg[prevIndex]})`;
    element.classList.add("for_bg", 'animated', 'fadeInRight');
    element.style.background = `url('${arrImg[index]}')`;
    document.querySelector(`.for_bg`).replaceWith(element);
}

// Get Name
function getName() {
    if(localStorage.getItem('name') === null) {
        name.textContent = '(Your Name)';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

// Set Name
function setName(e) {
    if(e.type === 'keypress') {
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem('name', e.target.innerText);
    }
}

// Get Focus
function getFocus() {
    if(localStorage.getItem('focus') === null) {
        focus.textContent = '(Your Focus)';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

function setFocus(e) {
    if(e.type === 'keypress') {
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem('focus', e.target.innerText);
    }
}

arrowLeft.addEventListener('click', () => {
    prevIndex = currentIndex;
    currentIndex--;
    if(currentIndex === -1) {
        currentIndex = 23;
        updateBackground(currentIndex);
        currentImgIndex.textContent = `${currentIndex}`;

    } else {
        updateBackground(currentIndex);
        currentImgIndex.textContent = `${currentIndex}`;
    }
})


arrowRight.addEventListener('click', () => {
    prevIndex = currentIndex;
    currentIndex++;
    if(currentIndex === 24) {
        currentIndex = 0;
        updateBackground(currentIndex);
        currentImgIndex.textContent = `${currentIndex}`;

    }
    else {
        updateBackground(currentIndex);
        currentImgIndex.textContent = `${currentIndex}`;
    }
})

// Get quote
async function getQuote() {
    const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
    const res = await fetch(url);
    const data = await res.json();
    blockquote.textContent = data.quoteText;
    figcaption.textContent = data.quoteAuthor;
}
document.addEventListener('DOMContentLoaded', getQuote);
btn.addEventListener('click', getQuote);

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);



const weatherIcon = document.querySelector('.weather-icon'),
    temperature = document.querySelector('.temperature'),
    weatherDescription = document.querySelector('.weather-description'),
    city = document.querySelector('.city');

// Get weather
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=d8c9b11eae3ccd97e4e8d993f1c8665d&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

// Run
initialData();
getInfoDate();
setStyles(currentHour);
showTime();
getDate();
setBgGreet();
getName();
getFocus();
getQuote();
