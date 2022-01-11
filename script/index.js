
let answer;
let prevLeft = "";
let operator = "";
let leftOperand = "";
let rightOperand = "";

const operands = document.getElementsByClassName("operand");
const operators = document.getElementsByClassName("operator");
const screen = document.getElementById("values-display");
screen.textContent = "";

setValues = element => {

    let inputString = "";
    const body = document.querySelector("body");
    const acceptableFirstOperators = ["√", "π", "-"];
    
    element.addEventListener("click", () => {

        let tempInputStr = "";
        let pressedValue = element.textContent;
        let pressedId = element.getAttribute("id");
        let cursorColor = getComputedStyle(body).getPropertyValue("--cursor-color");
        let screenColor = getComputedStyle(body).getPropertyValue("--screen-color");

        inputString = tempInputStr = screen.textContent;

        if(cursorColor !== "#a2c0f1"){ // resetValues
            body.style.setProperty("--cursor-color", "#a2c0f1");

            if(!isNaN(pressedValue)){
                leftOperand = "";
                inputString = "";
            }

            rightOperand = "";
            operator = "";
        }

        if(!isNaN(pressedValue)){
            if(operator !== ""){
                inputString = inputString.replace(new RegExp(`${rightOperand}$`, "g"), "");
                
                if(inputString === tempInputStr){
                    rightOperand = pressedValue;
                }else{
                    rightOperand += pressedValue;
                }

                prevLeft = leftOperand;
                leftOperand = answer = operate(operator, Number(leftOperand), Number(rightOperand));
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
            }

            operator = pressedValue;
            inputString += operator;
        }else if(operator !== "" && pressedId === "equals"){
            answer = operate(operator, Number(prevLeft), Number(rightOperand));
            inputString = leftOperand = answer;
            body.style.setProperty("--cursor-color", screenColor);
        }
        screen.textContent = inputString;
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

    const error = `Invalid operator: ${operator}`;

    if(operator === "+"){
        return add(leftOperand, rightOperand);
    }

    if(operator === "-"){
        return subtract(leftOperand, rightOperand);
    }
    
    if(operator === "x"){
        return multiply(leftOperand, rightOperand);
    }

    if(operator === "÷"){
        return divide(leftOperand, rightOperand);
    }

    return error;

}