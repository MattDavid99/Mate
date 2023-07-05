// import { Type } from "../ChessBoard";
// import { Team } from "../ChessBoard";

// export default class MatchRef {

//   squareHasPiece(x, y, boardState) {
//     const piece = boardState.find((i) => i.x == x && i.y == y)

//     if (piece) {
//       console.log("----This square already has a piece");
//       return true
//     } else {
//       return false
//     }
//   }

//   squareHasOpponent(x,y,boardState, team) {
//     const piece = boardState.find((i) => i.x == x && i.y == y && i.team != team)

//     if (piece) {
//       return true

//     } else {
//       return false
//     }
//   }

//   theEnPassant(prevX, prevY, x, y, type, team, boardState) {
//     const direction = team == Team.WHITE ? 1 : -1

//     if (type == Type.PAWN) {

//       if ((x - prevX == -1 || x - prevX == 1) && y - prevY == direction) {
//         const piece = boardState.find((i) => i.x == x && i.y == y - direction && i.enPassant)

//         if (piece) return true

//       }
//     }
//     return false
//   }

//   checkingMoves(prevX, prevY, x, y, type, team, boardState) {

//     // const currentBoardState = boardState
//   }



//   validMove(prevX, prevY, x, y, type, team, boardState) {
//     console.log(`Ref is checking the move for ${type}...`);
//     console.log(`Previous location: (${prevX},${prevY})`);
//     console.log(`Current location: (${x},${y})`);
//     console.log(`Team: ${team}`);
//     console.log(boardState);

//     // Valid Moves for Pawn   (PAWN ⬇️⬇️⬇️⬇️⬇️⬇️)
//     if (type === Type.PAWN) {

//         const row = team == Team.WHITE ? 1 : 6
//         const direction = team == Team.WHITE ? 1 : -1

//         if (prevX == x && prevY == row && y - prevY == 2 * direction) {
//           if (!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x, y - direction, boardState)) return true

//         } else if (prevX == x && y - prevY == direction) {
//               if (!this.squareHasPiece(x,y,boardState)) return true
//           }

//           // Taking Piece: Pawn
//           else if (x - prevX == -1 && y - prevY == direction) {
//             if (this.squareHasOpponent(x,y,boardState,team)) return true
//           }

//           else if (x - prevX == 1 && y - prevY == direction) {
//             if (this.squareHasOpponent(x,y,boardState,team)) return true
//           }

//           // (KNIGHT ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
//       } else if (type == Type.KNIGHT) {

//         // Top Line
//         if (y - prevY == 2){
//           // KNIGHT TOP LEFT
//           if (x - prevX == -1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//           // KNIGHT TOP RIGHT
//           if (x - prevX == 1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//         }

//         // Right Line
//         if (x - prevX == 2) {
//           // KNIGHT RIGHT TOP
//           if (y - prevY == 1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//           // KNIGHT LEFT TOP
//           if (y - prevY == -1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//         }

//         // Bottom Line
//         if (y - prevY == -2){
//           // KNIGHT BOTTOM LEFT
//           if (x - prevX == -1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//           // KNIGHT BOTTOM RIGHT
//           if (x - prevX == 1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//         }

//         // Left Line
//         if (x - prevX == -2) {
//           // KNIGHT LEFT TOP
//           if (y - prevY == 1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//           // KNIGHT LEFT BOTTOM
//           if (y - prevY == -1) {
//             if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
//               // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
//               return true
//             }
//           }
//         }

//         // (BISHOP ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
//       } else if (type == Type.BISHOP) {

//         for (let i = 1; i < 8; i++){

//           // Top Right Bishop
//           if (x > prevX && y > prevY) {
//             let passedPosition =  {x: prevX + i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Right
//           if (x > prevX && y < prevY){
//             let passedPosition =  {x: prevX + i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Left
//           if (x < prevX && y < prevY){

