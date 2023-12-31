import { useState } from "react"
import confetti from 'canvas-confetti'

import { Square } from './components/Square'
import './index.css'
import { TURNS, initialBoard } from './constants'
import { checkEndGame, checkWinner } from './components/logic/board'
import { WinnerModal } from './components/WinnerModal'

function App () {
  // console.log('render board');
  const [board, setBoard] = useState( () => {
    // console.log('inicializar estado del board'); //esto se hace aqui porque es lento y sincrono, ademas si se hace afuera se haria cada vez que se renderiza un componente.
    const boardFromStorage = window.localStorage.getItem('board')
    return (boardFromStorage) ? JSON.parse(boardFromStorage) : initialBoard
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return JSON.parse(turnFromStorage) ?? TURNS.X
  })

  const [winner, setWinner] = useState(null) // null means no winner, false means draw

  const resetGame = () => {
    setBoard(initialBoard)
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className='game'>
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />
    </main>
  )
}

export default App
