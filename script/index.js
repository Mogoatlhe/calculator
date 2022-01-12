
let prevLeft = "";
let operator = "";
let pressedId = "";
let leftOperand = "";
let inputString = "";
let rightOperand = "";
let pressedValue = "";

const dot = document.getElementById("dot");
const clear = document.getElementById("ac");
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

dot.addEventListener("click", () => {

    if(operator !== ""){
        rightOperand = placeDotInOperand(rightOperand);
    }else{
        leftOperand = placeDotInOperand(leftOperand);
    }

});

backspace = () => {

    let screenText = screen.textContent;
    let lastInputChar = screenText[screenText.length - 1];

    if(screenText === ""){
        return;
    }

    if(lastInputChar === operator){
        operator = "";
        lastInputChar = "\\" + lastInputChar;
    }else if(leftOperand !== "" && screenText.match(new RegExp(`(${leftOperand})$`)) != null){
        leftOperand = leftOperand.replace(new RegExp(`(${lastInputChar})$`), "");
    }else if(rightOperand !== "" && screenText.match(new RegExp(`(${rightOperand})$`)) != null){
        leftOperand = answer.textContent !== "" ? prevLeft : leftOperand;
        rightOperand = rightOperand.replace(new RegExp(`(${lastInputChar})$`), "");

        if(rightOperand === "" || (rightOperand.match(/\.$/g) != null)){
            answer.textContent = "";
        }else{
            answer.textContent = operate(operator, Number(prevLeft), Number(rightOperand));
        }
    }
    
    screen.textContent = screenText.replace(new RegExp(`(${lastInputChar})$`), "");
    console.log(screen.textContent);

};

resetData = (body, id) => {
    let cursorColor = getComputedStyle(body).getPropertyValue("--cursor-color");

    if(cursorColor !== "#a2c0f1" || id === "ac"){ // resetValues
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

setValues = element => {

    const body = document.querySelector("body");
    const acceptableFirstOperators = ["√", "π", "-"];
    
    element.addEventListener("click", () => {

        let tempInputStr = "";
        let screenColor = getComputedStyle(body).getPropertyValue("--screen-color");
        
        pressedValue = element.textContent;
        pressedId = element.getAttribute("id");

        inputString = tempInputStr = screen.textContent;

        if(inputString.length > 8){ // blink
            answer.classList.add("error");
            answer.textContent = "too long"
            return;
        }

        if(pressedId === "backspace"){
            backspace();
            return;
        }
        
        answer.classList.remove("error");
        
        resetData(body);

        if(!isNaN(pressedValue)){
            if(operator !== ""){
                inputString = inputString.replace(new RegExp(`${rightOperand}$`, "g"), "");
                
                if(inputString === tempInputStr){

                    if(pressedValue === "0" && operator === "÷"){
                        answer.classList.add("error");
                    }
                    
                    prevLeft = leftOperand;
                    rightOperand = pressedValue;
                    answer.textContent = operate(operator, Number(leftOperand), Number(rightOperand));
                }else{
                    rightOperand += pressedValue;
                    answer.textContent = operate(operator, Number(prevLeft), Number(rightOperand));
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
                inputString += leftOperand;
            }


            screen.textContent = inputString; 
            return;
        }

        let isOperatorAcceptable = acceptableFirstOperators
            .some(operator => (operator === pressedValue) ? true : false);
        let previousPressed = inputString[inputString.length - 1];
        let isPreviousAcceptable = acceptableFirstOperators
        .some(operator => (operator === previousPressed) ? true : false);
        
        if(isOperatorAcceptable && inputString.length === 0){
            inputString = inputString.replace(new RegExp(`${leftOperand}$`, "g"), "");
            leftOperand += pressedValue
            inputString += leftOperand;
        }else if (isPreviousAcceptable && rightOperand === ""){
            rightOperand += pressedValue;
            inputString += rightOperand;
        }else if (pressedId !== "equals" && !isOperatorAcceptable || pressedId === "subtraction"){
            
            if(isNaN(previousPressed)){
                inputString = inputString.replace(operator, "");
            }else if(previousPressed === "0" && operator === "÷"){
                inputString = inputString.replace(/(÷0)$/, "");
                answer.textContent = "";
            }

            operator = pressedValue;
            inputString += operator;
        }else if(operator !== "" && pressedId === "equals"){

            if(prevLeft === "" || rightOperand === ""){
                return;
            }

            answer.textContent = operate(operator, Number(prevLeft), Number(rightOperand));

            if(isNaN(answer.textContent)){
                answer.classList.add("error");
                return;
            }

            inputString = leftOperand = answer.textContent;
            body.style.setProperty("--cursor-color", screenColor);
        }
        screen.textContent = inputString;
    });
    
    clear.addEventListener("click", () => {
        resetData(body, clear.getAttribute("id"));
    });
}

[...operands].map(setValues);
[...operators].map(setValues);

// basic operations
const add = (leftOperand, rightOperand) => leftOperand + rightOperand;
const subtract = (leftOperand, rightOperand) => leftOperand - rightOperand;
const multiply = (leftOperand, rightOperand) => leftOperand * rightOperand;
const divide = (leftOperand, rightOperand) => leftOperand / rightOperand;

const operate = (operator, leftOperand, rightOperand) => {

    let answer = null;
    const error = `Invalid operator: ${operator}`;

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
        answer = Number.parseFloat(answer).toFixed(2);
        let lastAnswerChar = answer[answer.length - 1];
        let isTrailing = lastAnswerChar == 0 && answer.includes(".");
        isTrailing = isTrailing || lastAnswerChar == ".";

        while(isTrailing){
            answer = answer.replace(/(0|\.)$/, "");
        }
    }

    return answer;

}