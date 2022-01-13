
let prevLeft = "";
let operator = "";
let leftOperand = "";
let inputString = "";
let rightOperand = "";
let pressedValue = "";

const allowedOperators = ["+", "-", "x", "/"];
const dot = document.getElementById("dot");
const clear = document.getElementById("ac");
const body = document.querySelector("body");
const answer = document.getElementById("answer");
const screen = document.getElementById("values-display");
const operands = document.getElementsByClassName("operand");
const operators = document.getElementsByClassName("operator");
screen.textContent = "";

placeDotInOperand = (operand) => {
    
    if(operand.length > 0){
        inputString = inputString.replace(new RegExp(`${operand}$`, "g"), "");
    }
    
    if(operand.includes(".")){
        answer.textContent = ". already added!";
        answer.classList.add("error");
    }else if(operand === ""){
        operand = "0.";
    }else{
        operand += ".";
    }
    
    inputString += operand;
    screen.textContent = inputString;
    
    return operand;
}

reassignOperands = (screenText) => {

    const hasOperand = [...screenText].some(curr => {
        return allowedOperators.some(operator => {
            if(curr === operator){
                return true;
            }
        });
    });

    if(!hasOperand){
        return;
    }

    let allOperators = screenText.replace(/([\d]|\.)*/g, "");
    let operatorCount = allOperators.length;
    let currOperator = allOperators.slice(0, 1);
    let currOperatorPos = screenText.indexOf(currOperator); 
    let newScreenText = screenText.slice(currOperatorPos + 1); 

    leftOperand = screenText.slice(0, currOperatorPos);

    for(let i = 0; i < operatorCount - 1; i++){
        operator = currOperator;

        currOperator = allOperators[i + 1];
        currOperatorPos = newScreenText.indexOf(currOperator);
        rightOperand = newScreenText.slice(0, currOperatorPos);
        prevLeft = leftOperand;
        leftOperand = operate(operator, leftOperand, rightOperand);
        newScreenText = newScreenText.slice(currOperatorPos + 1);
    }

    if(rightOperand !== ""){
        answer.textContent = leftOperand;
    }else{
        operator = "";
    }
}

backspace = () => {
    
    let screenText = screen.textContent;
    let lastInputChar = screenText[screenText.length - 1];
    
    if(screenText === ""){
        return;
    }
    
    if(lastInputChar === operator){
        reassignOperands(screenText);
        lastInputChar = "\\" + lastInputChar;
    }else if(leftOperand !== "" && screenText.match(new RegExp(`(${leftOperand})$`)) != null){
        leftOperand = leftOperand.replace(new RegExp(`(${lastInputChar})$`), "");
    }else if(rightOperand !== "" && screenText.match(new RegExp(`(${rightOperand})$`)) != null){
        leftOperand = answer.textContent !== "" ? prevLeft : leftOperand;
        rightOperand = rightOperand.replace(new RegExp(`(${lastInputChar})$`), "");
        
        if(rightOperand === "" || (rightOperand.match(/\.$/g) != null)){
            answer.textContent = "";
        }else{
            answer.textContent = operate(operator, prevLeft, rightOperand);
        }
    }
    
    screen.textContent = screenText.replace(new RegExp(`(${lastInputChar})$`), "");
};

resetData = (body, id) => {
    let cursorColor = getComputedStyle(body).getPropertyValue("--cursor-color");
    
    if(cursorColor !== "#a2c0f1" || id === "ac"){
        body.style.setProperty("--cursor-color", "#a2c0f1");
        
        if(!isNaN(pressedValue) || id === "ac"){
            leftOperand = inputString = "";
            screen.textContent = "";
            answer.textContent = "";
        }
        
        rightOperand = "";
        operator = "";
        answer.classList.remove("error");
    }
}

preventLeadingIntegerZeros = (operand) => {

    if(operand.length !== 2){
        return operand;
    }

    const prev = operand[0];
    const curr = operand[1];

    if(isNaN(curr) || prev !== "0"){
        return operand;
    }

    return operand.slice(1);
}

assignPressedValue = (pressed) => {

    if(pressed === "*"){
        pressedValue = "x"
    }else if (pressed === "/"){
        pressedValue = "÷"
    }else if (pressed === "Enter"){
        pressedValue = "=";
    }else{
        pressedValue = pressed;
    }

}

handleInput = (pressed) => {

    let tempInputStr = "";
    let allowedEvents = ["+", "-", "*", "/", ".", "=", "Enter", "x", "÷"];
    inputString = tempInputStr = screen.textContent;

    assignPressedValue(pressed);

    leftOperand = leftOperand.toString();
    rightOperand = rightOperand.toString();

    const isBackSpace = pressedValue === "Backspace" || pressedValue === "⌫";
    let isAllowedInput = isBackSpace || !isNaN(pressedValue);

    isAllowedInput = isAllowedInput || allowedEvents.some(curr => (curr === pressed) ? true : false);

    if(!isAllowedInput){
        return;
    }

    if(inputString.length > 8 && !isBackSpace){ 
        answer.classList.add("error");
        answer.textContent = "too long"
        return;
    }
    
    answer.classList.remove("error");
    
    if(isBackSpace){
        backspace();
        return;
    }else if(pressedValue === "."){
        if(operator !== ""){
            rightOperand = placeDotInOperand(rightOperand);
        }else{
            leftOperand = placeDotInOperand(leftOperand);
        }

        return;
    }
    
    resetData(body);

    if(!isNaN(pressedValue)){
        handleDigitInput(tempInputStr);
        return;
    }
    
    handleOperandInput(body);
}

