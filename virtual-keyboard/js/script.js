const textarea = document.getElementById("textarea");

// Current position on area
let pos = textarea.selectionStart;
let keyNum = 0;
let rec = null;
let initialRec = 0;

speechRecognitionInitial();

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: textarea.value,
        capsLock: false,
        selectionStart: pos,
        selectionEnd: pos,
        isRussian: false,
        shift: false,
        isHide: false,
        isVolume: true,
        isMicro: false,
        keyNum: 0
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                if(!this.properties.isHide) {
                    this.open(element.value, currentValue => {
                        element.value = currentValue;
                    });
                }
            });
        });

        console.log(this.elements.keys);

        this.elements.main.addEventListener('click', () => {
            // Choose selections
            this.properties.selectionEnd = textarea.selectionEnd = this.properties.selectionStart = textarea.selectionStart = pos;
            this.properties.value = textarea.value;
        })

    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        let keyLayout = [];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        this.properties.isRussian ? keyLayout = keyLayout.concat(keyLayoutRu) : keyLayout = keyLayout.concat(keyLayoutEn);

        keyLayout.forEach(key => {
            const keyElement = document.createElement("div");
            let newLine = [];
            this.properties.isRussian ? newLine = newLine.concat(newLineRu) : newLine = newLine.concat(newLineEn);

            const insertLineBreak = newLine.indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.playSound(key);
                        this.properties.value = textarea.value;

                        this.properties.shift ? this._toggleShift() : this.properties.shift;

                        // Set selections
                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = this.properties.selectionStart;

                        if(this.properties.value.length !== 0) {
                            if(this.properties.selectionStart !== 0) {
                                let arr = this.properties.value.split('');
                                arr.splice(this.properties.selectionStart - 1, 1);
                                this.properties.value = arr.join('');

                                this.properties.selectionStart--;
                                pos = textarea.selectionEnd = textarea.selectionStart  = this.properties.selectionEnd = this.properties.selectionStart;
                                this._triggerEvent("oninput");
                            }
                        }
                    });

                    this.hoverButtonEffect(8, keyElement);
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._toggleCapsLock();
                        this.playSound(key);
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    //this.hoverButtonEffect(20, keyElement);

                    window.onkeydown = () => {
                        if(keyNum === 20) {
                            console.log('хуй')
                            this.properties.shift ? this._toggleShift() : this.properties.shift;
                            this._toggleCapsLock();
                            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        }
                        if(keyNum === 16) {
                            this._toggleShift();
                            this._triggerEvent("oninput");
                        }
                    }

                    break;

                case "hide":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_hide");

                    keyElement.addEventListener("click", () => {
                        this.properties.isHide = true;
                        this.close();
                        this.playSound(key);
                        this._triggerEvent("onclose");
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.addLetter('\n');
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this.playSound(key);
                        this._triggerEvent("oninput");
                    });

                    this.hoverButtonEffect(13, keyElement);
                    break;

                case "language":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key-flex");
                    keyElement.innerHTML = createIconHTML("language");

                    keyElement.firstChild.classList.add('language');

                    const enSymbol = document.createElement("div");
                    this.properties.isRussian ? enSymbol.classList.add('key__passive') : enSymbol.classList.add('key__active');
                    enSymbol.textContent = 'En';
                    keyElement.prepend(enSymbol);

                    const ruSymbol = document.createElement("div");
                    this.properties.isRussian ? ruSymbol.classList.add('key__active') : ruSymbol.classList.add('key__passive');
                    ruSymbol.textContent = 'Ru';
                    keyElement.append(ruSymbol);

                    keyElement.addEventListener("click", () => {
                        this.playSound(key);
                        this.properties.isRussian = !this.properties.isRussian;
                        this.properties.isRussian ? rec.lang = 'ru-RU' : rec.lang = 'en-US';
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                        this.close();
                        this.init();


                        let clone = this.elements.main.previousElementSibling.cloneNode(true);
                        this.elements.main.previousElementSibling.replaceWith(clone);
                        this.elements.main.previousElementSibling.remove();
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.addLetter(' ');
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this.playSound(key);
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(32, keyElement);
                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = 'Shift';

                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        this.playSound(key);
                        this._triggerEvent("oninput");
                    });

                    this.hoverButtonEffect(16, keyElement);

                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = textarea.value;

                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = textarea.selectionEnd;

                        console.log('pos left '+ pos);
                        pos = textarea.selectionStart

                        if(textarea.selectionStart !== 0) {
                            textarea.selectionStart--;
                            pos = textarea.selectionEnd = textarea.selectionStart;
                        }

                        this.playSound(key);
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(37, keyElement);

                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = textarea.value;

                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = textarea.selectionEnd;

                        console.log('pos right '+ pos);
                        pos = textarea.selectionStart

                        if(textarea.selectionStart !== textarea.value.length) {
                            textarea.selectionStart++;
                            pos = textarea.selectionEnd = textarea.selectionStart;
                        }

                        this.playSound(key);
                        this._triggerEvent("oninput");
                    });
                    this.hoverButtonEffect(39, keyElement);
                    break;

                case "volume":
                    keyElement.classList.add("keyboard__key--wide" , "key__active");
                    keyElement.innerHTML = createIconHTML("volume_up");

                    keyElement.addEventListener("click", () => {
                        this.properties.isVolume = !this.properties.isVolume;
                        keyElement.classList.toggle('key__active');
                        keyElement.classList.toggle('key__passive');
                        this.playSound(key);
                    });
                    break;

                case "mic":
                    keyElement.classList.add("keyboard__key--wide" , "key__passive");
                    keyElement.innerHTML = createIconHTML("mic");

                    keyElement.addEventListener("click", () => {
                        keyElement.classList.toggle('key__passive');
                        keyElement.classList.toggle('key__active');
                        this.playSound(key);
                        this._toggleRecognition();
                    });
                    break;

                default:
                    // Create key upper element
                    let symbols = key.split('');
                    const upperSymbols = document.createElement("div");
                    upperSymbols.classList.add('upper__symbols');

                    // Create Upper symbol left
                    const upperSymbolLeft = document.createElement("div");
                    upperSymbolLeft.classList.add('upper__symbols-left', 'key__passive');
                    upperSymbolLeft.textContent = symbols[0].toLowerCase();
                    upperSymbols.append(upperSymbolLeft);

                    // Create Upper symbol right
                    const upperSymbolRight = document.createElement("div");
                    upperSymbolRight.classList.add('upper__symbols-right');
                    upperSymbolRight.textContent = symbols[1].toLowerCase();
                    upperSymbols.append(upperSymbolRight);

                    keyElement.append(upperSymbols);

                    // Create key lower element
                    const lowerSymbol = document.createElement("div");
                    lowerSymbol.classList.add('lower__symbol' , 'key__active');
                    lowerSymbol.textContent = symbols[2].toLowerCase();
                    keyElement.append(lowerSymbol);

                    keyElement.addEventListener("click", () => {
                        let letter = this.chooseLetter(keyElement, symbols);
                        this.addLetter(letter);
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");

                        this.playSound(key);
                    });


                    this.hoverButtonEffect(this.selectKeyNumber(symbols), keyElement);

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _toggleRecognition() {
        this.properties.isMicro = !this.properties.isMicro;

        textarea.textContent = this.properties.value;
        pos = textarea.textContent.length;
        this.properties.selectionEnd = this.properties.selectionStart = textarea.selectionEnd = pos;


        if(this.properties.isMicro) {
            if(initialRec === 0) {
                rec.start();
                initialRec++;
            }
            this.properties.isRussian ? rec.lang = 'ru-RU' : rec.lang = 'en-US';

            rec.onresult = (e) => {
                if(this.properties.isMicro) {

                    let text = Array.from(e.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');

                    textarea.textContent += text;
                    textarea.textContent += ' ';
                    console.log('textarea-' + textarea.textContent);

                    this.properties.value += text;
                    this.properties.value += ' ';
                    console.log('value- ' + this.properties.value);

                    pos = textarea.textContent.length;
                    //this.properties.selectionEnd = pos;
                    this._triggerEvent("oninput");
                }
            }

            rec.onend = (e) => {
                rec.start();
                console.log('1234')
            }

        } else {
            this.properties.value = textarea.textContent;
            this._triggerEvent("oninput");
            // rec = null;
            // rec = new SpeechRecognition();
            rec.stop();
        }
    },

    playSound(key) {
        if(this.properties.isVolume) {
            let sound = 0;
            switch (key) {
                case 'backspace':
                    sound = document.querySelector('.backspace__sound');
                    break;

                case 'enter':
                    sound = document.querySelector('.enter__sound');
                    break;

                case 'caps':
                    sound = document.querySelector('.caps__sound');
                    break;

                case 'shift':
                    sound = document.querySelector('.shift__sound');
                    break;

                default:
                    if(!this.properties.isRussian) {
                        sound = document.querySelector(`.basic__sound-en`);
                    } else {
                        sound = document.querySelector(`.basic__sound-ru`);
                    }
                    break;
            }

            sound.currentTime = 0;
            sound.play();
        }
    },

    selectKeyNumber(symbols) {
        let code = 0;
        const charCode = symbols[2].toUpperCase().charCodeAt();

        if((charCode >= 65 && charCode <= 90) || (charCode >= 48 && charCode <= 57) ) code = charCode;
        else if(symbols.join('') === ',/.') code = 191;
        else code = keyCodes[symbols[2].toLowerCase()];

        return code;
    },

    hoverButtonEffect(numCode, keyElement) {
        window.addEventListener("keydown", () => {
            if(keyNum === numCode) keyElement.classList.add('keyboard__key-hover');
        });

        window.addEventListener("keyup", () => {
            keyElement.classList.remove('keyboard__key-hover');
        });
    },

    addLetter(letter) {
        this.properties.value = textarea.value;

        // Set selections
        this.properties.selectionStart = textarea.selectionStart;
        this.properties.selectionEnd = this.properties.selectionStart;

        // Change area
        if(textarea.selectionStart !== textarea.value.length) {

            let arr = this.properties.value.split('');
            arr.splice(this.properties.selectionStart, 0, letter);
            this.properties.value = arr.join('');

            this.properties.selectionStart++;
            pos = textarea.selectionEnd = textarea.selectionStart  = this.properties.selectionEnd = this.properties.selectionStart;

        } else {
            pos = ++this.properties.selectionStart;
            this.properties.value += letter;
        }
    },

    chooseLetter(keyElement, symbols) {
        let letter = 0;

        console.log(this.properties.capsLock, this.properties.shift);

        if(this.properties.capsLock || this.properties.shift) {
            const charCode = keyElement.lastChild.textContent.charCodeAt();
            if((this.properties.shift && ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 1040 && charCode <= 1103))) || (this.properties.capsLock && !this.properties.shift)) {
                letter = keyElement.lastChild.lastChild.textContent;
            } else if ((this.properties.capsLock && this.properties.shift) || this.properties.shift){
                letter = symbols[0];
            }
        } else  letter = keyElement.lastChild.lastChild.textContent;

        return letter;
    },

    keyPress(e) {
        let keyNums;
        if (window.event) {
            keyNums = window.event.keyCode;
            keyNum = keyNums;
        }
        else if (e) {
            keyNums = e.which;
        }
        console.log('Код клавиши - ' + keyNums);
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 2) {
                key.lastChild.textContent = this.properties.capsLock ? key.lastChild.textContent.toUpperCase() : key.lastChild.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 2) {
                const charCode = key.lastChild.textContent.charCodeAt();
                if((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 1040 && charCode <= 1103)) {
                    key.lastChild.textContent = key.lastChild.textContent === key.lastChild.textContent.toLowerCase() ? key.lastChild.textContent.toUpperCase() : key.lastChild.textContent.toLowerCase();
                } else {
                    key.firstChild.firstChild.classList.toggle('key__passive');
                    key.firstChild.firstChild.classList.toggle('key__active');

                    key.lastChild.classList.toggle('key__passive');
                    key.lastChild.classList.toggle('key__active');
                }

            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        //this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    document.onkeydown = Keyboard.keyPress;
});

