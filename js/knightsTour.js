"use strict";

const xMoveArr = [-1, -2, -2, -1, 1, 2,  2,  1];
const yMoveArr = [-2, -1,  1,  2, 2, 1, -1, -2];

/* UTILITY FUNCTIONS */
/* Alternative logging function for console.log */
function LOG(param) {
    return console.log(param);
}

/* Returns number of tiles from user input */
function getNumOfTiles() {
    let numOfTiles = NaN;
    while (isNaN(numOfTiles) || !(numOfTiles >= 5 && numOfTiles <= 10)) {
        numOfTiles = parseInt(prompt("Enter size of board from 5 - 10 (Ex: '8' for 8x8 board): ", 8));
        if (isNaN(numOfTiles)) {
            alert ("INVALID INPUT: Not a number!");
        }
        else if (!(numOfTiles >= 5 && numOfTiles <= 10)) {
            alert ("INVALID INPUT: Range is 5 to 10 only!");
        }
    }
    return numOfTiles;
}

/* Returns number of tiles from user input */
function getNumOfTilesFromLevel(level) {
    let numOfTiles = 0;
    switch (level) {
        case 1: numOfTiles = 5; break;
        case 2: numOfTiles = 6; break;
        case 3: numOfTiles = 7; break;
        case 4: numOfTiles = 8; break;
        case 5: numOfTiles = 9; break;
        case 6: numOfTiles = 10; break;
        default: numOfTiles = 5;
    }
    return numOfTiles;     
}

/* Setup tiles based from nTiles value */
function setupTiles(nTiles, clickCb) {
    let totalTiles = nTiles * nTiles;
    let tileSize = 100 / nTiles;

    $("#container").html("");
    for (let i = 0; i < totalTiles; i++) {
        $("#container").append("<button id="+i+"></button>");
        $("#"+i).addClass("tiles");
    }
    $(".tiles").css("width",tileSize+"%");
    $(".tiles").css("height",tileSize+"%");
    $(".tiles").click(clickCb);

}

/* Initialize board */
function initBoard(numOfTiles) {
    let board = [];
    
    for (let i = 0; i < numOfTiles; i++) {
        board[i] = [];
        for (let j = 0; j < numOfTiles; j++) {
            board[i][j] = -1;
        }
    }
    return board;
}

/* Get previous X and Y */
function getPreviousMoves(board, numOfTiles, moveCount) {
    if (moveCount == 0) {
        return [-1, -1];
    }

    for (let i = 0; i < numOfTiles; i++) {
        for (let j = 0; j < numOfTiles; j++) {
            if (board[i][j] == moveCount) {
                return [i, j];
            }
        }
    }
}

function isSafe(x, y, board, N) {
    if (x < 0 || x >= N ||
        y < 0 || y >= N ||
        board[x][y] != -1)
    {
        /* If indices is invalid or indices already occupied */  
        return false;
    }
    return true;
}

function isValid(board, numOfTiles, prevX, prevY, currentX, currentY) {

    if (prevX == -1 && prevY == -1) {
        /* if first move, valid */
        return true;
    }

    if (!isSafe(currentX, currentY, board, numOfTiles))
    {
        /* If indices is invalid or indices already occupied */  
        return false;
    }

    for (let i = 0; i < xMoveArr.length; i++) {
        if (currentX == (xMoveArr[i] + prevX) && currentY == (yMoveArr[i] + prevY)) {
            return true;
        }
    }

    return false;
}

/* Function to process move of knight upon click */
function plotMoveInBoard(selector, board, moveCount, numOfTiles, score, isWinner){
    let id = $(selector).attr("id");
    let xIndex = Math.floor(id / numOfTiles);
    let yIndex = id % numOfTiles;
    let prevX = -1;
    let prevY = -1;

    [prevX, prevY] = getPreviousMoves(board, numOfTiles, moveCount);

    if (isValid(board, numOfTiles, prevX, prevY, xIndex, yIndex)) {
        board[xIndex][yIndex] = ++moveCount;
        score += numOfTiles; /* For now, increment value of score will be number of tiles */
    } else {
        score = (score > 1)? score - 2 : 0; /* If invalid move, decrease score by 2 */
        alert ("Invalid move!");
    }

    /* Check if winner */
    if (moveCount == (numOfTiles*numOfTiles)) {
        isWinner = true;
    }

    return [board, moveCount, xIndex, yIndex, score, isWinner];
}

