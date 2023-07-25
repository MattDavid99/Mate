import { socket } from "../socket";
// constants
const CREATE_MATCH = "match/CREATE_MATCH";
const MAKE_MOVES = "match/MAKE_MOVES";
const RESIGN_MATCH = "match/RESIGN_MATCH";
const GET_MATCH = "match/GET_MATCH";
const RESET_MATCH = "match/RESET_MATCH";
const LOAD_MATCH = "match/LOAD_MATCH";



export const loadMatch = (match) => {
  return {
    type: LOAD_MATCH,
    payload: match
  }
};

export const startMatch = (match) => {
  return {
    type: CREATE_MATCH,
    payload: match,
  }
};

export const makeMoves = (match) => {
  return {
    type: MAKE_MOVES,
    payload: match
  }
}

const getMatch = (match) => {
  return {
    type: GET_MATCH,
    payload: match
  }
}

const resignMatch = (match) => {
  return {
    type: RESIGN_MATCH,
    payload: match
  }
}


const resetMatch = (match) => {
  return {
    type: RESET_MATCH,
    payload: match,
  }
};



export const loadExistingMatch = (match_id) => (dispatch) => {
  socket.emit('load_match', {match_id});

  socket.on('load_match', (data) => {
    dispatch(loadMatch(data.match[0]));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
}

// @match_routes.route('/', methods=['POST'])
export const createMatch = (white_player_id, black_player_id) => (dispatch) => {
  socket.emit('new_match', {white_player_id, black_player_id})

  socket.on('new_match', (data) => {
    dispatch(startMatch(data));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
}


// @match_routes.route('/<int:match_id>/move', methods=['POST'])
// export const postMove = (match_id, uci_move) => () => {
//   socket.emit('move', {room: match_id, move: uci_move})
// }

export const postMove = (match_id, uci_move) => (dispatch) => {
  socket.emit('chess_move', {room: match_id, move: uci_move});

  socket.on('chess_move', (data) => {
    dispatch(makeMoves(data.match[0]));
  });

  socket.on('error', (data) => {
    console.error(data.error);
  });
};

// @match_routes.route('/<int:match_id>/resign', methods=['POST'])
export const postResign = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/resign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(resignMatch(data.match))
  }
}


// @match_routes.route('/<int:match_id>', methods=['GET'])
export const fetchMatch = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json();
    if (data.match && data.match.length > 0) {
      dispatch(getMatch(data.match[0]));
    } else {
      // handle the case where data.match is undefined or an empty array
      return "data.match[0] is NOT HERE, match.js redux"
    }
  } else {
    const data = await response.json();

    if (data.errors) {
      return data.errors;
    }
  }
}

// @match_routes.route('/<int:match_id>/reset', methods=['POST'])
export const postReset = (match_id) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(resetMatch(data.match))
  }
}


const initialState = { match: null };

export default function matchReducer(state = initialState, action) {
	switch (action.type) {

    case CREATE_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case MAKE_MOVES:
      return {
        ...state,
        match: action.payload
      }

    case RESIGN_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case GET_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case RESET_MATCH:
      return {
        ...state,
        match: action.payload
      }

    case LOAD_MATCH:
      return {
        ...state,
        match: action.payload
      }


		default:
			return state;
	}
}




