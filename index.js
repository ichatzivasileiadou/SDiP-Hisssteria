// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';
import chalk from 'chalk';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Hisssteria",       // TODO: Your Battlesnake Username
    color: "#d9a0e5", // TODO: Choose color
    head: "all-seeing",  // TODO: Choose head
    tail: "curled",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// printBoard is called when a move is made and prints the board along with its contents
function printBoard(gameState) {

  // Get the board dimensions from the game state
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // Create an empty board using a 2D array, initially filled with dots
  let board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(chalk.hex('#845ec2').bold('.')));

  // Create a Map to track the food positions
  const foodPositions = new Map();
  gameState.board.food.forEach(food => {
    foodPositions.set(`${food.x},${food.y}`, chalk.bgHex('#ff9671')('F')); // Mark food with 'F' at the position (x,y)
  });

  // Place food on the board
  foodPositions.forEach((symbol, position) => {
    const [x, y] = position.split(',').map(Number);
    board[y][x] = symbol;
  });

  // Place snakes on the board
  gameState.board.snakes.forEach(snake => {

    const head = snake.body[0];
    board[head.y][head.x] = chalk.black.bgHex('#d65db1')('H'); // Mark the head with 'H'

    // The rest of the body is marked as 'B'
    for (let i = 1; i < snake.body.length; i++) {
      const bodyPart = snake.body[i];

      //When the head and the body overlap, both are marked as 'H', else the body is marked as 'B'
      if ((head.y == bodyPart.y) && (head.x == bodyPart.x)) {
        board[bodyPart.y][bodyPart.x] = chalk.black.bgHex('#d65db1')('H'); 
      } else {
        board[bodyPart.y][bodyPart.x] = chalk.black.bgHex('#d65db1')('B'); 
      }

    }
  });

  console.log(chalk.hex('#f9f871').bold('Board:'));
  for (let y = (boardHeight - 1); y >= 0; y--) {
    for (let x = 0; x < boardWidth; x++) {
      process.stdout.write(chalk.bgHex('#f9f871').bold(` ${board[y][x]} `));
    }
    process.stdout.write(('\n'));
  }
};

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  console.log(gameState);
  printBoard(gameState); 
  
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body;

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
