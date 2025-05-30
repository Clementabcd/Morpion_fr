import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
    [0, 4, 8], [2, 4, 6] // diagonales
  ];

  const checkWinner = (squares) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine(combo);
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) return 'draw';
    return null;
  };

  const minimax = (squares, depth, isMaximizing) => {
    const result = checkWinner(squares);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'O';
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
          squares[i] = 'X';
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const computerMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    const newBoard = [...board];

    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        const score = minimax(newBoard, 0, false);
        newBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== undefined) {
      const updatedBoard = [...board];
      updatedBoard[bestMove] = 'O';
      setBoard(updatedBoard);
      setIsPlayerTurn(true);
    }
  };

  const handleClick = (index) => {
    if (board[index] || !isPlayerTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
    } else if (!isPlayerTurn) {
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
  };

  const getSquareClasses = (index) => {
    let classes = "w-24 h-24 border-4 border-indigo-600 flex items-center justify-center text-4xl font-bold transition-all duration-300 hover:bg-indigo-100 ";
    
    if (winningLine.includes(index)) {
      classes += "bg-green-200 ";
    }
    
    if (board[index] === 'X') {
      classes += "text-pink-600";
    } else if (board[index] === 'O') {
      classes += "text-blue-600";
    }
    
    return classes;
  };

  const getStatusMessage = () => {
    if (winner === 'X') {
      return "Félicitations ! Vous avez gagné ! 🎉";
    } else if (winner === 'O') {
      return "L'ordinateur a gagné ! 🤖";
    } else if (winner === 'draw') {
      return "Match nul ! 🤝";
    }
    return isPlayerTurn ? "À votre tour (X)" : "Tour de l'ordinateur (O)";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-3xl font-bold text-indigo-800">Morpion</div>
      
      {(winner || !isPlayerTurn) && (
        <Alert className="mb-6 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="ml-2">
            {getStatusMessage()}
          </AlertTitle>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow-xl">
        {board.map((square, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={getSquareClasses(index)}
            disabled={!isPlayerTurn || winner}
          >
            {square}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
      >
        <RotateCcw className="h-5 w-5" />
        Nouvelle partie
      </button>
    </div>
  );
};

export default TicTacToe;