/*

match_routes.py -------------------------------------------------------

@socketio.on('new_match')
def new_match(data):
    print("Received new_match event", data)
    waiting_players.append(data['player_id'])

    if len(waiting_players) >= 2:
        white_player_id = waiting_players.pop(0)  # White player is the first who clicked "Start Match"
        black_player_id = waiting_players.pop(0)  # Black player is the second one

        if not white_player_id or not black_player_id:
            return jsonify({"error": "White and Black player id's must be provided"}), 400

        board = chess.Board()

        match = Match(
            white_player_id=white_player_id,
            black_player_id=black_player_id,
            status="In Progress",
            board_state=board.fen()
        )

        try:
            db.session.add(match)
            db.session.commit()

            emit('new_match', {"match": [match.to_dict()]}, broadcast=True)

        except Exception as e:
            print(e)
            return jsonify({"error": "Database error at new_match: " + str(e)}), 500

        return {"match": [match.to_dict()]}, 201


@socketio.on('move')
def move(data):
    """
    Make a move in a chess match
    """

    # match_id = data['match_id']
    print("============================>",data)
    match_id = data['room']
    uci_move = data['move']
    print("============================>",data)

    print("DEBUG: Got move:", uci_move)

    # if move is illegal
    if not uci_move:
        emit('error=================> line 73', {"error": "Illegal move", "move": uci_move, "match": [match.to_dict()]}, broadcast=True)
        return

    match = Match.query.get(match_id)
    print("DEBUG: Got match:", match)
    if not match:
        return jsonify({"error": "<--------- NO match found match_routes"}), 404

    board = chess.Board(match.board_state)
    print("DEBUG: Created board:", board)

    try:
        move = chess.Move.from_uci(uci_move)
        emit('move', {"match": [match.to_dict()], "move": uci_move}, broadcast=True)
        print("DEBUG: Created move:", move)
    except:
        return jsonify({"error": "<--------- invalid move format in match_routes def move(match_id)"}), 404

    if move not in board.legal_moves:
        emit('error', {"error": "Illegal move", "move": uci_move, "match": [match.to_dict()]}, broadcast=True)
        return

    if board.is_check() and board.gives_check(move):
        emit('error', {"error": "Illegal move - you are in check", "move": uci_move, "match": [match.to_dict()]})
        return

    board.push(move)
    match.board_state = board.fen() # <<-- board.fen() handles the current state of the chess game
    print("DEBUG: Updated board state:", match.board_state)


    print("---------------------->Current board\n",board)


    history = History(
        match_id=match_id,
        move=uci_move,
        turn="white" if board.turn else "black",
        total_moves=board.fullmove_number,
        status=match.status
    )

    db.session.add(history)
    db.session.commit()


    if board.is_checkmate():

        winner = "black" if board.turn else "white"
        match.status = "Checkmate"
        print("???----------->>>,  Checkmate works")
        match.result = winner + " wins"
        db.session.commit()

    elif board.is_stalemate() or board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition() or board.is_variant_draw():

        match.status = "Draw"
        match.result = "Draw"
        db.session.commit()

    # emit('move_made', {"match": [match.to_dict()]})
    emit('move', {"match": [match.to_dict()], "move": uci_move}, broadcast=True)  # Include move in the emitted data
    return {"match": [match.to_dict()], "move": uci_move}, 200




    match.js -------------------------------------------------

    export const makeMoves = (match) => {
  return {
    type: MAKE_MOVES,
    payload: match
  }
}

export const postMove = (match_id, uci_move) => async (dispatch) => {
  const response = await fetch(`/api/match/${match_id}/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      move: uci_move
    })
  })

  if (response.ok) {
    const data = await response.json()
    // dispatch(makeMoves(data.match[0]))
    dispatch(makeMoves(data.match))

  } else if (!response.ok) {
    const data = await response.json()
    if (data.errors) {
      console.log(data.errors);
      return data.errors
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}


// @match_routes.route('/<int:match_id>/move', methods=['POST'])
export const postMove = (match_id, uci_move) => () => {
  socket.emit('move', {match_id, move: uci_move})
}

case MAKE_MOVES:
      return {
        ...state,
        match: action.payload
      }



   ChessBoard.js ----------------------------------------------

   import React, { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { postMove, postReset, createMatch, startMatch, makeMoves, loadExistingMatch, loadMatch, fetchMatch } from '../../store/match'
import { postChatMessage, fetchChats, listenForNewMessage, receiveChatMessage, sendMessage } from '../../store/chat'
import { fetchUserById } from '../../store/session'
import './ChessBoard.css'
import Pieces from '../Pieces'
import MatchRef from '../ref/ref'
import CheckMateModal from '../CheckMateModal/CheckMateModal';
import DrawModal from '../DrawModal/DrawModal';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../../socket';
import Chat from '../Chat';

// X and Y axis for chess board = [a8, b8, c8, d8, etc.]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']


export const Type = {
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  ROOK: 'ROOK',
  KNIGHT: 'KNIGHT',
  QUEEN: 'QUEEN',
  KING: 'KING'
}

export const Team = {
  BLACK: "BLACK",
  WHITE: "WHITE"
}

const enPassantProperty = null



const createInitialBoardState = () => {
const initialBoardState = []


   for (let p = 0; p < 2; p++){
     const teamType = (p === 0) ? Team.BLACK : Team.WHITE
     const type = (teamType === Team.BLACK) ? "black" : "white"
     const y = (teamType === Team.BLACK) ? 7 : 0
     // rooks                                                           x: 7, y
     initialBoardState.push({image: `../assets/images/${type}rook.png`, x:0, y, type: Type.ROOK, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}rook.png`, x:7, y, type: Type.ROOK, team: teamType, id: uuidv4()})
     // knights
     initialBoardState.push({image: `../assets/images/${type}knight.png`, x:1, y, type: Type.KNIGHT, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}knight.png`, x:6, y, type: Type.KNIGHT, team: teamType, id: uuidv4()})
     // bishops
     initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:2, y, type: Type.BISHOP, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:5, y, type: Type.BISHOP, team: teamType, id: uuidv4()})
     // king and queen
     initialBoardState.push({image: `../assets/images/${type}queen.png`, x:3, y, type: Type.QUEEN, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}king.png`, x:4, y, type: Type.KING, team: teamType, id: uuidv4()})
   }

   for (let i = 0; i < 8; i++) {
     initialBoardState.push({image: "../assets/images/whitepawn.png", x:i, y:1, type: Type.PAWN, team: Team.WHITE, enPassant: enPassantProperty, id: uuidv4()})
   }

   for (let i = 0; i < 8; i++) {
     initialBoardState.push({image: "../assets/images/blackpawn.png", x:i, y:6, type: Type.PAWN, team: Team.BLACK, enPassant: enPassantProperty, id: uuidv4()})
    }

    return initialBoardState
  }


  function findPiece(x, y, pieces) {
    return pieces.find(piece => piece.x === x && piece.y === y);
  }


function ChessBoard() {

  const [activePiece, setActivePiece] = useState(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState(createInitialBoardState)
  const [currentTurn, setCurrentTurn] = useState(Team.WHITE);
  const [promotionPawn, setPromotionPawn] = useState()
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [prevX, setPrevX] = useState(null);
  const [prevY, setPrevY] = useState(null);
  const modalRef = useRef(null)
  const chessboardRef = useRef(null)
  const Ref = new MatchRef()

  const { matchId } = useParams();
  const matchSelector = useSelector((state) => state.match.match)
  const user = useSelector((state) => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch()
  console.log(matchSelector);
  console.log(user);

  const [userId, setUserId] = useState(user ? user.id : null);



 // const onPieceClick = (piece) => {
 //   if (currentTurn === Team.WHITE && userId === matchSelector.whitePlayerId) {
 //     // Allow move
 //   } else if (currentTurn === Team.BLACK && userId === matchSelector.blackPlayerId) {
 //     // Allow move
 //   } else {
 //     // Not this user's turn
 //   }
 // }

 useEffect(() => {
  if (!user) {
    history.push("/login");
  }
}, [user, history]);


  useEffect(() => {
    if (user) setUserId(user.id);
  }, [user]);


  useEffect(() => {

    dispatch(fetchMatch(matchId));

  }, []);


  useEffect(() => {
    socket.on('move', (data) => {
      let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      let fromX = alphabet.indexOf(data.move[0]);
      let fromY = parseInt(data.move[1]) - 1;
      let toX = alphabet.indexOf(data.move[2]);
      let toY = parseInt(data.move[3]) - 1;

      let movedPiece = pieces.find((p) => p.x === fromX && p.y === fromY);
      if (movedPiece) {
        setPrevX(movedPiece.x);
        setPrevY(movedPiece.y);

        movedPiece.x = toX;
        movedPiece.y = toY;

        setPieces([...pieces]);

        let match_id = data.match[0].id;
        dispatch(makeMoves(match_id));
        setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
      }
    });

    socket.on('error', (data) => {
      // Handle unsuccessful move...
      let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      let toX = alphabet.indexOf(data.move[2]);
      let toY = parseInt(data.move[3]) - 1;

      let movedPiece = pieces.find((p) => p.x === toX && p.y === toY);
      if (movedPiece) {
        movedPiece.x = prevX;
        movedPiece.y = prevY;

        setPieces([...pieces]);
      }
      console.error('Illegal move', data);
    });

    return () => {
      socket.off('move');
      socket.off('error');
    }
  }, [pieces, currentTurn]);




  useEffect(() => {
    if (matchSelector) {
      console.log("White player ID: ", matchSelector.whitePlayerId);
      console.log("Black player ID: ", matchSelector.blackPlayerId);
    }
  }, [matchSelector]);


  useEffect(() => {

    if (matchSelector) {
      if (matchSelector.status === "Checkmate"){
        setIsCheckmate(true)
      } else if (matchSelector.status === "Draw") {
        setIsDraw(true)
      }
    }


  }, [matchSelector]);



  const handleResetMatch = async () => {
    dispatch(postReset(matchId));
    setPieces(createInitialBoardState());
  };

// ------------------------------------------------------------------------------ (CHAT)


// ------------------------------------------------------------------------------ (CHAT)





  function grabPiece(e) {
    const element = e.target
    const chessboard = chessboardRef.current

    if (element.classList.contains("chess-piece") && chessboard){

      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)))

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute"
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)

    }
  }

  function movePiece(e) {
    const chessboard = chessboardRef.current


    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // X
      if (x < minX) {
        activePiece.style.left = `${minX}px`;

      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;

      } else {
        activePiece.style.left = `${x}px`
      }

      // Y
      if (y < minY) {
        activePiece.style.top = `${minY}px`;

      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;

      } else {
        activePiece.style.top = `${y}px`
      }

    }
  }

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


  async function dropPiece(e) {
    const chessboard = chessboardRef.current

    if(activePiece && chessboard){

      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))

      const pieceAtNewSquare = findPiece(x, y, pieces); // <<-- you commented out a bunch of code below that used this, if app breaks this is the reason

      const currentPiece = pieces.find((p) => p.x == gridX && p.y == gridY)
      console.log(currentPiece);
      const attackedPiece = pieces.find((p) => p.x == x && p.y == y)

      const aValidMove = currentPiece && Ref.validMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

      if (!aValidMove) {

        activePiece.style.position = 'relative';
        activePiece.style.removeProperty('top');
        activePiece.style.removeProperty('left');
        setActivePiece(null);
        return;
      }


      if (currentPiece && currentPiece.team != currentTurn) {
        activePiece.style.position = 'relative'
        activePiece.style.removeProperty('top')
        activePiece.style.removeProperty('left')
        setActivePiece(null)
        return;
      }

      if (currentPiece){

        const IsValidMove = Ref.validMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const isEnpassant = Ref.theEnPassant(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const direction = currentPiece.team == Team.WHITE ? 1 : -1

        if (currentPiece.team !== currentTurn) {
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
          setActivePiece(null)
          return;
        }


        if (isEnpassant) {

          const updatedPieces = pieces.reduce((arr, piece) => {

            if (piece.x == gridX && piece.y == gridY){
              piece.enPassant = false
              piece.x = x
              piece.y = y
              arr.push(piece)
              let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
              console.log(matchId,uciMove);
              socket.emit('move', { room: matchId, move: uciMove });
              // dispatch(postMove(matchId, uciMove));


            } else if (!(piece.x == x && piece.y == y - direction)) {
              if (piece.type == Type.PAWN) {
                piece.enPassant = false

              }

              arr.push(piece)

            }

            return arr
          }, [])

          setPieces(updatedPieces)
          console.log("------> updatedPieces", updatedPieces);
          setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);

        } else if (IsValidMove) {

          let promotionRow = (currentPiece.team == Team.WHITE) ? 7 : 0;
          if (y == promotionRow && currentPiece.type == Type.PAWN) {
            modalRef.current.classList.remove("hide-modal")
            setPromotionPawn({
              piece: currentPiece,
              from: [gridX, gridY],
              to: [x, y],
            })
            console.log(promotionPawn, "<------Promotion Pawn");

          } else {
            let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
            // await dispatch(postMove(matchId, uciMove));
            socket.emit('move', { room: matchId, move: uciMove });
            try {
              socket.emit('move', { room: matchId, move: uciMove });
              // await dispatch(postMove(matchId, uciMove));
              setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
              const updatedPieces = pieces.reduce((arr, piece) => {
                if (piece.x == gridX && piece.y == gridY){

                  if(Math.abs(gridY - y) == 2 && piece.type == Type.PAWN){
                    piece.enPassant = true
                  } else {
                    piece.enPassant = false
                  }

                  piece.x = x
                  piece.y = y

                  let promotionRow = (piece.team == Team.WHITE) ? 7 : 0;

                  if (y == promotionRow && piece.type == Type.PAWN) {
                    modalRef.current.classList.remove("hide-modal")
                    setPromotionPawn(piece)
                    console.log(promotionPawn, "<------Promotion Pawn");
                  }

                  arr.push(piece)

                } else if (!(piece.x == x && piece.y == y)){
                  if (piece.type == Type.PAWN) {
                    piece.enPassant = false
                  }
                  arr.push(piece)
                }


                return arr
              }, [])

              setPieces(updatedPieces)
              console.log("------> updatedPieces", updatedPieces)
              setCurrentTurn(currentTurn == Team.WHITE ? Team.BLACK : Team.WHITE);
            } catch (err) {
              console.error(err);
              activePiece.style.position = 'relative'
              activePiece.style.removeProperty('top')
              activePiece.style.removeProperty('left')
            } finally {
              setActivePiece(null);
            }
          }


       } else {
        activePiece.style.position = 'relative'
        activePiece.style.removeProperty('top')
        activePiece.style.removeProperty('left')
       }
       setActivePiece(null)
      }

      setActivePiece(null)


    }
  }


  // This must be above promotePawn() ⬇
  function promotionWhiteOrBlack() {
    return (promotionPawn?.team == Team.WHITE) ? "white" : "black";
  }


  const uciPromotionCodes = {
    [Type.PAWN]: 'p',
    [Type.ROOK]: 'r',
    [Type.KNIGHT]: 'n',
    [Type.BISHOP]: 'b',
    [Type.QUEEN]: 'q',
    [Type.KING]: 'k',
  };


  async function promotePawn(promotionType) {

    if (!promotionPawn) return;

      const [fromX, fromY] = promotionPawn.from;
      const [toX, toY] = promotionPawn.to;

      const updatedPieces = pieces.reduce((arr, piece) => {
        if (piece.x == promotionPawn.piece.x && piece.y == promotionPawn.piece.y) {
          piece.type = promotionType;
          const teamType = promotionPawn.piece.team == Team.WHITE ? "white" : "black";
          piece.image = `../assets/images/${teamType}${promotionType.toLowerCase()}.png`;
          piece.x = toX;
          piece.y = toY;
        }
        arr.push(piece);
        return arr;
      }, []);


      setPieces(updatedPieces);

      modalRef.current.classList.add("hide-modal");

      const uciMove = `${alphabet[fromX]}${fromY+1}${alphabet[toX]}${toY+1}${uciPromotionCodes[promotionType]}`;
      // await dispatch(postMove(matchId, uciMove));
      setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
      socket.emit('move', { room: matchId, move: uciMove });

      setPromotionPawn(null);

      console.log(promotionPawn, "<------Promotion Pawn");
      console.log(promotionType, uciPromotionCodes[promotionType]);
  }





  let board = []

  for (let j = verticalAxis.length - 1; j >= 0; j--){
    for (let i = 0; i < horizontalAxis.length; i++) {

      const number = j + i + 2
      let image = undefined

      pieces.forEach(p => {
        if(p.x === i && p.y === j){
          image = p.image
        }
      })

      board.push(<Pieces key={`${j},${i}`} number={number} image={image}/>)

    }
  }



  return (
    <>
    <div className='app-container'>

    <Chat matchId={matchId}/>

      {isCheckmate && <CheckMateModal winner={matchSelector.result} onClose={() => setIsCheckmate(false)} />}
      {isDraw && <DrawModal onClose={() => setIsDraw(false)} />}

      <div className='promotion-modal hide-modal' ref={modalRef}>
        <div className='modal-body'>
          <img onClick={async () => await promotePawn(Type.ROOK)} src={`../assets/images/${promotionWhiteOrBlack()}rook.png`}
          className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.KNIGHT)} src={`../assets/images/${promotionWhiteOrBlack()}knight.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.QUEEN)} src={`../assets/images/${promotionWhiteOrBlack()}queen.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.BISHOP)} src={`../assets/images/${promotionWhiteOrBlack()}bishop.png`} className='promotion-image'/>
        </div>
      </div>


        <div className='chessboard-container'>
          <div className='chessboard'
               onMouseDown={e => grabPiece(e)}
               onMouseMove={e => movePiece(e)}
               onMouseUp={e => dropPiece(e)}
               ref={chessboardRef}
              >{board}
          </div>
          <button onClick={handleResetMatch}>Reset Match</button>
        </div>
       </div>
    </>
  )


}

export default ChessBoard


 ---------------------------------------------------------- ChessBoard 2
 import React, { useEffect, useRef, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { postMove, postReset, createMatch, startMatch, makeMoves, loadExistingMatch, loadMatch, fetchMatch } from '../../store/match'
import { postChatMessage, fetchChats, listenForNewMessage, receiveChatMessage, sendMessage } from '../../store/chat'
import { fetchUserById } from '../../store/session'
import './ChessBoard.css'
import Pieces from '../Pieces'
import MatchRef from '../ref/ref'
import CheckMateModal from '../CheckMateModal/CheckMateModal';
import DrawModal from '../DrawModal/DrawModal';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../../socket';
import Chat from '../Chat';

// X and Y axis for chess board = [a8, b8, c8, d8, etc.]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']


export const Type = {
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  ROOK: 'ROOK',
  KNIGHT: 'KNIGHT',
  QUEEN: 'QUEEN',
  KING: 'KING'
}

export const Team = {
  BLACK: "BLACK",
  WHITE: "WHITE"
}

const enPassantProperty = null



const createInitialBoardState = () => {
const initialBoardState = []


   for (let p = 0; p < 2; p++){
     const teamType = (p === 0) ? Team.BLACK : Team.WHITE
     const type = (teamType === Team.BLACK) ? "black" : "white"
     const y = (teamType === Team.BLACK) ? 7 : 0
     // rooks                                                           x: 7, y
     initialBoardState.push({image: `../assets/images/${type}rook.png`, x:0, y, type: Type.ROOK, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}rook.png`, x:7, y, type: Type.ROOK, team: teamType, id: uuidv4()})
     // knights
     initialBoardState.push({image: `../assets/images/${type}knight.png`, x:1, y, type: Type.KNIGHT, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}knight.png`, x:6, y, type: Type.KNIGHT, team: teamType, id: uuidv4()})
     // bishops
     initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:2, y, type: Type.BISHOP, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}bishop.png`, x:5, y, type: Type.BISHOP, team: teamType, id: uuidv4()})
     // king and queen
     initialBoardState.push({image: `../assets/images/${type}queen.png`, x:3, y, type: Type.QUEEN, team: teamType, id: uuidv4()})
     initialBoardState.push({image: `../assets/images/${type}king.png`, x:4, y, type: Type.KING, team: teamType, id: uuidv4()})
   }

   for (let i = 0; i < 8; i++) {
     initialBoardState.push({image: "../assets/images/whitepawn.png", x:i, y:1, type: Type.PAWN, team: Team.WHITE, enPassant: enPassantProperty, id: uuidv4()})
   }

   for (let i = 0; i < 8; i++) {
     initialBoardState.push({image: "../assets/images/blackpawn.png", x:i, y:6, type: Type.PAWN, team: Team.BLACK, enPassant: enPassantProperty, id: uuidv4()})
    }

    return initialBoardState
  }


  function findPiece(x, y, pieces) {
    return pieces.find(piece => piece.x === x && piece.y === y);
  }


function ChessBoard() {

  const [activePiece, setActivePiece] = useState(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState(createInitialBoardState)
  const [currentTurn, setCurrentTurn] = useState(Team.WHITE);
  const [promotionPawn, setPromotionPawn] = useState()
  const [isCheckmate, setIsCheckmate] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [prevX, setPrevX] = useState(null);
  const [prevY, setPrevY] = useState(null);
  const modalRef = useRef(null)
  const chessboardRef = useRef(null)
  const Ref = new MatchRef()

  const { matchId } = useParams();
  const matchSelector = useSelector((state) => state.match.match)
  const user = useSelector((state) => state.session.user)
  const history = useHistory()

  const dispatch = useDispatch()
  console.log(matchSelector);
  console.log(user);

  const [userId, setUserId] = useState(user ? user.id : null);



 // const onPieceClick = (piece) => {
 //   if (currentTurn === Team.WHITE && userId === matchSelector.whitePlayerId) {
 //     // Allow move
 //   } else if (currentTurn === Team.BLACK && userId === matchSelector.blackPlayerId) {
 //     // Allow move
 //   } else {
 //     // Not this user's turn
 //   }
 // }

 useEffect(() => {
  if (!user) {
    history.push("/login");
  }
}, [user, history]);


  useEffect(() => {
    if (user) setUserId(user.id);
  }, [user]);


  useEffect(() => {

    dispatch(fetchMatch(matchId));

  }, []);



  useEffect(() => {
    socket.on('move', (data) => {
      let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      let fromX = alphabet.indexOf(data.move[0]);
      let fromY = parseInt(data.move[1]) - 1;
      let toX = alphabet.indexOf(data.move[2]);
      let toY = parseInt(data.move[3]) - 1;

      let movedPiece = pieces.find((p) => p.x === fromX && p.y === fromY);
      if (movedPiece) {
        setPrevX(movedPiece.x);
        setPrevY(movedPiece.y);

        movedPiece.x = toX;
        movedPiece.y = toY;

        setPieces([...pieces]);

        let match_id = data.match[0].id;
        dispatch(makeMoves(match_id));
        setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
      }
    });

    // socket.on('error', (data) => {
    //   // Handle unsuccessful move...
    //   let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    //   let toX = alphabet.indexOf(data.move[2]);
    //   let toY = parseInt(data.move[3]) - 1;

    //   let movedPiece = pieces.find((p) => p.x === toX && p.y === toY);
    //   if (movedPiece) {
    //     movedPiece.x = prevX;
    //     movedPiece.y = prevY;

    //     setPieces([...pieces]);
    //   }
    //   console.error('Illegal move', data);
    // });

    return () => {
      socket.off('move');
      // socket.off('error');
    }
  }, [pieces, currentTurn]);




  useEffect(() => {
    if (matchSelector) {
      console.log("White player ID: ", matchSelector.whitePlayerId);
      console.log("Black player ID: ", matchSelector.blackPlayerId);
    }
  }, [matchSelector]);


  useEffect(() => {

    if (matchSelector) {
      if (matchSelector.status === "Checkmate"){
        setIsCheckmate(true)
      } else if (matchSelector.status === "Draw") {
        setIsDraw(true)
      }
    }


  }, [matchSelector]);



  const handleResetMatch = async () => {
    dispatch(postReset(matchId));
    setPieces(createInitialBoardState());
  };


  function grabPiece(e) {
    const element = e.target
    const chessboard = chessboardRef.current

    if (element.classList.contains("chess-piece") && chessboard){

      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)))

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute"
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)

    }
  }

  function movePiece(e) {
    const chessboard = chessboardRef.current


    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // X
      if (x < minX) {
        activePiece.style.left = `${minX}px`;

      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;

      } else {
        activePiece.style.left = `${x}px`
      }

      // Y
      if (y < minY) {
        activePiece.style.top = `${minY}px`;

      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;

      } else {
        activePiece.style.top = `${y}px`
      }

    }
  }

  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


  async function dropPiece(e) {
    const chessboard = chessboardRef.current
    if(activePiece && chessboard){
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      const pieceAtNewSquare = findPiece(x, y, pieces); // <<-- you commented out a bunch of code below that used this, if app breaks this is the reason
      const currentPiece = pieces.find((p) => p.x == gridX && p.y == gridY)
      console.log(currentPiece);
      const attackedPiece = pieces.find((p) => p.x == x && p.y == y)
      if (currentPiece){
        const IsValidMove = Ref.validMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)
        const isEnpassant = Ref.theEnPassant(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)
        const direction = currentPiece.team == Team.WHITE ? 1 : -1
        if (currentPiece.team !== currentTurn) {
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
          setActivePiece(null)
          return;
        }
        if (isEnpassant) {
          const updatedPieces = pieces.reduce((arr, piece) => {
            if (piece.x == gridX && piece.y == gridY){
              piece.enPassant = false
              piece.x = x
              piece.y = y
              arr.push(piece)
              let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
              console.log(matchId,uciMove);
              dispatch(postMove(matchId, uciMove));
              socket.emit('move', { room: matchId, move: uciMove });
            } else if (!(piece.x == x && piece.y == y - direction)) {
              if (piece.type == Type.PAWN) {
                piece.enPassant = false
              }
              arr.push(piece)
            }
            return arr
          }, [])
          setPieces(updatedPieces)
          console.log("------> updatedPieces", updatedPieces);
          setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
        } else if (IsValidMove) {
          let promotionRow = (currentPiece.team == Team.WHITE) ? 7 : 0;
          if (y == promotionRow && currentPiece.type == Type.PAWN) {
            modalRef.current.classList.remove("hide-modal")
            setPromotionPawn({
              piece: currentPiece,
              from: [gridX, gridY],
              to: [x, y],
            })
            console.log(promotionPawn, "<------Promotion Pawn");
          } else {
            let uciMove = `${alphabet[gridX]}${gridY+1}${alphabet[x]}${y+1}`;
            // await dispatch(postMove(matchId, uciMove));
            try {
              await dispatch(postMove(matchId, uciMove));
              socket.emit('move', { room: matchId, move: uciMove });
              const updatedPieces = pieces.reduce((arr, piece) => {
                if (piece.x == gridX && piece.y == gridY){
                  if(Math.abs(gridY - y) == 2 && piece.type == Type.PAWN){
                    piece.enPassant = true
                  } else {
                    piece.enPassant = false
                  }
                  piece.x = x
                  piece.y = y
                  let promotionRow = (piece.team == Team.WHITE) ? 7 : 0;
                  if (y == promotionRow && piece.type == Type.PAWN) {
                    modalRef.current.classList.remove("hide-modal")
                    setPromotionPawn(piece)
                    console.log(promotionPawn, "<------Promotion Pawn");
                  }
                  arr.push(piece)
                } else if (!(piece.x == x && piece.y == y)){
                  if (piece.type == Type.PAWN) {
                    piece.enPassant = false
                  }
                  arr.push(piece)
                }
                return arr
              }, [])
              setPieces(updatedPieces)
              console.log("------> updatedPieces", updatedPieces)
              setCurrentTurn(currentTurn == Team.WHITE ? Team.BLACK : Team.WHITE);
            } catch (err) {
              console.error(err);
              activePiece.style.position = 'relative'
              activePiece.style.removeProperty('top')
              activePiece.style.removeProperty('left')
            } finally {
              setActivePiece(null);
            }
          }
       } else {
        activePiece.style.position = 'relative'
        activePiece.style.removeProperty('top')
        activePiece.style.removeProperty('left')
       }
       setActivePiece(null)
      }
      setActivePiece(null)
    }
  }


  function convertBoardStateToPieces(pieces) {
    console.log(pieces);
    let boardFEN = "";
    for(let i = 7; i >= 0; i--) { // vertical
        let empty = 0;
        for(let j = 0; j < 8; j++) { // horizontal
            let piece = pieces.find(p => p.x === j && p.y === i);
            if(!piece) {
                empty++;
            } else {
                if(empty > 0) {
                    boardFEN += empty.toString();
                    empty = 0;
                }
                let pieceChar;
                switch(piece.type) {
                    case Type.PAWN:
                        pieceChar = "p";
                        break;
                    case Type.KNIGHT:
                        pieceChar = "n";
                        break;
                    case Type.BISHOP:
                        pieceChar = "b";
                        break;
                    case Type.ROOK:
                        pieceChar = "r";
                        break;
                    case Type.QUEEN:
                        pieceChar = "q";
                        break;
                    case Type.KING:
                        pieceChar = "k";
                        break;
                    default:
                        break;
                }
                boardFEN += (piece.team === Team.WHITE) ? pieceChar.toUpperCase() : pieceChar;
            }
        }
        if(empty > 0) {
            boardFEN += empty.toString();
        }
        if(i !== 0) {
            boardFEN += "/";
        }
    }
    return boardFEN;
}


  // This must be above promotePawn() ⬇
  function promotionWhiteOrBlack() {
    return (promotionPawn?.team == Team.WHITE) ? "white" : "black";
  }


  const uciPromotionCodes = {
    [Type.PAWN]: 'p',
    [Type.ROOK]: 'r',
    [Type.KNIGHT]: 'n',
    [Type.BISHOP]: 'b',
    [Type.QUEEN]: 'q',
    [Type.KING]: 'k',
  };


  async function promotePawn(promotionType) {

    if (!promotionPawn) return;

      const [fromX, fromY] = promotionPawn.from;
      const [toX, toY] = promotionPawn.to;

      const updatedPieces = pieces.reduce((arr, piece) => {
        if (piece.x == promotionPawn.piece.x && piece.y == promotionPawn.piece.y) {
          piece.type = promotionType;
          const teamType = promotionPawn.piece.team == Team.WHITE ? "white" : "black";
          piece.image = `../assets/images/${teamType}${promotionType.toLowerCase()}.png`;
          piece.x = toX;
          piece.y = toY;
        }
        arr.push(piece);
        return arr;
      }, []);


      setPieces(updatedPieces);

      modalRef.current.classList.add("hide-modal");

      const uciMove = `${alphabet[fromX]}${fromY+1}${alphabet[toX]}${toY+1}${uciPromotionCodes[promotionType]}`;
      await dispatch(postMove(matchId, uciMove));
      socket.emit('move', { room: matchId, move: uciMove });
      setCurrentTurn(currentTurn === Team.WHITE ? Team.BLACK : Team.WHITE);
      // socket.emit('move', { room: matchId, move: uciMove });

      setPromotionPawn(null);

      console.log(promotionPawn, "<------Promotion Pawn");
      console.log(promotionType, uciPromotionCodes[promotionType]);
  }





  let board = []

  for (let j = verticalAxis.length - 1; j >= 0; j--){
    for (let i = 0; i < horizontalAxis.length; i++) {

      const number = j + i + 2
      let image = undefined

      pieces.forEach(p => {
        if(p.x === i && p.y === j){
          image = p.image
        }
      })

      board.push(<Pieces key={`${j},${i}`} number={number} image={image}/>)

    }
  }



  return (
    <>
    <div className='app-container'>

    <Chat matchId={matchId}/>

      {isCheckmate && <CheckMateModal winner={matchSelector.result} onClose={() => setIsCheckmate(false)} />}
      {isDraw && <DrawModal onClose={() => setIsDraw(false)} />}

      <div className='promotion-modal hide-modal' ref={modalRef}>
        <div className='modal-body'>
          <img onClick={async () => await promotePawn(Type.ROOK)} src={`../assets/images/${promotionWhiteOrBlack()}rook.png`}
          className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.KNIGHT)} src={`../assets/images/${promotionWhiteOrBlack()}knight.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.QUEEN)} src={`../assets/images/${promotionWhiteOrBlack()}queen.png`} className='promotion-image'/>
          <img onClick={async () => await promotePawn(Type.BISHOP)} src={`../assets/images/${promotionWhiteOrBlack()}bishop.png`} className='promotion-image'/>
        </div>
      </div>


        <div className='chessboard-container'>
          <div className='chessboard'
               onMouseDown={e => grabPiece(e)}
               onMouseMove={e => movePiece(e)}
               onMouseUp={e => dropPiece(e)}
               ref={chessboardRef}
              >{board}
          </div>
          <button onClick={handleResetMatch}>Reset Match</button>
        </div>
       </div>
    </>
  )


}

export default ChessBoard




*/
