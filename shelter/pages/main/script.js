////////////////////*Burger menu*//////////////////////

const logoHeader = document.querySelector("body > div > header > div > div.logo"),
    hiddenMenuTicker = document.querySelector('.hidden-menu-ticker'),
    backgroundDiv = document.querySelector('.background-div'),
    headerLines = document.querySelector('.header-lines'),
    hiddenMenu = document.querySelector('.hidden-menu');

hiddenMenuTicker.addEventListener('change', () => {
    if (logoHeader.style.display === 'none') {
        hiddenMenu.style.right = '-320px';
        headerLines.style.transform = 'rotate(0deg)';
        logoHeader.style.display = 'flex';
        logoHeader.parentElement.style.justifyContent = 'space-between';
        backgroundDiv.classList.remove('blackout');
        headerLines.style.position = 'inherit';
        document.body.style.overflow = 'scroll';
    } else {
        hiddenMenu.style.right = '0';
        headerLines.style.transform = 'rotate(90deg)';
        logoHeader.style.display = 'none';
        logoHeader.parentElement.style.justifyContent = 'flex-end';
        backgroundDiv.classList.add('blackout');
        headerLines.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
    }
});



document.querySelector("body > div.wrapper > header > div > div.hidden-menu > ul > li:nth-child(2) > a").addEventListener('click', () => {
    hiddenMenu.style.right = '-320px';
})

////////////////*JSON*///////////////////////

const sliderBtnLeft = document.querySelector('.slider__btn-left'),
    sliderBtnRight = document.querySelector('.slider__btn-right'),
    modal = document.querySelector('.modal_window'),
    closeModal = document.querySelector('.btn_close'),
    backgroundModal = document.querySelector('.background__modal');

let data, currentIndex = 0;
const randomArr = randomArray();
getJSON(randomArr);

async function getJSON(randomArr) {
    const res = await fetch('../../../pets.json');
    data = await res.json();

    for (let i = 0; i < 3; i++) {
        createCard(data[randomArr[i]], `card-${i + 1}`);
    }
}

/* Создание карточки животного */
function createCard(data, numCard) {
    const element = document.createElement('div');
    element.classList.add("our-friend-card", numCard, 'animated', 'fadeIn');
    element.innerHTML = `
                 <img src="${data.img}" alt="${data.name}" class="our-friend-card__img">
                 <div class="our-friend-card__name">${data.name}</div>
                 <button class="our-friend-card__btn" type="button">Learn more</button>
            `;

    element.addEventListener('click', () => {
        createModal(data);
        modal.style.right = '9%';
        modal.style.top = '50%';
        modal.style.left = '55.5%';
        modal.style.transform = 'translate(-50%,-50%)';

        backgroundModal.classList.add('blackout');
    });
    document.querySelector(`.${numCard}`).replaceWith(element);
}

/* Создание и инициализация модального окна*/
function createModal(data) {
    const element = document.createElement('section');
    element.classList.add('modal__content');
    element.innerHTML = `
            <img class="modal__img" src="${data.img}" alt="${data.name}">
            <div class="modal-text">
                <h3 class="modal__title">${data.name}</h3>
                <h4 class="modal__subtitle">${data.type} - ${data.breed}</h4>
                <h5 class="modal__subheading">${data.description}</h5>
                <ul class="modal__list">
                    <li class="modal-list__item"><span class="point">&bull;</span><strong>Age: </strong>${data.age}</li>
                    <li class="modal-list__item"><span class="point">&bull;</span><strong>Inoculations: </strong>${data.inoculations.join(', ')}</li>
                    <li class="modal-list__item"><span class="point">&bull;</span><strong>Diseases: </strong>${data.diseases.join(', ')}</li>
                    <li class="modal-list__item"><span class="point">&bull;</span><strong>Parasites: </strong>${data.parasites.join(', ')}</li>
                </ul>
            </div>
            `;
    document.querySelector(`.modal__content`).replaceWith(element);
}

/* Генератор рандомных значение */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/* Генератор рандомного массива*/
function randomArray() {
    let currentArr = [0, 1, 2, 3, 4, 5, 6, 7];
    let arr = [];
    for (let i = 0; i < 8; i++) {
        let removed = currentArr.splice(getRandomInt(8 - i), 1);
        arr.push(removed[0]);
    }
    return arr;
}

/* Перемещение индекса по массиву вправо на 3 элемента */
function updateIndexRight(count) {
    currentIndex += count;
    if (currentIndex > 7) {
        currentIndex -= 8;
    }
}

/* Перемещение индекса по массиву влево на 3 элемента */
function updateIndexLeft(count) {
    currentIndex -= count;
    if (currentIndex < 0) {
        currentIndex += 8;
    }
}

/* Получение 3 элементов из массива*/
function newArr() {
    let arr = [];

    if (currentIndex < 6) {
        arr = randomArr.slice(currentIndex, currentIndex + 3);
    } else if (currentIndex === 6) {
        arr = randomArr.slice(currentIndex);
        arr.push(randomArr[0]);
    } else if (currentIndex === 7) {
        arr = randomArr.slice(currentIndex);
        arr.push(randomArr[0]);
        arr.push(randomArr[1]);
    }
    return arr;
}

/* Обработчик нажатия вправо */
sliderBtnRight.addEventListener('click', () => {
    updateIndexRight(3);
    const arr = newArr();
    getJSON(arr);
});

/* Обработчик нажатия влево */
sliderBtnLeft.addEventListener('click', () => {
    updateIndexLeft(3);
    const arr = newArr();
    getJSON(arr);
});

/* Скрытие модального окна*/
closeModal.addEventListener('click', () => {
    backgroundModal.classList.remove('blackout');
    modal.style.right = '-952px';
    modal.style.top = '0px';
    modal.style.top = 'inherit';

});

/* Скрытие модального окна*/
backgroundModal.addEventListener('click', () => {
    backgroundModal.classList.remove('blackout');
    modal.style.right = '-952px';
    modal.style.top = '0px';
    modal.style.top = 'inherit';
});