handleDigitInput = (tempInputStr) => {
    
    if(operator !== ""){
        inputString = inputString.replace(new RegExp(`${rightOperand}$`, "g"), "");
        
        if(inputString === tempInputStr){
            
            if(pressedValue === "0" && operator === "÷"){
                answer.classList.add("error");
            }
            
            prevLeft = leftOperand;
            rightOperand = pressedValue;
            rightOperand = preventLeadingIntegerZeros(rightOperand);
            answer.textContent = operate(operator, leftOperand, rightOperand);
        }else{
            rightOperand += pressedValue;
            rightOperand = preventLeadingIntegerZeros(rightOperand);
            answer.textContent = operate(operator, prevLeft, rightOperand);
        }
        
        // if divide by 0, a string is returned
        // avoid assigning a NaN to leftOperand
        if(!isNaN(answer.textContent)){
            leftOperand = answer.textContent;
        }
        
        inputString += rightOperand;
    }else{
        inputString = inputString.replace(new RegExp(`${leftOperand}$`, "g"), "");
        leftOperand += pressedValue;
        leftOperand = preventLeadingIntegerZeros(leftOperand);
        inputString += leftOperand;
    }
    
    
    screen.textContent = inputString;
}

isAllowedFirstOperator = (value) => {

    const acceptableFirstOperators = ["√", "π", "-"];
    return acceptableFirstOperators.some(operator => (operator === value) ? true : false);
}

handleOperandInput = (body) => {

    let screenColor = getComputedStyle(body).getPropertyValue("--screen-color");

    let previousPressed = inputString[inputString.length - 1];
    let isOperatorAcceptable = isAllowedFirstOperator(pressedValue);
    let isPreviousAcceptable = isAllowedFirstOperator(previousPressed);
    
    if(isOperatorAcceptable && inputString.length === 0){
        inputString = inputString.replace(new RegExp(`${leftOperand}$`, "g"), "");
        leftOperand += pressedValue
        inputString += leftOperand;
    }else if (isPreviousAcceptable && rightOperand === ""){
        rightOperand += pressedValue;
        inputString += rightOperand;
    }else if (pressedValue !== "=" && !isOperatorAcceptable || pressedValue === "-"){
        
        if(isNaN(previousPressed)){
            inputString = inputString.replace(operator, "");
        }else if(previousPressed === "0" && operator === "÷"){
            inputString = inputString.replace(/(÷0)$/, "");
            answer.textContent = "";
        }
        
        operator = pressedValue;
        inputString += operator;
    }else if(operator !== "" && pressedValue === "="){
        
        if(prevLeft === "" || rightOperand === ""){
            return;
        }
        
        answer.textContent = operate(operator, prevLeft, rightOperand);
        
        if(isNaN(answer.textContent)){
            answer.classList.add("error");
            return;
        }
        
        inputString = leftOperand = answer.textContent;
        body.style.setProperty("--cursor-color", screenColor);
    }
    screen.textContent = inputString;
}

addClickEvents = element => {
    
    element.addEventListener("click", (e) => {
        
        handleInput(element.textContent);
        
    });

    clear.addEventListener("click", () => {
        resetData(body, clear.getAttribute("id"));
    });
}

const add = (leftOperand, rightOperand) => leftOperand + rightOperand;
const subtract = (leftOperand, rightOperand) => leftOperand - rightOperand;
const multiply = (leftOperand, rightOperand) => leftOperand * rightOperand;
const divide = (leftOperand, rightOperand) => leftOperand / rightOperand;

const operate = (operator, leftOperand, rightOperand) => {

    let answer = null;
    const error = `Invalid operator: ${operator}`;

    leftOperand = Number(leftOperand);
    rightOperand = Number(rightOperand);

    if(operator === "+"){
        answer = add(leftOperand, rightOperand);
    }else if(operator === "-"){
        answer = subtract(leftOperand, rightOperand);
    }else if(operator === "x"){
        answer = multiply(leftOperand, rightOperand);
    }else if(operator === "÷"){
        if(rightOperand === 0){
            answer =  "Can't divide by 0";
        }else{
            answer = divide(leftOperand, rightOperand);
        }
    }else{
        answer = error;
    }
    
    if(!isNaN(answer) && !Number.isInteger(answer)){
        answer = Number.parseFloat(answer).toFixed(8);
        let lastAnswerChar = answer[answer.length - 1];

        while(lastAnswerChar == 0 && answer.includes("." || lastAnswerChar == ".") ){
            answer = answer.replace(/(0|\.)$/, "");
            lastAnswerChar = answer[answer.length - 1];
        }
    }

    return answer;

}

[...operands].map(addClickEvents);
[...operators].map(addClickEvents);


document.addEventListener('keydown', e => handleInput(e.key));
