const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};

// to deposit the money taken from the user
const deposit = () => {
    while (true){
        const depositAmount = parseFloat(prompt("Enter your amount: "));
        if (isNaN(depositAmount) || depositAmount <= 0){
            console.log("Invalid deposit amount, try again.")
        }
        else{
            return depositAmount
        }
    }
};

// to determine the number of lines to bet on
const getNumberOfLines = () => {
    while (true){
        const noOfLines = parseFloat(prompt("Enter the number of lines to bet on (1-3): "));
        if (isNaN(noOfLines) || noOfLines <= 0 || noOfLines > 3){
            console.log("Invalid number of lines, try again.")
        }
        else{
            return noOfLines
        }
    }
};

// to collect the bet amount
const getBet = (balance, lines) => {
    while (true){
        const bet = parseFloat(prompt("Enter your bet per line: "));
        if (isNaN(bet) || bet <= 0 || bet > (balance / lines)){
            console.log("Invalid amount, try again.")
        }
        else{
            return bet;
        }
    }
}

// to spin the slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols]
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

// to transpose the reels
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i] )
        }
    }
    return rows;
};

// to print out the slot machine rows (to check if the user won)
const printRows = (rows) => {
    for (const row of rows){
        let rowString = "";
        for (const[i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString)
    }
}

// determines the winning
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
}

// to keep going until balance remains
const game = () => {
    let balance = deposit();
    while (true){
        console.log("You have a balance of $"+ balance)
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings
        console.log("you won $"+winnings.toString())

        
        if (balance <= 0) {
            console.log("You ran out of money!")
            break
        }

        const playAgain = prompt("Would you like to play again? (y/n): ");

        if (playAgain != "y") break;
    }
}

game();