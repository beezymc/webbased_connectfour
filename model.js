class ConnectFour {
    constructor (boardSide) {
        this.boardSide = boardSide;
        this.model = new ConnectModel(boardSize);
        this.board = this.createBoard();
    }

    createBoard = () => {
        let boardDiv = document.getElementsByClassName("board")[0];
        let board = new Array(this.boardSide);
        for (let i = 0; i < this.boardSide; i++) {
            board[i] = [];
            let row = document.createElement('div');
            row.className = 'row';
            boardDiv.appendChild(row);
            for (let j = 0; j < this.boardSide; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.addEventListener("click", (e) => this.handleUserMove(i, j));
                row.appendChild(cell);
                board[i].push(cell);
            }
        }
        return board;
    }

    handleUserMove = (i, j) => {
        let data = this.model.playerMove(i, j);
        if(!data) return;
        this.updateBoard(data);
        this.handleGameEnd(data);
    }

    updateBoard = (data) => {
        for (let i = 0; i < this.boardSide; i++) {
            for (let j = 0; j < this.boardSide; j++) {
                this.board[i][j].innerHTML = data.board[i][j];
            }
        }
    }

    handleGameEnd = (data) => {
        if (data.state === "won") {
            return window.alert(`${data.player} won! Refresh to play again.`)
        } else if (data.state === "draw") {
            return window.alert("Draw game! Refresh to play again!")
        }
    }
};

class ConnectModel {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.player = "X";
        this.board = this.buildBoard();
        this.state = "ongoing" // win, draw;
    }

    buildBoard = () => {
        const board = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize);
            for(let j = 0; j < this.boardSize; j++) {
                board[i][j] = " ";
            }
        }
        return board
    }

    playerMove = (x, y) => {
        if (!this.isPositionValid(x, y)) return null;
        if (this.state !== "ongoing") return null;
        this.board[x][y] = this.player;
        this.updateState(this.player);
        if (this.state !== "won") this.changePlayer();  
        return {
            board: this.board,
            state: this.state,
            player: this.player
        }
    }

    updateState = (player) => {
        if (this.isDraw()) {
            this.state = "draw";
        } else if (this.isWinner(player)) {
            this.state = "won";
        }
    }

    isWithinBounds = (x, y) => x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;

    changePlayer = () => {
        if (this.player === "X") {
            this.player = "O";
        } else {
            this.player = "X";
        }
    }

    isPositionValid = (x, y) => this.board[x][y] === " ";

    isDraw = () => {
        for (let i = 0; i < this.boardSize; i++) {
            for(let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === " ") return false;
            }
        }
        return true;
    }

    isWinner = (player) => {
        let connectFourCheck = 0;
        //check horizontal win
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === player) {
                    connectFourCheck++;
                } else {
                    connectFourCheck = 0;
                }
                if (connectFourCheck === 4) return true;
            }
            connectFourCheck = 0;
        }
        //check vertical win
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[j][i] === player) {
                    connectFourCheck++;
                } else {
                    connectFourCheck = 0;
                }
                if (connectFourCheck === 4) return true;
            }
            connectFourCheck = 0;
        }
        // forward diagonal direction check
        let currX = 0;
        let currY = 0;
        let x = 0;
        let y = 0;
        for (let i = 0; i < (this.boardSize*2)-2; i++) {
            while (this.isWithinBounds(x, y)) {
                if (this.board[x][y] === player) {
                    connectFourCheck++
                } else {
                    connectFourCheck = 0;
                }
                if (connectFourCheck === 4) return true;
                x = x + 1;
                y = y - 1;
            }
            if (i >= this.boardSize - 1) {
                currX = currX + 1;
            } else {
                currY = currY + 1;
            }
            x = currX;
            y = currY;
            connectFourCheck = 0;
        }
        // backward diagonal direction check
        currX = this.boardSize - 1;
        currY = 0;
        x = currX;
        y = currY;
        for (let i = 0; i < (this.boardSize*2)-2; i++) {
            while (this.isWithinBounds(x, y)) {
                if (this.board[x][y] === player) {
                    connectFourCheck++
                } else {
                    connectFourCheck = 0;
                }
                if (connectFourCheck === 4) return true;
                x = x - 1;
                y = y - 1;
            }
            if (i >= this.boardSize - 1) {
                currX = currX - 1;
            } else {
                currY = currY + 1;
            }
            x = currX;
            y = currY;
            connectFourCheck = 0;
        }
        return false;
    }
}

const boardSize = 5;


let game = new ConnectFour(boardSize);