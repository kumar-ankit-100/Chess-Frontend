const rootDiv = document.getElementById("root");
import * as image from "./pieces.js"


function renderEachSquare(data) {
    data.forEach(element => {
        const rowElement = document.createElement("div");
        element.forEach(square => {
            const eachSquareElement = document.createElement("div");
            eachSquareElement.classList.add(square.color, "square");
            eachSquareElement.id = square.id;
            // if(square.id==7){
            //     console.log("blackpaawn");
            // }

            if(square.id[1]==1){
                const cornerElement= document.createElement("span");
                cornerElement.classList.add("corner-text-bottom");
                cornerElement.innerText=square.id[0];
                if(square.color=="white")
                    cornerElement.style.color="#769656";
                else
                cornerElement.style.color="white";
                eachSquareElement.appendChild(cornerElement);
            }
            if(square.id[0]=='a'){
                const cornerElement= document.createElement("span");
                cornerElement.classList.add("corner-text-left");
                cornerElement.innerText=square.id[1];

                if(square.color=="white")
                    cornerElement.style.color="#769656";
                else
                cornerElement.style.color="white";
                eachSquareElement.appendChild(cornerElement);
            }

            //pawn rendering
            if (square.id[1] == 7) {
                square.piece = image.blackPawn(square.id);
                const imageElement = document.createElement("img");
                imageElement.src = square.piece.img;
                imageElement.classList.add("img");
                eachSquareElement.appendChild(imageElement);
            }
            if (square.id[1] == 2) {
                square.piece = image.whitePawn(square.id);
                const imageElement = document.createElement("img");
                imageElement.src = square.piece.img;
                imageElement.classList.add("img");
                eachSquareElement.appendChild(imageElement);
            }
            //rook rendering
            if (square.id[1] == 8) {
                if (square.id[0] == 'a' || square.id[0] == 'h') {
                    square.piece = image.blackRook(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            if (square.id[1] == 1) {
                if (square.id[0] == 'a' || square.id[0] == 'h') {
                    square.piece = image.whiteRook(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            //knight rendering
            if (square.id[1] == 8) {
                if (square.id[0] == 'b' || square.id[0] == 'g') {
                    square.piece = image.blackKnight(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            if (square.id[1] == 1) {
                if (square.id[0] == 'b' || square.id[0] == 'g') {
                    square.piece = image.whiteKnight(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            //bishop rendering
            if (square.id[1] == 8) {
                if (square.id[0] == 'c' || square.id[0] == 'f') {
                    square.piece = image.blackBishop(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            if (square.id[1] == 1) {
                if (square.id[0] == 'c' || square.id[0] == 'f') {
                    square.piece = image.whiteBishop(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            //queen rendering
            if (square.id[1] == 8) {
                if (square.id[0] == 'd') {
                    square.piece = image.blackQueen(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }

            if (square.id[1] == 1) {
                if (square.id[0] == 'd') {
                    square.piece = image.whiteQueen(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }
            //king rendering
            if (square.id[1] == 8) {
                if (square.id[0] == 'e') {
                    square.piece = image.blackKing(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }

            if (square.id[1] == 1) {
                if (square.id[0] == 'e') {
                    square.piece = image.whiteKing(square.id);
                    const imageElement = document.createElement("img");
                    imageElement.src = square.piece.img;
                    imageElement.classList.add("img");
                    eachSquareElement.appendChild(imageElement);

                }
            }

            // console.log(square.id[1]);
            rowElement.appendChild(eachSquareElement);
        });
        rowElement.classList.add("row")
        rootDiv.appendChild(rowElement);
        console.log(element);
    });
}
export { renderEachSquare };