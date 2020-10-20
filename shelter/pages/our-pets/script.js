const logoHeader = document.querySelector("body > header > div > div.logo"),
    hiddenMenuTicker = document.querySelector('.hidden-menu-ticker'),
    backgroundDiv = document.querySelector('.background-div'),
    headerLines = document.querySelector('.header-lines'),
    header = document.querySelector('.header'),
    hiddenMenu = document.querySelector('.hidden-menu');

logoHeader.addEventListener('click', () => {
    window.location.href = '../main/index.html';
})

hiddenMenuTicker.addEventListener('change', () => {
    if (logoHeader.style.display === 'none') {
        hiddenMenu.style.right = '-320px';
        headerLines.style.transform = 'rotate(0deg)';

        logoHeader.style.display = 'flex';
        logoHeader.parentElement.style.justifyContent = 'space-between';
        backgroundDiv.classList.remove('blackout');
        headerLines.style.position = 'inherit';
        header.style.background = 'white';
    } else {
        hiddenMenu.style.right = '0';
        headerLines.style.transform = 'rotate(90deg)';

        logoHeader.style.display = 'none';
        logoHeader.parentElement.style.justifyContent = 'flex-end';
        backgroundDiv.classList.add('blackout');
        headerLines.style.position = 'fixed';
        header.style.background = 'none';
    }
});


////////////////*JSON*///////////////////////

const btnLeft = document.querySelector('.btn-left'),
    btnRight = document.querySelector('.btn-right'),
    btnOnFirst = document.querySelector('.on-first'),
    btnOnLast = document.querySelector('.on-last'),
    btnNumPage = document.querySelector('.num-page'),
    modal = document.querySelector('.modal_window'),
    closeModal = document.querySelector('.btn_close'),
    backgroundModal = document.querySelector('.background__modal');

let data, currentIndex = 0, currentPage = parseInt(btnNumPage.innerText), maxCountPages = 6, oldMaxCountPages = maxCountPages;
const randomArr = getRandomBigArray();

window.addEventListener('DOMContentLoaded', changeMaxCountPages());
window.onresize = resize;

/* Изменение положения текущей страницы*/
function resize() {
    changeMaxCountPages();

    if(oldMaxCountPages !== maxCountPages) {
        if(currentPage !== 1) {
            if(oldMaxCountPages === 6) {
                if(maxCountPages === 8) {
                    currentPage = Math.ceil(currentPage *= 1.3);
                } else if(maxCountPages === 16)
                    currentPage = Math.ceil(currentPage *= 2.6);
            } else if(oldMaxCountPages === 8) {
                if(maxCountPages === 6) {
                    currentPage = Math.floor(currentPage /= 1.3);
                } else if(maxCountPages === 16)
                    currentPage = Math.ceil(currentPage *= 2);
            } else if(oldMaxCountPages === 16) {
                if(maxCountPages === 6) {
                    currentPage = Math.floor(currentPage /= 2.6);
                } else if(maxCountPages === 8)
                    currentPage = Math.floor(currentPage /= 2);
            }
        }

        oldMaxCountPages = maxCountPages;

        if(currentPage === 1) {
            btnLeft.setAttribute("disabled", "true");
            btnOnFirst.setAttribute("disabled", "true");
            if(btnLeft.classList.contains('enabled')) {
                btnLeft.classList.replace('enabled','disabled');
                btnOnFirst.classList.replace('enabled','disabled');
            }
        } else if(currentPage === maxCountPages) {
            btnRight.setAttribute("disabled", "true");
            btnOnLast.setAttribute("disabled", "true");
            if(btnRight.classList.contains('enabled')) {
                btnRight.classList.replace('enabled','disabled');
                btnOnLast.classList.replace('enabled','disabled');
            }
        }

        btnNumPage.innerText = `${currentPage}`;
    }

    if(currentPage < maxCountPages) {
        btnRight.removeAttribute("disabled");
        btnOnLast.removeAttribute("disabled");
        btnRight.classList.replace('disabled','enabled');
        btnOnLast.classList.replace('disabled','enabled');
    }
}

getJSON(randomArr);
async function getJSON(randomArr) {
    const res = await fetch('../../../pets.json');
    data = await res.json();

    for (let i = 0; i < 8; i++) {
        createCard(data[randomArr[i]], `card-pet-${i + 1}`);
    }
}

