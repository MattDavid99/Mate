import { Type } from "../ChessBoard";
import { Team } from "../ChessBoard";

export default class MatchRef {


  squareHasPiece(x, y, boardState) {

    // for(let i = 0; i < boardState.length; i++) {
    //   if(boardState[i].x == x && boardState[i].y == y){
    //     console.log("This square already has a piece");
    //     return true;
    //   }
    // }
    // return false;
    const piece = boardState.find((i) => i.x == x && i.y == y)

    if (piece) {
      console.log("----This square already has a piece");
      return true
    } else {
      console.log("----This square already has a piece");
      return false
    }
  }


  validMove(prevX, prevY, x, y, type, team, boardState) {
    console.log(`Ref is checking the move for ${type}...`);
    console.log(`Previous location: (${prevX},${prevY})`);
    console.log(`Current location: (${x},${y})`);
    console.log(`Team: ${team}`);

    // Valid Moves for White Pawn
    if (type === Type.PAWN) {
      if (team === Team.WHITE) {
        if (prevY == 1) {
          if (prevX == x && y - prevY == 1){
            if(!this.squareHasPiece(x,y,boardState)) return true

          } else if (prevX == x && y - prevY == 2) {
            if(!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x,y-1,boardState)) return true
          }

        } else {
            if (prevX == x && y - prevY == 1) {
              if (!this.squareHasPiece(x,y,boardState)) return true

            }
        }

        // Valid Moves for Black Pawn
      } else {
          if (prevY == 6) {
            if (prevX == x && y - prevY == -1){
              if (!this.squareHasPiece(x,y,boardState)) return true

            } else if (prevX == x && y - prevY == -2) {
              if (!this.squareHasPiece(x,y,boardState) && !this.squareHasPiece(x,y+1,boardState)) return true
            }
          } else {
              if (prevX == x && y - prevY == -1){
                if (!this.squareHasPiece(x,y,boardState)) return true
              }
          }
      }
    }

    return false
  }
}
