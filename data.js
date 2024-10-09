function square(color, id, piece) {
    return {
        color, id, piece
    };
}

function createEachSquare(rowid) {
    const squareRow = [];
    const squareCol = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


    squareCol.forEach((element, index) => {
        if (rowid % 2 === 0) {
            if (index % 2 === 0) {
                squareRow.push(square("white", element + rowid, null));
            } else {
                squareRow.push(square("black", element + rowid, null));
            }
        } else {
            if (index % 2 === 0) {
                squareRow.push(square("black", element + rowid, null));
            } else {
                squareRow.push(square("white", element + rowid, null));
            }
        }
    });

    return squareRow;
}

function initgame() {
    return [
        createEachSquare(8), createEachSquare(7), createEachSquare(6), createEachSquare(5),
        createEachSquare(4), createEachSquare(3), createEachSquare(2), createEachSquare(1)
    ];
}

export { initgame };