//             let passedPosition =  {x: prevX - i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Top Left
//           if (x < prevX && y > prevY){
//             let passedPosition =  {x: prevX - i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }
//         }

//         // (ROOK ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
//       } else if (type == Type.ROOK) {

//         // VERICAL MOVEMENT
//         if (prevX == x) {
//           // DOWN
//           if (y < prevY){
//             for (let i = 1; i < 8; i++) {

//                let passedPosition = {x: prevX, y: prevY - i}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }

//           } else if (y > prevY) {
//             // UP
//             for (let i = 1; i < 8; i++) {

//               let passedPosition = {x: prevX, y: prevY + i}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }

//         // HORIZONTAL MOVEMENT
//         if (prevY == y) {
//           // LEFT
//           if (x < prevX){

//             for (let i = 1; i < 8; i++) {

//                let passedPosition = {x: prevX - i, y: prevY}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }
//             // RIGHT
//           } else if (x > prevX) {

//             for (let i = 1; i < 8; i++) {

//               let passedPosition = {x: prevX + i, y: prevY}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                 if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }


//         // (QUEEN ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
//       } else if (type == Type.QUEEN) {

//         // VERICAL MOVEMENT -----------------------------
//         if (prevX == x) {
//           // DOWN
//           if (y < prevY){
//             for (let i = 1; i < 8; i++) {

//                let passedPosition = {x: prevX, y: prevY - i}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }

//           } else if (y > prevY) {
//             // UP
//             for (let i = 1; i < 8; i++) {

//               let passedPosition = {x: prevX, y: prevY + i}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }

//         // HORIZONTAL MOVEMENT
//         if (prevY == y) {
//           // LEFT
//           if (x < prevX){

//             for (let i = 1; i < 8; i++) {

//                let passedPosition = {x: prevX - i, y: prevY}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }
//             // RIGHT
//           } else if (x > prevX) {

//             for (let i = 1; i < 8; i++) {

//               let passedPosition = {x: prevX + i, y: prevY}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                 if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }

//         // DIAGONAL --------------------------------
//         for (let i = 1; i < 8; i++){

//           // Top Right Bishop
//           if (x > prevX && y > prevY) {
//             let passedPosition =  {x: prevX + i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Right
//           if (x > prevX && y < prevY){
//             let passedPosition =  {x: prevX + i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Left
//           if (x < prevX && y < prevY){

//             let passedPosition =  {x: prevX - i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Top Left
//           if (x < prevX && y > prevY){
//             let passedPosition =  {x: prevX - i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }
//         }


//         // (KING ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
//       } else if (type == Type.KING) {

//         // VERICAL MOVEMENT -----------------------------
//         if (prevX == x) {
//           // DOWN
//           if (y < prevY){
//             for (let i = 1; i < 2; i++) {

//                let passedPosition = {x: prevX, y: prevY - i}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }

//           } else if (y > prevY) {
//             // UP
//             for (let i = 1; i < 2; i++) {

//               let passedPosition = {x: prevX, y: prevY + i}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }
//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }

//         // HORIZONTAL MOVEMENT
//         if (prevY == y) {
//           // LEFT
//           if (x < prevX){

//             for (let i = 1; i < 2; i++) {

//                let passedPosition = {x: prevX - i, y: prevY}

//                if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                   if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//             }
//             // RIGHT
//           } else if (x > prevX) {

//             for (let i = 1; i < 2; i++) {

//               let passedPosition = {x: prevX + i, y: prevY}

//               if (passedPosition.x == x && passedPosition.y == y){

//                 if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                   return true
//                 }

//               } else {
//                 if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
//                }
//            }
//           }
//         }

//         // DIAGONAL --------------------------------
//         for (let i = 1; i < 2; i++){

//           // Top Right Bishop
//           if (x > prevX && y > prevY) {
//             let passedPosition =  {x: prevX + i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Right
//           if (x > prevX && y < prevY){
//             let passedPosition =  {x: prevX + i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Bottom Left
//           if (x < prevX && y < prevY){

