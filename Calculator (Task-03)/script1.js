let screen = document.getElementById("screen");
let currentInput = "";

function show(value) {
  currentInput += value;
  screen.value = currentInput;
}

function wipe() {
  currentInput = "";
  screen.value = "0";
}

function del() {
  currentInput = currentInput.slice(0, -1);
  screen.value = currentInput || "0";
}

function cal() {
  try {
    currentInput = currentInput.replace(/[^-()\d/*+.]/g, '');
    const result = evaluateExpression(currentInput);
    screen.value = result;
    currentInput = result.toString();
  } catch (error) {
    screen.value = "Error";
    currentInput = "";
  }
}

function evaluateExpression(expression) {
  const operators = [];
  const values = [];

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  const applyOperator = (operator, b, a) => {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) throw "Division by zero";
        return a / b;
    }
  };

  let i = 0;

  while (i < expression.length) {
    if (expression[i] === ' ') {
      i++;
      continue;
    }

    if (expression[i] >= '0' && expression[i] <= '9') {
      let num = '';
      while (i < expression.length && (expression[i] >= '0' && expression[i] <= '9')) {
        num += expression[i];
        i++;
      }
      values.push(parseFloat(num));
    } else if (expression[i] === '(') {
      operators.push(expression[i]);
      i++;
    } else if (expression[i] === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
      }
      operators.pop();
      i++;
    } else {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[expression[i]]) {
        values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
      }
      operators.push(expression[i]);
      i++;
    }
  }

  while (operators.length) {
    values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
  }

  return values[0];
}
