// src/Chessboard.js
import React, { useState } from "react";
import "./Chessboard.css";

const Chessboard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white')

  const handlePieceDragStart = (e, row, col) => {
    setSelectedPiece({ row, col });
  };

  const resetBoard = () => {
    const restartBoard = [
      ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
      ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    ];

    setBoard(restartBoard);
    setCurrentPlayer(currentPlayer === "black" ? "white" : "white")
    setSelectedPiece(null);
  };
  

  const handleSquareDrop = (e, targetRow, targetCol) => {
    e.preventDefault()
    const sourceRow = selectedPiece.row;
    const sourceCol = selectedPiece.col;
    const piece = board[sourceRow][sourceCol];

    const whoMoved = piece === "♙" || piece === "♖" || piece === "♘" || piece === "♗" || piece === "♕" || piece === "♔" ? "white" : "black"

    if (whoMoved !== currentPlayer) {
      return
    }

    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

    if (isValidMove(piece, sourceRow, sourceCol, targetRow, targetCol)) {
      const newBoard = simulateMove(board, sourceRow, sourceCol, targetRow, targetCol);
      setBoard(newBoard);

      if (isCheckmate(newBoard, piece === "♟" || piece === "♜" || piece === "♝" || piece === "♞" || piece === "♛" ? "black" : "white")) {
        const winner = piece === "♟" || piece === "♜" || piece === "♝" || piece === "♞" || piece === "♛" ? "Black" : "White";
        const restart = window.confirm(`${winner} wins. Do you want to restart?`);

        
        if (restart) {
          resetBoard();
        }
      }
    }

    setSelectedPiece(null);
  };

  const isValidMove = (piece, sourceRow, sourceCol, targetRow, targetCol) => {
    // Check for valid pawn moves

    const targetPiece = board[targetRow][targetCol];
    if (targetPiece && targetPiece.charCodeAt(0) <= 9817 && targetPiece.charCodeAt(0) > 9811 ) {
      // Check for white piece (ASCII code range for white pieces)
      if (piece.charCodeAt(0) <= 9817 && piece.charCodeAt(0) > 9811) {
        
        return false; // White piece trying to capture white piece
      }
    }

    if (targetPiece && targetPiece.charCodeAt(0) > 9817 && targetPiece.charCodeAt(0) <= 9823 ) {
      // Check for white piece (ASCII code range for white pieces)
      if (piece.charCodeAt(0) > 9817 && piece.charCodeAt(0) <= 9823) {
      
        return false; // White piece trying to capture white piece
      }
    }

    

    if (piece === "♟" || piece === "♙") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);
    

      const forwardDirection = piece === "♟" ? 1 : -1; // Adjust for white and black pawns

      if (
        colDiff === 0 &&
        rowDiff === 1 &&
        targetRow - sourceRow === forwardDirection &&
        board[targetRow][targetCol] === ""
      ) {
        return true; // Allow single pawn move
      }
      if (
        colDiff === 0 &&
        rowDiff === 2 &&
        sourceRow === (piece === "♟" ? 1 : 6) &&
        board[targetRow][targetCol] === ""
      ) {
        return true; // Allow double pawn move on first move
      }
      if (
        colDiff === 1 &&
        rowDiff === 1 &&
        board[targetRow][targetCol] !== ""
      ) {
        return true; // Allow pawn capture
      }

      return false; // Invalid pawn move
    }

    // Check for valid bishop moves
    if (piece === "♝" || piece === "♗") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if (rowDiff === colDiff) {
        const rowDir = targetRow > sourceRow ? 1 : -1;
        const colDir = targetCol > sourceCol ? 1 : -1;
        for (let i = 1; i < rowDiff; i++) {
          if (board[sourceRow + i * rowDir][sourceCol + i * colDir] !== "") {
            return false; // Blocked path
          }
        }
        return true; // Valid bishop move
      }

      return false; // Invalid bishop move
    }

    // Check for valid knight moves
    if (piece === "♞" || piece === "♘") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if (
        (rowDiff === 2 && colDiff === 1) ||
        (rowDiff === 1 && colDiff === 2)
      ) {
        return true; // Valid knight move
      }

      return false; // Invalid knight move
    }

    if (piece === "♜" || piece === "♖") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if ((rowDiff > 0 && colDiff === 0) || (colDiff > 0 && rowDiff === 0)) {
        const rowDir =
          targetRow > sourceRow ? 1 : targetRow < sourceRow ? -1 : 0;
        const colDir =
          targetCol > sourceCol ? 1 : targetCol < sourceCol ? -1 : 0;
        for (let i = 1; i < Math.max(rowDiff, colDiff); i++) {
          if (board[sourceRow + i * rowDir][sourceCol + i * colDir] !== "") {
            return false; // Blocked path
          }
        }
        return true; // Valid rook move
      }

      return false; // Invalid rook move
    }

    if (piece === "♛" || piece === "♕") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if (
        rowDiff === colDiff ||
        (rowDiff > 0 && colDiff === 0) ||
        (colDiff > 0 && rowDiff === 0)
      ) {
        const rowDir =
          targetRow > sourceRow ? 1 : targetRow < sourceRow ? -1 : 0;
        const colDir =
          targetCol > sourceCol ? 1 : targetCol < sourceCol ? -1 : 0;
        for (let i = 1; i < Math.max(rowDiff, colDiff); i++) {
          if (board[sourceRow + i * rowDir][sourceCol + i * colDir] !== "") {
            return false; // Blocked path
          }
        }
        return true; // Valid queen move
      }

      return false; // Invalid queen move
    }

    // Check for valid king moves
    if (piece === "♚" || piece === "♔") {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);

      if (rowDiff <= 1 && colDiff <= 1) {
        return true; // Valid king move
      }
      return false; // Invalid king move
    }

    return false;
  };

  const isCheckmate = (board, playerColor) => {
    const kingSymbol = playerColor === "white" ? "♔" : "♚";

    // Find the king's position
    let kingPosition = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingSymbol) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) {
        break;
      }
    }

    if (!kingPosition) {
      return false; // King not found, should not happen
    }

    // Simulate moves for the opponent's pieces and check if the king can be captured 
    let whitekingalive = false
    let blackkingalive = false
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece.charCodeAt(0) === 9812) {
          whitekingalive = true
        }
        if (piece.charCodeAt(0) === 9818) {
          blackkingalive = true
        }
        
        if (whitekingalive && blackkingalive) {
          return false; // King can be defended
        }
      }
    }

    return true; // King cannot escape capture
  };

  // Calculate possible moves for a piece
  

  const simulateMove = (board, sourceRow, sourceCol, targetRow, targetCol) => {
    const updatedBoard = [...board];
    const piece = updatedBoard[sourceRow][sourceCol];
    updatedBoard[targetRow][targetCol] = piece;
    updatedBoard[sourceRow][sourceCol] = "";
    //console.log(updatedBoard)
    return updatedBoard;
  };

  return (
    <div className="everything">
      <div className="board">
        {board.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((piece, colIndex) => (
              <div className={`square ${(rowIndex + colIndex) % 2 === 0 ? "dark" : ""}`} key={colIndex} onDrop={(e) => handleSquareDrop(e, rowIndex, colIndex)} onDragOver={(e) => e.preventDefault()}>
                {piece && (
                  <div className={`piece ${piece.charCodeAt(0) > 9817 ? "dark" : "light"}`} draggable onDragStart={(e) => handlePieceDragStart(e, rowIndex, colIndex)}>
                    {piece}
                  </div>
                )}
              </div>
              
            ))}
          </div>
        ))}
      </div>
      <button className="reset" onClick={resetBoard}>Restart</button>
    </div>
  );
};

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];


export default Chessboard;