//             let passedPosition =  {x: prevX - i, y: prevY - i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }

//           // Top Left
//           if (x < prevX && y > prevY){
//             let passedPosition =  {x: prevX - i, y: prevY + i}

//             if (passedPosition.x == x && passedPosition.y == y){

//               if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
//                 return true
//               }

//             } else {
//               if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
//                 break
//               }
//             }
//           }
//         }


//       }

//     return false
//   }
// }


// -------------------------------------------------------------------------- (King moving to dangerous square not working)
import { Type } from "../ChessBoard";
import { Team } from "../ChessBoard";

export default class MatchRef {

  squareHasPiece(x, y, boardState) {
    const piece = boardState.find((i) => i.x == x && i.y == y)

    if (piece) {
      console.log("----This square already has a piece");
      return true
    } else {
      return false
    }
  }

  squareHasOpponent(x,y,boardState, team) {
    const piece = boardState.find((i) => i.x == x && i.y == y && i.team != team)

    if (piece) {
      return true

    } else {
      return false
    }
  }

  theEnPassant(prevX, prevY, x, y, type, team, boardState) {
    const direction = team == Team.WHITE ? 1 : -1

    if (type == Type.PAWN) {

      if ((x - prevX == -1 || x - prevX == 1) && y - prevY == direction) {
        const piece = boardState.find((i) => i.x == x && i.y == y - direction && i.enPassant)

        if (piece) return true

      }
    }
    return false
  }


  canAttackPawn(prevX, prevY, x, y, team, boardState) {

  const direction = team == Team.WHITE ? 1 : -1;

  if (x - prevX == -1 && y - prevY == direction) {
        return true;
    }

    if (x - prevX == 1 && y - prevY == direction) {
        return true;
    }

  if ((x - prevX == -1 || x - prevX == 1) && y - prevY == direction) {
    if (this.squareHasOpponent(x, y, boardState, team)) return true
  }

  return false;
}

 validMovePawn(prevX, prevY, x, y, team, boardState) {
  const row = team == Team.WHITE ? 1 : 6;
  const direction = team == Team.WHITE ? 1 : -1;

  if (prevX == x && prevY == row && y - prevY == 2 * direction) {
    if (!this.squareHasPiece(x, y, boardState) && !this.squareHasPiece(x, y - direction, boardState)) return true
  }

  if (prevX == x && y - prevY == direction) {
    if (!this.squareHasPiece(x, y, boardState)) return true
  }

  if ((x - prevX == -1 || x - prevX == 1) && y - prevY == direction) {
    if (this.squareHasOpponent(x, y, boardState, team)) return true
  }

  return false;
}

canAttackKnight(prevX, prevY, x, y, team, boardState) {
  // Top Line
  if (y - prevY == 2 && Math.abs(x - prevX) == 1) {
      return true;
  }

  // Right Line
  if (x - prevX == 2 && Math.abs(y - prevY) == 1) {
      return true;
  }

  // Bottom Line
  if (y - prevY == -2 && Math.abs(x - prevX) == 1) {
      return true;
  }

  // Left Line
  if (x - prevX == -2 && Math.abs(y - prevY) == 1) {
      return true;
  }

  return false;
}

validMoveKnight(prevX, prevY, x, y, team, boardState) {
  // Top Line
  if (y - prevY == 2 && Math.abs(x - prevX) == 1) {
      if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)) {
          return true;
      }
  }

  // Right Line
  if (x - prevX == 2 && Math.abs(y - prevY) == 1) {
      if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)) {
          return true;
      }
  }

  // Bottom Line
  if (y - prevY == -2 && Math.abs(x - prevX) == 1) {
      if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)) {
          return true;
      }
  }

  // Left Line
  if (x - prevX == -2 && Math.abs(y - prevY) == 1) {
      if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)) {
          return true;
      }
  }

  return false;
}

