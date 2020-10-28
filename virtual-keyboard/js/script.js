const textarea = document.getElementById("textarea");

// Current position on area
let pos = textarea.selectionStart;

// English keyboard
const keyLayoutEn = [
    '! 1', '@"2', '#№3', '$;4', '% 5', '^:6', '&?7', '* 8', '( 9', ') 0', "backspace",
    'й q', 'ц w', 'у e', 'к r', 'е t', 'н y', 'г u', 'ш i', 'щ o', 'з p',
    "caps", 'ф a', 'ы s', 'в d', 'а f', 'п g', 'р h', 'о j', 'л k', 'д l', "enter",
    "shift", 'я z', 'ч x', 'с c', 'м v', 'и b', 'т n', 'ь m', '<б,', '>ю.', '?./',
    "language","space", "left", "right",
];
const newLineEn = ["backspace", 'з p', "enter", '?./'];

const keyLayoutRu = [
    '! 1', '"@2', '№#3', ';$4', '% 5', ':^6', '?&7', '* 8', '( 9', ') 0', "backspace",
    'q й', 'w ц', 'e у', 'r к', 't е', 'y н', 'u г', 'i ш', 'o щ', 'p з',
    "caps", 'a ф', 's ы', 'd в', 'f а', 'g п', 'h р', 'j о', 'k л', 'l д', "enter",
    "shift", 'z я', 'x ч', 'c с', 'v м', 'b и', 'n т', 'm ь', '<,б', '>.ю', ',/.',
    "language","space", "left", "right",
];
const newLineRu = ["backspace", 'p з', "enter", ',/.'];


textarea.addEventListener('click', () => {
    console.log(textarea.value);
})

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
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

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

        console.log(this.properties.isRussian);

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

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = textarea.value;

                        // Set selections
                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = this.properties.selectionStart;

                        // Change area
                        if(textarea.selectionStart !== textarea.value.length) {

                            let arr = this.properties.value.split('');
                            arr.splice(this.properties.selectionStart, 0, '\n');
                            this.properties.value = arr.join('');

                            this.properties.selectionStart++;
                            pos = textarea.selectionEnd = textarea.selectionStart  = this.properties.selectionEnd = this.properties.selectionStart;

                        } else {
                            pos = ++this.properties.selectionStart;
                            this.properties.value += '\n';
                        }
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });

                    break;

                case "language":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("language");

                    keyElement.addEventListener("click", () => {
                        this.properties.isRussian = !this.properties.isRussian;
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                        this.close();
                        this.init();
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = textarea.value;

                        // Set selections
                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = this.properties.selectionStart;

                        // Change area
                        if(textarea.selectionStart !== textarea.value.length) {

                            let arr = this.properties.value.split('');
                            arr.splice(this.properties.selectionStart, 0, ' ');
                            this.properties.value = arr.join('');

                            this.properties.selectionStart++;
                            pos = textarea.selectionEnd = textarea.selectionStart  = this.properties.selectionEnd = this.properties.selectionStart;

                        } else {
                            pos = ++this.properties.selectionStart;
                            this.properties.value += ' ';
                        }
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.textContent = 'Shift';
                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        this._triggerEvent("oninput");
                        // this.close();
                        // this._triggerEvent("onclose");
                    });

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

                        this._triggerEvent("oninput");
                    });

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

                        this._triggerEvent("oninput");
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
                        this.properties.value = textarea.value;

                        // Set selections
                        this.properties.selectionStart = textarea.selectionStart;
                        this.properties.selectionEnd = this.properties.selectionStart;

                        // Change area
                        if(textarea.selectionStart !== textarea.value.length) {
                            let letter = this.chooseLetter(keyElement, symbols);

                            let arr = this.properties.value.split('');
                            arr.splice(this.properties.selectionStart, 0, letter);
                            this.properties.value = arr.join('');

                            this.properties.selectionStart++;
                            pos = textarea.selectionEnd = textarea.selectionStart  = this.properties.selectionEnd = this.properties.selectionStart;

                        } else {
                            pos = ++this.properties.selectionStart;
                            let letter = this.chooseLetter(keyElement, symbols);
                            this.properties.value += letter;
                        }
                        this.properties.shift ? this._toggleShift() : this.properties.shift;
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    chooseLetter(keyElement, symbols) {
        let letter = 0;
        if(this.properties.capsLock || this.properties.shift) {
            const charCode = keyElement.lastChild.textContent.charCodeAt();
            if((this.properties.shift && ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 1040 && charCode <= 1103))) || this.properties.capsLock) {
                letter = symbols[2].toUpperCase();
            } else {
                letter = symbols[0];
            }
        } else letter = symbols[2].toLowerCase();

        return letter;
    },

    keyPress(e) {
        let keyNum;
        if (window.event) {
            keyNum = window.event.keyCode;
            this.properties.keyNum = keyNum;
        }
        else if (e) {
            keyNum = e.which;
        }
        console.log('Код клавиши - ' + keyNum);
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
                    key.lastChild.textContent = this.properties.shift ? key.lastChild.textContent.toUpperCase() : key.lastChild.textContent.toLowerCase();
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
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    document.onkeydown = Keyboard.keyPress;
});


// function keyPress(e) {
//     let keyNum;
//     if (window.event) {
//         keyNum = window.event.keyCode;
//     }
//     else if (e) {
//         keyNum = e.which;
//     }
//     //console.log(keyNum);
// }
// document.onkeydown = keyPress;