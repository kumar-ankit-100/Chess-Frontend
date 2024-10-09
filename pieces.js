
//black pieces
function blackPawn(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/pawn.png",
        piece_name: "blackPawn"
    }
}
function blackKnight(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/knight.png",
        piece_name: "blackKnight"
    }
}
function blackQueen(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/queen.png",
        piece_name: "blackQueen"
    }
}
function blackKing(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/king.png",
        piece_name: "blackKing"
    }
}
function blackBishop(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/bishop.png",
        piece_name: "blackBishop"
    }
}
function blackRook(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/black/rook.png",
        piece_name: "blackRook"
    }
}

//white pieces
function whitePawn(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/pawn.png",
        piece_name: "whitePawn"
    }
}
function whiteKnight(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/knight.png",
        piece_name: "whiteKnight"
    }
}
function whiteQueen(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/queen.png",
        piece_name: "whiteQueen"
    }
}
function whiteKing(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/king.png",
        piece_name: "whiteKing"
    }
}
function whiteBishop(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/bishop.png",
        piece_name: "whiteBishop"
    }
}
function whiteRook(currentPosition) {
    return {
        position: currentPosition,
        img: "piecesImage/white/rook.png",
        piece_name: "whiteRook"
    }
}


export {
    blackPawn, blackKnight, blackBishop, blackQueen, blackRook, blackKing,
    whitePawn, whiteKnight, whiteBishop, whiteQueen, whiteRook, whiteKing,

};