canAttackBishop(prevX, prevY, x, y, team, boardState) {
   // Four directions to check: top-right, top-left, bottom-right, bottom-left
   let directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
   let moveIsPossible = false;

   for (let direction of directions) {
       for (let i = 1; i < 8; i++) {
           let checkX = prevX + i * direction[0];
           let checkY = prevY + i * direction[1];

           if (checkX == x && checkY == y) {
               if(this.squareHasPiece(checkX, checkY, boardState)) {
                   moveIsPossible = this.squareHasOpponent(checkX, checkY, boardState, team) ? true : false;
               } else {
                   moveIsPossible = true;
               }
               break;
           }

           if (this.squareHasPiece(checkX, checkY, boardState)) {
               moveIsPossible = false;
               break;
           }
       }
       if (moveIsPossible) {
           break;
       }
   }

   return moveIsPossible;
}

validMoveBishop(prevX, prevY, x, y, team, boardState) {
  return this.canAttackBishop(prevX, prevY, x, y, team, boardState);
}


canAttackRook(prevX, prevY, x, y, team, boardState) {
  let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  let moveIsPossible = false;

  for (let direction of directions) {
      for (let i = 1; i < 8; i++) {
          let checkX = prevX + i * direction[0];
          let checkY = prevY + i * direction[1];

          if (checkX == x && checkY == y) {
              if(this.squareHasPiece(checkX, checkY, boardState)) {
                  moveIsPossible = this.squareHasOpponent(checkX, checkY, boardState, team) ? true : false;
              } else {
                  moveIsPossible = true;
              }
              break;
          }

          if (this.squareHasPiece(checkX, checkY, boardState)) {
              moveIsPossible = false;
              break;
          }
      }
      if (moveIsPossible) {
          break;
      }
  }

  return moveIsPossible;
}

validMoveRook(prevX, prevY, x, y, team, boardState) {
return this.canAttackRook(prevX, prevY, x, y, team, boardState);
}


canAttackQueen(prevX, prevY, x, y, team, boardState) {
  let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  let moveIsPossible = false;

  for (let direction of directions) {
    for (let i = 1; i < 8; i++) {
      let checkX = prevX + i * direction[0];
      let checkY = prevY + i * direction[1];

      if (checkX == x && checkY == y) {
        if(this.squareHasPiece(checkX, checkY, boardState)) {
          moveIsPossible = this.squareHasOpponent(checkX, checkY, boardState, team) ? true : false;
        } else {
          moveIsPossible = true;
        }
        break;
      }

      if (this.squareHasPiece(checkX, checkY, boardState)) {
        moveIsPossible = false;
        break;
      }
    }
    if (moveIsPossible) {
      break;
    }
  }

  return moveIsPossible;
}

validMoveQueen(prevX, prevY, x, y, team, boardState) {
  return this.canAttackQueen(prevX, prevY, x, y, team, boardState);
}


canAttackKing(prevX, prevY, x, y, team, boardState, fromIsSquareUnderAttack = false) {
  let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  let moveIsPossible = false;

  for (let direction of directions) {
    for (let i = 1; i < 2; i++) {
      let checkX = prevX + i * direction[0];
      let checkY = prevY + i * direction[1];

      if (checkX == x && checkY == y) {
        if(fromIsSquareUnderAttack) {
          moveIsPossible = this.squareHasOpponent(checkX, checkY, boardState, team);
          break;
        } else {
          if(this.isSquareUnderAttack(x, y, team, boardState)) {
            moveIsPossible = false;
            break;
          }
          else if(this.squareHasPiece(checkX, checkY, boardState) && !this.squareHasOpponent(checkX, checkY, boardState, team)) {
            moveIsPossible = false;
            break;
          } else {
            moveIsPossible = true;
            break;
          }
        }
      }

      if (this.squareHasPiece(checkX, checkY, boardState)) {
        moveIsPossible = false;
        break;
      }
    }
    if (moveIsPossible) {
      break;
    }
  }

  return moveIsPossible;


}