/* Move knight in UI */
function moveKnightInUI(board, numOfTiles, moveCount, score) {
    let k = 0;
    for (let i = 0; i < numOfTiles; i++) {
        for (let j = 0; j < numOfTiles; j++) {
            if (board[i][j] != -1) {
                $("#"+k).text(board[i][j]).css("background-color","lightgreen").attr("disabled", true);
                $("#"+k).css("background-image","none");
                if (board[i][j] == moveCount) {
                    $("#"+k).text("").css("background", "url(assets/knight.png) no-repeat center yellow");
                    $("#"+k).css("background-size", "contain");
                }
            }
            else {
                $("#"+k).text("").css("background-color","lightblue").attr("disabled", false);
                $("#"+k).css("background-image","none");
            }
            k++;
        }
    }

    $("#score").text(score);
}

function undoMoveInBoard(board, moveCount, numOfTiles) {
    let prevX = -1;
    let prevY = -1;
    [prevX, prevY] = getPreviousMoves(board, numOfTiles, moveCount);
    board[prevX][prevY] = -1;
    return [board, moveCount - 1];
}

function resetBoard(level, score) {
    let numOfTiles = getNumOfTilesFromLevel(level);
    $(".tiles").text("").attr("disabled", false).css("background","lightblue");
    $("#score").text(score)
    $("#level").text(level)
    return [initBoard(numOfTiles), 0, -1, -1, numOfTiles, false];
}

/* Main function for Knight's Tour Game */
function playGame() {
    let moveCount = 0;
    //let numOfTiles = getNumOfTiles();
    let level = 1;
    let numOfTiles = getNumOfTilesFromLevel(level);
    let board = initBoard(numOfTiles);
    let currentX = -1;
    let currentY = -1;
    let score = 0;
    let isWinner = false;
    let processTileClick = function(){
        [board, moveCount, currentX, currentY, score, isWinner] = plotMoveInBoard(this, board, moveCount, numOfTiles, score, isWinner);
        moveKnightInUI(board, numOfTiles, moveCount, score);
        if (isWinner) {
            level++;
            if (level <= 6) {
                alert("You WIN! Prepare for next level!");
                [board, moveCount, currentX, currentY, numOfTiles, isWinner] = resetBoard(level, score);
                setupTiles(numOfTiles, processTileClick);
                alert("Level: "+level+" Start!");
            } else {
                alert ("Congratulations! You have finished Knight's Tour Game!");
            }
        }
    }

    $("#level").text(level);
    setupTiles(numOfTiles);
    alert("Level: "+level+" Start!");
    /* Handles knight moves */
    $(".tiles").click(processTileClick);

    /* Handles reset button */
    $("#resetButton").click(function(){
        [board, moveCount, currentX, currentY, numOfTiles, isWinner] = resetBoard(level, score=0);
    });

    /* Handles undo button */
    $("#undoButton").click(function(){
        if (moveCount > 0 && moveCount < (numOfTiles*numOfTiles)) {
            [board, moveCount] = undoMoveInBoard(board, moveCount, numOfTiles);
            score -= numOfTiles; /* Undo score */
            score = (score > 1)? score - 2 : 0; /* If invalid move, decrease score by 2 */
            moveKnightInUI(board, numOfTiles, moveCount, score);
        }
    });

    /* Handles solve button */
    $("#solveButton").click(function(){
        if (level <= 2) {
            if (moveCount == 0) {
                alert ("Please select initial move!");
            }
            else if (moveCount < (numOfTiles*numOfTiles)) {
                moveCount = solve (board, numOfTiles, moveCount, currentX, currentY);
            }
        } else {
            alert("Solve not yet available at this level!");
        }
    });
}

$(document).ready(function(){
    playGame();
    LOG("END!");
});

function solve(board, N, moveCount, currentX, currentY) {

    if (solveKTUtil(currentX, currentY, board, N, moveCount) == 0) {
        alert ("Current move has NO solution! Please try again or undo.");
    } else {
        moveCount = (N*N);
        moveKnightInUI(board, N, moveCount, 0);
    }
    return moveCount;
}

function solveKTUtil(x, y, board, N, moveCount) {
    let nextX;
    let nextY;

    if (moveCount == (N*N)) {
        return 1;
    }

    for (let i = 0; i < xMoveArr.length; i++) {
        nextX = x + xMoveArr[i];
        nextY = y + yMoveArr[i];
        if (isSafe(nextX, nextY, board, N)) {
            board[nextX][nextY] = moveCount + 1;
            if (solveKTUtil(nextX, nextY, board, N, moveCount+1) == 1) {
                return 1;
            } else {
                board[nextX][nextY] = -1;
            }
        } 
    }
    return 0;
}
