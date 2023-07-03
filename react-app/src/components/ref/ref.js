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

    // Valid Moves for Pawn   (PAWN ⬇️⬇️⬇️⬇️⬇️⬇️)
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

          // (KNIGHT ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
      } else if (type == Type.KNIGHT) {

        // Top Line
        if (y - prevY == 2){
          // KNIGHT TOP LEFT
          if (x - prevX == -1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
          // KNIGHT TOP RIGHT
          if (x - prevX == 1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
        }

        // Right Line
        if (x - prevX == 2) {
          // KNIGHT RIGHT TOP
          if (y - prevY == 1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
          // KNIGHT LEFT TOP
          if (y - prevY == -1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
        }

        // Bottom Line
        if (y - prevY == -2){
          // KNIGHT BOTTOM LEFT
          if (x - prevX == -1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
          // KNIGHT BOTTOM RIGHT
          if (x - prevX == 1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
        }

        // Left Line
        if (x - prevX == -2) {
          // KNIGHT LEFT TOP
          if (y - prevY == 1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
          // KNIGHT LEFT BOTTOM
          if (y - prevY == -1) {
            if (!this.squareHasPiece(x, y, boardState) || this.squareHasOpponent(x, y, boardState, team)){
              // ⬆️ same as this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
              return true
            }
          }
        }

        // (BISHOP ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
      } else if (type == Type.BISHOP) {

        for (let i = 1; i < 8; i++){

          // Top Right Bishop
          if (x > prevX && y > prevY) {
            let passedPosition =  {x: prevX + i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Right
          if (x > prevX && y < prevY){
            let passedPosition =  {x: prevX + i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Left
          if (x < prevX && y < prevY){

            let passedPosition =  {x: prevX - i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Top Left
          if (x < prevX && y > prevY){
            let passedPosition =  {x: prevX - i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }
        }

        // (ROOK ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
      } else if (type == Type.ROOK) {

        // VERICAL MOVEMENT
        if (prevX == x) {
          // DOWN
          if (y < prevY){
            for (let i = 1; i < 8; i++) {

               let passedPosition = {x: prevX, y: prevY - i}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }

          } else if (y > prevY) {
            // UP
            for (let i = 1; i < 8; i++) {

              let passedPosition = {x: prevX, y: prevY + i}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }

        // HORIZONTAL MOVEMENT
        if (prevY == y) {
          // LEFT
          if (x < prevX){

            for (let i = 1; i < 8; i++) {

               let passedPosition = {x: prevX - i, y: prevY}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }
            // RIGHT
          } else if (x > prevX) {

            for (let i = 1; i < 8; i++) {

              let passedPosition = {x: prevX + i, y: prevY}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }


        // (QUEEN ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
      } else if (type == Type.QUEEN) {

        // VERICAL MOVEMENT -----------------------------
        if (prevX == x) {
          // DOWN
          if (y < prevY){
            for (let i = 1; i < 8; i++) {

               let passedPosition = {x: prevX, y: prevY - i}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }

          } else if (y > prevY) {
            // UP
            for (let i = 1; i < 8; i++) {

              let passedPosition = {x: prevX, y: prevY + i}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }

        // HORIZONTAL MOVEMENT
        if (prevY == y) {
          // LEFT
          if (x < prevX){

            for (let i = 1; i < 8; i++) {

               let passedPosition = {x: prevX - i, y: prevY}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }
            // RIGHT
          } else if (x > prevX) {

            for (let i = 1; i < 8; i++) {

              let passedPosition = {x: prevX + i, y: prevY}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }

        // DIAGONAL --------------------------------
        for (let i = 1; i < 8; i++){

          // Top Right Bishop
          if (x > prevX && y > prevY) {
            let passedPosition =  {x: prevX + i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Right
          if (x > prevX && y < prevY){
            let passedPosition =  {x: prevX + i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Left
          if (x < prevX && y < prevY){

            let passedPosition =  {x: prevX - i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Top Left
          if (x < prevX && y > prevY){
            let passedPosition =  {x: prevX - i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }
        }


        // (KING ⬇️⬇️⬇️⬇️⬇️⬇️) (x === desiredPosition, prevX === initialPosition)
      } else if (type == Type.KING) {

        // VERICAL MOVEMENT -----------------------------
        if (prevX == x) {
          // DOWN
          if (y < prevY){
            for (let i = 1; i < 2; i++) {

               let passedPosition = {x: prevX, y: prevY - i}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }

          } else if (y > prevY) {
            // UP
            for (let i = 1; i < 2; i++) {

              let passedPosition = {x: prevX, y: prevY + i}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }
              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }

        // HORIZONTAL MOVEMENT
        if (prevY == y) {
          // LEFT
          if (x < prevX){

            for (let i = 1; i < 2; i++) {

               let passedPosition = {x: prevX - i, y: prevY}

               if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                  if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
            }
            // RIGHT
          } else if (x > prevX) {

            for (let i = 1; i < 2; i++) {

              let passedPosition = {x: prevX + i, y: prevY}

              if (passedPosition.x == x && passedPosition.y == y){

                if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                  return true
                }

              } else {
                if (this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) break
               }
           }
          }
        }

        // DIAGONAL --------------------------------
        for (let i = 1; i < 2; i++){

          // Top Right Bishop
          if (x > prevX && y > prevY) {
            let passedPosition =  {x: prevX + i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Right
          if (x > prevX && y < prevY){
            let passedPosition =  {x: prevX + i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Bottom Left
          if (x < prevX && y < prevY){

            let passedPosition =  {x: prevX - i, y: prevY - i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }

          // Top Left
          if (x < prevX && y > prevY){
            let passedPosition =  {x: prevX - i, y: prevY + i}

            if (passedPosition.x == x && passedPosition.y == y){

              if (!this.squareHasPiece(passedPosition.x, passedPosition.y, boardState) || this.squareHasOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                return true
              }

            } else {
              if(this.squareHasPiece(passedPosition.x, passedPosition.y, boardState)) {
                break
              }
            }
          }
        }


      }




    return false
  }
}