validMoveKing(prevX, prevY, x, y, team, boardState) {

  console.log(boardState);

  if (x < 0 || y < 0 || x > 7 || y > 7) {
    return false;
  }

  if (this.squareHasPiece(x, y, boardState) && !this.squareHasOpponent(x, y, boardState, team)) {
    return false;
  }

  if (Math.abs(prevX - x) > 1 || Math.abs(prevY - y) > 1) {
    return false;
  }

  if (this.isSquareUnderAttack(x, y, team, boardState)) {
    return false;
  }

  return true;

}



canAttack(prevX, prevY, x, y, type, team, boardState) {
  if (type == Type.PAWN) {
      return this.canAttackPawn(prevX, prevY, x, y, team, boardState);
  }

  if (type == Type.KNIGHT) {
      return this.canAttackKnight(prevX, prevY, x, y, team, boardState);
  }

  if (type == Type.BISHOP) {
    return this.canAttackBishop(prevX, prevY, x, y, team, boardState);
  }

  if (type == Type.ROOK) {
    return this.canAttackRook(prevX, prevY, x, y, team, boardState);
  }

  if (type == Type.QUEEN) {
    return this.canAttackQueen(prevX, prevY, x, y, team, boardState);
  }

  if (type == Type.KING) {
    return this.canAttackKing(prevX, prevY, x, y, team, boardState);
  }


  return false;
}

isSquareUnderAttack(x, y, team, boardState) {

  const enemyTeam = team == Team.WHITE ? Team.BLACK : Team.WHITE;

  for (const piece of boardState) {
    if (piece.team == enemyTeam && piece.type != Type.KING && this.canAttack(piece.x, piece.y, x, y, piece.type, piece.team, boardState)) {
      return true;
    }
  }

  return false;
}

  // ------------------------------------------------------------------------------------------------------

  isKingUnderAttack(boardState, team) {
    console.log(boardState);
    let kingPosition = boardState.find((i) => i.team == team && i.type == Type.KING);

    if (!kingPosition) {
      return false;
    }

    return this.isSquareUnderAttack(kingPosition.x, kingPosition.y, team, boardState);
  }

  isCheckmate(boardState, team) {
    console.log(boardState);
    if (!this.isKingUnderAttack(boardState, team)) {
      return false;
    }

    for (let piece of boardState) {
      if (piece.team == team) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            let newX = piece.x + dx;
            let newY = piece.y + dy;
            if (this.validMove(piece.x, piece.y, newX, newY, piece.type, team, boardState)) {
              console.log("CHECK!!!!!!!");
              return false;
            }
          }
        }
      }
    }

    console.log("CHECKMATE!!!!!!!!!!!!!!!!!!!!");
    return true;
  }




  // ------------------------------------------------------------------------------------------------------






validMove(prevX, prevY, x, y, type, team, boardState) {

    // Valid Moves for PAWN   (PAWN ⬇️⬇️⬇️⬇️⬇️⬇️)
      if (type === Type.PAWN) {

      return this.validMovePawn(prevX, prevY, x, y, team, boardState);

      } else if (type == Type.KNIGHT) {

        return this.validMoveKnight(prevX, prevY, x, y, team, boardState);

      } else if (type == Type.BISHOP) {

          return this.validMoveBishop(prevX, prevY, x, y, team, boardState);

      } else if (type == Type.ROOK) {

        return this.validMoveRook(prevX, prevY, x, y, team, boardState);

      } else if (type == Type.QUEEN) {

        return this.validMoveQueen(prevX, prevY, x, y, team, boardState);

      } else if (type == Type.KING) {

        return this.validMoveKing(prevX, prevY, x, y, team, boardState); // not moving into danger, so it is a valid move

      }


    return false
  }
}
// -------------------------------------------------------------------------- (King moving to dangerous square not working)