/* Создание карточки животного */
function createCard(data, numCard) {
    const element = document.createElement('div');
    element.classList.add("card-pet", numCard, 'animated', 'fadeIn');
    element.innerHTML = `
                <img src="${data.img}" alt="${data.name}">
                <p class="pet-name">${data.name}</p>
                <button>Learn more</button>
            `;

    element.addEventListener('click', () => {
        createModal(data);
        modal.style.right = '9%';
        modal.style.top = '50%';
        modal.style.left = '52.5%';
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

/* Получение большого рандомного массива*/
function getRandomBigArray() {
    let bigRandomArray = [];
    for(let i = 0; i < 6; i++)
        bigRandomArray = bigRandomArray.concat(randomArray());
    return bigRandomArray
}

/* Генератор рандомных значение */
function getRandomInt(max) {
    let rand = Math.random() * (max + 1);
    return Math.floor(rand);
}

/* Генератор рандомного массива*/
function randomArray() {
    let currentArr = [0, 1, 2, 3, 4, 5, 6, 7];
    let arr = [];
    for (let i = 0; i < 8; i++) {
        let removed = currentArr.splice(getRandomInt(8 - i - 1), 1);
        arr.push(removed[0]);
    }
    return arr;
}

/* Получение максимального числа страниц*/
function changeMaxCountPages() {
    if(window.innerWidth >= 1280)
        maxCountPages = 6;
    else if(window.innerWidth >= 768)
        maxCountPages = 8;
    else if(window.innerWidth >= 0)
        maxCountPages = 16;
}

/* Перемещение индекса по массиву вправо на 3 элемента */
function updateIndexRight(count) {
    currentIndex += count;
    if (currentIndex > 47) {
        currentIndex -= 48;
    }
}

/* Перемещение индекса по массиву влево на 3 элемента */
function updateIndexLeft(count) {
    currentIndex -= count;
    if (currentIndex < 0) {
        currentIndex += 48;
    }
}

/* Получение 8 элементов из массива*/
function newArr() {
    let arr = [];

    if (currentIndex < 41) {
        arr = randomArr.slice(currentIndex, currentIndex + 8);
    } else {
        arr = randomArr.slice(currentIndex);
        arr = arr.concat(randomArr.slice(0, 8 - arr.length))
    }

    return arr;
}

/* Обработчик нажатия вправо */
btnRight.addEventListener('click', () => {
    if(currentPage <= maxCountPages - 1) {
        btnLeft.removeAttribute("disabled");
        btnOnFirst.removeAttribute("disabled");
        if(btnLeft.classList.contains('disabled')) {
            btnLeft.classList.replace('disabled','enabled');
            btnOnFirst.classList.replace('disabled','enabled');
        }

        updateIndexRight(8);
        const arr = newArr();
        getJSON(arr);

        currentPage++;
        btnNumPage.innerText = `${currentPage}`;

        if(currentPage === maxCountPages) {
            btnRight.setAttribute("disabled", "true");
            btnOnLast.setAttribute("disabled", "true");
            if(btnRight.classList.contains('enabled')) {
                btnRight.classList.replace('enabled','disabled');
                btnOnLast.classList.replace('enabled','disabled');
            }
        }
    }
});

/* Обработчик нажатия влево */
btnLeft.addEventListener('click', () => {
    if(currentPage > 1) {
        btnRight.removeAttribute("disabled");
        btnOnLast.removeAttribute("disabled");
        if(btnRight.classList.contains('disabled')) {
            btnRight.classList.replace('disabled','enabled');
            btnOnLast.classList.replace('disabled','enabled');
        }

        updateIndexLeft(8);
        const arr = newArr();
        getJSON(arr);

        currentPage--;
        btnNumPage.innerText = `${currentPage}`;

        if(currentPage === 1) {
            btnLeft.setAttribute("disabled", "true");
            btnOnFirst.setAttribute("disabled", "true");
            if(btnLeft.classList.contains('enabled')) {
                btnLeft.classList.replace('enabled','disabled');
                btnOnFirst.classList.replace('enabled','disabled');
            }
        }
    }
});

/* В начало пагинации*/
btnOnFirst.addEventListener('click', () => {
    currentIndex = 0;
    const arr = newArr();
    getJSON(arr);

    currentPage = 1;
    btnNumPage.innerText = `${currentPage}`;

    btnLeft.setAttribute("disabled", "true");
    btnOnFirst.setAttribute("disabled", "true");
    if(btnLeft.classList.contains('enabled')) {
        btnLeft.classList.replace('enabled','disabled');
        btnOnFirst.classList.replace('enabled','disabled');
    }

    if(btnRight.classList.contains('disabled')) {
        btnRight.removeAttribute("disabled");
        btnOnLast.removeAttribute("disabled");
        btnRight.classList.replace('disabled','enabled');
        btnOnLast.classList.replace('disabled','enabled');
    }
});

/* В конец пагинации*/
btnOnLast.addEventListener('click', () => {
    currentIndex = 40;
    const arr = newArr();
    getJSON(arr);

    currentPage = maxCountPages;
    btnNumPage.innerText = `${currentPage}`;

    btnRight.setAttribute("disabled", "true");
    btnOnLast.setAttribute("disabled", "true");
    if(btnRight.classList.contains('enabled')) {
        btnRight.classList.replace('enabled','disabled');
        btnOnLast.classList.replace('enabled','disabled');
    }

    if(btnLeft.classList.contains('disabled')) {
        btnLeft.removeAttribute("disabled");
        btnOnFirst.removeAttribute("disabled");
        btnLeft.classList.replace('disabled','enabled');
        btnOnFirst.classList.replace('disabled','enabled');
    }
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