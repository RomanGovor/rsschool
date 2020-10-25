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


console.log('Если вы видите в консоли ошибку 429, это не проблема того сайта с которого парсятся цитаты, а именно гит хаба. Отнеситесь с пониманием!)))');
console.log('Если цитата сразу не обновляется - подождите пожалуйста');

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
let currentText = '';

// Initial data
function initialData() {
    bg.style.background = `url('${arrImg[currentHour]}')`;
    currentImgIndex.textContent = `${currentIndex}`;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    arrowLeft.classList.add('disabled');
    arrowRight.classList.add('disabled');
    delay(3000).then(() => {
        arrowLeft.classList.remove('disabled');
        arrowRight.classList.remove('disabled');
    })

}

// Get Name
function getName() {
    if(localStorage.getItem('name') === null) {
        name.textContent = '[Name]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

// Set Name
function setName(e) {
    if(e.type === 'click') {
        currentText = e.target.textContent;
        e.target.innerText = '';
    }

    if(e.type === 'keypress') {
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else if(e.type === 'blur') {
        if(e.target.textContent === '' || e.target.textContent.trim() === '' || e.target.textContent === null)
            localStorage.setItem('name', currentText);
         else localStorage.setItem('name', e.target.innerText);
        getName();
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

// set focus
function setFocus(e) {
    if(e.type === 'click') {
        currentText = e.target.textContent;
        e.target.innerText = '';
    }

    if(e.type === 'keypress') {
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else if(e.type === 'blur') {
        if(e.target.textContent === '' || e.target.textContent.trim() === '' || e.target.textContent === null)
            localStorage.setItem('focus', currentText);
        else localStorage.setItem('focus', e.target.innerText);
        getFocus();
    }
}

arrowLeft.addEventListener('click', () => {
    if(!arrowLeft.classList.contains('disabled')) {
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
    }
})


arrowRight.addEventListener('click', () => {
    if(!arrowRight.classList.contains('disabled')) {
        prevIndex = currentIndex;
        currentIndex++;
        if (currentIndex === 24) {
            currentIndex = 0;
            updateBackground(currentIndex);
            currentImgIndex.textContent = `${currentIndex}`;

        } else {
            updateBackground(currentIndex);
            currentImgIndex.textContent = `${currentIndex}`;
        }
    }
})

// Get quote
async function getQuote() {
    const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
    const res = await fetch(url);
    const data = await res.json();

    if(data.quoteText.length <= 110) {
        blockquote.textContent = data.quoteText;
        figcaption.textContent = data.quoteAuthor;
    } else setTimeout(getQuote, 100);
}


const weatherIcon = document.querySelector('.weather-icon'),
    temperature = document.querySelector('.temperature'),
    weatherDescription = document.querySelector('.weather-description'),
    city = document.querySelector('.city'),
    humidity = document.querySelector('.humidity'),
    windSpeed = document.querySelector('.wind-speed');

// Get weather
async function getWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=d8c9b11eae3ccd97e4e8d993f1c8665d&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if(data.cod === 200) {
            weatherIcon.className = 'weather-icon owf';
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
            temperature.textContent = `${data.main.temp}°C`;
            temperature.style.color = `white`;
            weatherDescription.textContent = data.weather[0].description;
            humidity.textContent = `humidity - ${data.main.humidity}%`;
            windSpeed.textContent = `wind speed - ${data.wind.speed} m/s`;
        } else {
            weatherIcon.className = '';
            temperature.textContent = `ERROR`;
            temperature.style.color = `rgba(255,0,0,0.8)`;
            weatherDescription.textContent = 'City not found';
            humidity.textContent = `Or bad app id`;
            windSpeed.textContent = ``;
        }

    }
    catch (e) {
        // alert(`Error. Several problems are possible\n1) City's ${city.textContent} not found \n2) Internet connection\n3) Bad App id`);
    }
}

// Get City
function getCity() {
    if(localStorage.getItem('city') === null) {
        city.textContent = 'Minsk';
    } else {
        city.textContent = localStorage.getItem('city');
    }
}

// set city
function setCity(e) {
    if(e.type === 'click') {
        currentText = e.target.textContent;
        e.target.innerText = '';
    }

    if(e.type === 'keypress') {
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('city', e.target.innerText);
            city.blur();
        }
    } else if(e.type === 'blur') {
        if(e.target.textContent === '' || e.target.textContent.trim() === '' || e.target.textContent === null)
            localStorage.setItem('city', currentText);
        else  {
            localStorage.setItem('city', e.target.innerText);
            getWeather();
        }
        getCity();
    }
}


document.addEventListener('DOMContentLoaded', getQuote);
btn.addEventListener('click', getQuote);

name.addEventListener('click', setName);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('click', setFocus);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

city.addEventListener('click', setCity);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

document.addEventListener('DOMContentLoaded', getWeather);

setInterval(getWeather,3000);

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
getCity();
