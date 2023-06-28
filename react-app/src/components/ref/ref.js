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


  validMove(prevX, prevY, x, y, type, team, boardState) {
    console.log(`Ref is checking the move for ${type}...`);
    console.log(`Previous location: (${prevX},${prevY})`);
    console.log(`Current location: (${x},${y})`);
    console.log(`Team: ${team}`);

    // Valid Moves for Pawn
    if (type === Type.PAWN) {

        const row = team == Team.WHITE ? 1 : 6
        const direction = team == Team.WHITE ? 1 : -1

        if (prevX == x && prevY == row && y - prevY == 2 * direction) {
          if (!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x, y - direction, boardState)) return true

        } else if (prevX == x && y - prevY == direction) {
              if (!this.squareHasPiece(x,y,boardState)) return true
          }

          // Taking Piece: Pawn
          else if (x - prevX == -1 && y - prevY == direction) {
            if (this.squareHasOpponent(x,y,boardState,team)) return true
          }

          else if (x - prevX == 1 && y - prevY == direction) {
            if (this.squareHasOpponent(x,y,boardState,team)) return true
          }
    }


    return false
  }
}








      //  if (team === Team.WHITE) {
      //   if (prevY == 1) {
      //     if (prevX == x && y - prevY == 1){
      //       if(!this.squareHasPiece(x,y,boardState)) return true

      //     } else if (prevX == x && y - prevY == 2) {
      //       if(!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x,y-1,boardState)) return true
      //     }

      //   } else {
      //       if (prevX == x && y - prevY == 1) {
      //         if (!this.squareHasPiece(x,y,boardState)) return true

      //       }
      //   }

      //   // Valid Moves for Black Pawn
      // } else {
      //     if (prevY == 6) {
      //       if (prevX == x && y - prevY == -1){
      //         if (!this.squareHasPiece(x,y,boardState)) return true

      //       } else if (prevX == x && y - prevY == -2) {
      //         if (!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x,y+1,boardState)) return true
      //       }
      //     } else {
      //         if (prevX == x && y - prevY == -1){
      //           if (!this.squareHasPiece(x,y,boardState)) return true
      //         }
      //     }
      // }