textarea.addEventListener('click', () => {
    Keyboard.properties.isHide = false;
    Keyboard.open();
})


// English keyboard
const keyLayoutEn = [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p', '{х[', '}ъ]','| \\',
    "caps", 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', ':ж;', `"э'`, "enter",
    "shift", 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    "hide", "mic", "volume", "language", "space", "left", "right",
];
const newLineEn = ["backspace", '| \\', "enter", '?./'];


const keyCodes = {
    'ф': 65,
    'и': 66,
    'с': 67,
    'в': 68,
    'у': 69,
    'а': 70,
    'п': 71,
    'р': 72,
    'ш': 73,
    'о': 74,
    'л': 75,
    'д': 76,
    'ь': 77,
    'т': 78,
    'щ': 79,
    'з': 80,
    'й': 81,
    'к': 82,
    'ы': 83,
    'е': 84,
    'г': 85,
    'м': 86,
    'ц': 87,
    'ч': 88,
    'н': 89,
    'ж': 186,
    'б': 188,
    'ю': 190,
    'х': 219,
    'ъ': 221,
    "э": 222,
    'я': 90,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '[': 219,
    '\\':220,
    ']': 221,
    "'": 222
}

const keyLayoutRu = [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', '_ -', '+ =', "backspace",
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з', ' {х', ' }ъ','/ \\',
    "caps", 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', ' :ж', ' "э', "enter",
    "shift", 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    "hide", "mic", "volume", "language","space", "left", "right",
];
const newLineRu = ["backspace", '/ \\', "enter", ',/.'];

function speechRecognitionInitial() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SpeechRecognition();
    rec.interimResults = false;
    rec.lang = 'en-US';
}