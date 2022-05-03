function compare(guess, solution) 
{
    let result = [];
    for (let i = 0; i < guess.length; i++) {
      let guessLetter = guess.charAt(i);
      let solutionLetter = solution.charAt(i);
      if (guessLetter === solutionLetter) {
        result.push("Green");
      }
      else if (solution.indexOf(guessLetter) != -1) {
        result.push("Yellow");
      }
      else {
        result.push("Grey");
      }
    }
    return result;
}

function generate_Answer_Equation(difficulty)
{
  var TreeNode = function(left, right, operator) {
    this.left = left;
    this.right = right;
    this.operator = operator;

    if (eval(left) < eval(right))
    {
      //console.log("left < right " + '(' + left + ' ' + operator + ' ' + right + ')');
      let temp = right;
      right = left;
      left = temp;
    }
    else if (eval(left) === eval(right))
    {
      //console.log("left==right " + '(' + left + ' ' + operator + ' ' + right + ')');
      left += 1;
    }
    if (operator === '/' && eval(right) === 0)
    {
      right +=1;
    }
    
    this.toString = function() {
        return '(' + left + ' ' + operator + ' ' + right + ')';
    }
  }

  function randomNumberRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  var x = ['/','*','-','+'];

  function buildTree(numNodes) {
      if (numNodes === 1)
          return randomNumberRange(0, 9);
      
      var numLeft = Math.floor(numNodes / 2);
      var leftSubTree = buildTree(numLeft);
      var numRight = Math.ceil(numNodes / 2);
      var rightSubTree = buildTree(numRight);
      
      var m = randomNumberRange(0, x.length);
      var str = x[m];
      return new TreeNode(leftSubTree, rightSubTree, str);
  }

  return buildTree(difficulty).toString();
}

function clean_equation(equation_string)
{
  return equation_string.replace(/[() ]+/g, "");
}

const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

const keys = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '-',
  '/',
  '*',
  '⌫',
  'ENTER',
]

const guessRows = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
]

let currentRow = 0
let currentTile = 0


guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)

  guessRow.forEach((guessTile, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })

  tileDisplay.append(rowElement)
})


keys.forEach(key => {
  const buttonElement = document.createElement('button')
  buttonElement.textContent = key
  buttonElement.setAttribute('id', key)
  buttonElement.addEventListener('click', () => handleClick(key))
  keyboard.append(buttonElement)
})

const handleClick = (key) => {
  //console.log('clicked', key)
  switch(key) {
    case 'ENTER': {
      let guess = getGuess()
      if (guess.length == 7) {
        let result = compare(getGuess(), equation)
        let greenCount = 0
        result.forEach((answer,index) => {
          switch(answer) {
            case 'Green': {
              const position = document.getElementById('guessRow-' + currentRow + '-tile-' + index).style.backgroundColor='green'
              greenCount += 1
              document.getElementById(guess[index]).style.backgroundColor = 'green'
              break;
            }
            case 'Yellow': {
              const position = document.getElementById('guessRow-' + currentRow + '-tile-' + index).style.backgroundColor='orange'
              if (document.getElementById(guess[index]).style.backgroundColor != 'green')
              {
                document.getElementById(guess[index]).style.backgroundColor = 'orange'
              }
              break;
            }
            case 'Grey': {
              const position = document.getElementById('guessRow-' + currentRow + '-tile-' + index).style.backgroundColor='red'
              document.getElementById(guess[index]).style.backgroundColor = 'red'
              break;
            }
          }
        })
        if (greenCount == 7) {
          const victoryMessage = document.createElement('h2')
          victoryMessage.textContent = "You won!"
          messageDisplay.append(victoryMessage)
        }
        if (currentRow < 5){
          currentRow += 1
          currentTile = 0
        }
        else if (currentRow == 5)
          {
            const victoryMessage = document.createElement('h2')
            victoryMessage.textContent = "You Lost! solution was: " + equation
            messageDisplay.append(victoryMessage)
          }
        console.log(result);
      }

      break;
    }
    case '⌫': {
      
      if (currentTile > 0)
      {
        currentTile -= 1
        addLetter('')
      }
      else 
      {
        addLetter('')
      }
      
      break;
    }  
    default: {
      if (currentTile <= 6)
      {
        addLetter(key);
        currentTile += 1
      }
      break;
    }

  }
}

const addLetter = (letter) => {
  const position = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
  position.textContent = letter

}

const getGuess = () => {
  let result = ""
  for (let index = 0; index < 7; index++) {
    result += document.getElementById('guessRow-' + currentRow + '-tile-' + index).textContent
  }
  return result
}

var equation = clean_equation((generate_Answer_Equation("4")).toString());
var solution = eval(equation);
var solutionPadded = solution
solutionPadded = +solution.toFixed(3)
const solutionElement = document.createElement('h1')
solutionElement.textContent = "= " + solutionPadded
const equationElement = document.createElement('h1')
equationElement.textContent = "Answer: " + equation
equationElement.style.color = '#121213'
messageDisplay.append(equationElement)
messageDisplay.append(solutionElement)
