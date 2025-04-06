import { initializeGameState, processGameTurn, isGameOver, getFinalResults } from './snake-engine.js';
import { GAME_MODE, snakeModules } from './game-config.js';

const gameState = initializeGameState(GAME_MODE, snakeModules);

while (!isGameOver(gameState)) {
  processGameTurn(gameState);
}

console.log("✅ Final Scores:", getFinalResults(gameState));
