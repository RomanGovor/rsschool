class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clearAll()
    }

    clearAll() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    deleteLastSymbol() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    selectOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.calculate()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    calculate() {                                             // Вычисление
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) {alert('isNan'); return;}
        switch (this.operation) {
            case '+':
                computation = (prev + current).toFixed(12);
                break
            case '-':
                computation = (prev - current).toFixed(12);
                break
            case '*':
                computation = (prev * current).toFixed(12);
                break
            case '÷':
                computation = (prev / current).toFixed(12);
                break
            case '^':
                computation = Math.pow(prev, current);
                break
            default:
                alert('default');
                return
        }
        if(computation.toString().includes('.')) {
            while (computation.toString().endsWith('0'))
                computation = computation.slice(0, -1);
            if(computation.toString().endsWith('.'))
                computation = computation.slice(0, -1);
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getNumberFromDisplay(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getNumberFromDisplay(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getNumberFromDisplay(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }

    square() {
        if (this.previousOperand !== '' || this.currentOperand === '') return ;
        const current = parseFloat(this.currentOperand);
        if (current < 0) { alert('Can not calculate the root of a negative number'); return;}
        if (isNaN(current)) return ;
        this.currentOperand = Math.sqrt(current);
        this.operation = undefined;
    }

    plusMinus() {
        if (this.currentOperand === '') this.currentOperand = '-';
        else this.currentOperand = parseFloat(this.currentOperand) * (-1);
    }
}


const numberButtons = document.querySelectorAll('[data-number]'),
        operationButtons = document.querySelectorAll('[data-operation]'),
        equalsButton = document.querySelector('[data-equals]'),
        deleteButton = document.querySelector('[data-delete]'),
        allClearButton = document.querySelector('[data-all-clear]'),
        previousOperandTextElement = document.querySelector('[data-previous-operand]'),
        currentOperandTextElement = document.querySelector('[data-current-operand]'),
        squareButton = document.querySelector('[data-square]'),
        plusMinusButton = document.querySelector('[data-plus-minus]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

squareButton.addEventListener('click', button => {
    this.operation = undefined;
    calculator.square();
    calculator.updateDisplay()
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.selectOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.calculate()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clearAll()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.deleteLastSymbol();
    calculator.updateDisplay()
})

plusMinusButton.addEventListener('click', button => {
    calculator.plusMinus();
    calculator.updateDisplay()
})
