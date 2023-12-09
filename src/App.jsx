import { useState } from 'react';
import confetti from 'canvas-confetti';

import { Square } from './components/Square';
import './index.css';
import { TURNS, initialBoard } from './constants';
import { checkWinner } from './components/logic/board';
import { WinnerModal } from './components/WinnerModal';

function App() {
  const [board, setBoard] = useState(initialBoard);

  const [turn, setTurn] = useState(TURNS.X);

  const [winner, setWinner] = useState(null); //null means no winner, false means draw

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn(TURNS.X);
    setWinner(null);
  };

  const checkEndGame = (boardToCheck) => {
    return boardToCheck.every((_) => _ !== null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
      console.log(winner);
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  );
}

export default App;
