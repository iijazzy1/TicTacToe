const X_CLASS = 'x'
const O_CLASS = 'o'
const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const startButton = document.getElementById("startButton")
const startScreen = document.getElementById("startScreen")
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[winning-message-text]')
const restartButton = document.getElementById("restartButton")
const timer = document.getElementById('timer')

var time_amount = 3
var time

let oTurn

startButton.addEventListener('click', startGame)

restartButton.addEventListener('click', startGame)


function startTime(){
    time = setInterval(() => {
        if(time_amount == 0) {
            timer.innerText = `Player ${oTurn ? "X" : "O"} 's Turn!`
            swapTurns()
            setBoardHoverClass()
        }else{
            if(time_amount < 10){
                time_amount = 0 + '' + time_amount
            }
    
            timer.innerText = '00:' + time_amount
            time_amount -= 1;
        }
    }, 1000)
}


function stopTime(){
    clearInterval(time)
    time_amount = 3;
}

function startGame(){
    stopTime()
    startTime()
    startScreen.remove('show')

    oTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    timer.classList.add('show')
    winningMessageElement.classList.remove('show')
}

function handleClick(e){
    // add a mark
    const cell = e.target
    const currentClass = oTurn ? O_CLASS : X_CLASS
    placeMark(cell, currentClass)
    
    // check for a win
    if (checkWin(currentClass)){
        endGame(false)
        stopTime()
    } else if (isDraw()){
        // check for a draw
        endGame(true)
    }else{
        // switch turns
        swapTurns()
        setBoardHoverClass() // has to be after so it shows whose turn it is
    }
    
}

function endGame(draw){
    if(draw){
        stopTime()
        winningMessageTextElement.innerText = "Draw!"
    }else{
        winningMessageTextElement.innerText = `Player ${oTurn ? "O" : "X"} Wins!`
    }

    winningMessageElement.classList.add('show')
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
    })
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
    time_amount = 3;
}

function swapTurns(){
    oTurn = !oTurn
    time_amount = 3;
}

function setBoardHoverClass(){
    // remove the classes on the board
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)

    if(oTurn){  // if it's O's turn we want to add the O class and make O hover
        board.classList.add(O_CLASS)
    }else{  // otherwise we add the X class and make X hover
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass){
    return WINS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}