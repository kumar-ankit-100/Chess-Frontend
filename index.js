import { renderEachSquare } from "./renderer.js";
import { initgame } from "./data.js";
//this will be used until the game ends

const globalState = initgame();
const rootDiv = document.getElementById("root");
const flatArray = globalState.flat();
let previousHighlightedSquare = [];
let previousHighlightedCross = [];
let playerColor = "";

let storedPosition = ""; // To store the clicked piece's position

function highlightSquareBubble(previousHighlightedSquare) {
    previousHighlightedSquare.forEach(element => {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        const square = document.getElementById(element);
        square.appendChild(bubble);
    });
}
function highlightSquareyellow(position) {
    const yellowDiv = document.createElement("div");
    yellowDiv.classList.add("yellow");
    const square = document.getElementById(position);
    square.appendChild(yellowDiv);

}
function highlightCaptureMoves(captureMoves) {
    captureMoves.forEach((position) => {
        const pieceElement = document.getElementById(position); // Get the square by ID (e.g., 'd5', 'f5')

        if (pieceElement) {
            const redCross = document.createElement("div");
            redCross.className = "red-cross"; // Add a class for styling
            redCross.style.position = "absolute";
            redCross.style.top = "0";
            redCross.style.left = "0";
            redCross.style.width = "100%";
            redCross.style.height = "100%";
            redCross.style.background = "rgba(255, 0, 0, 0.6)"; // Semi-transparent red overlay
            redCross.style.zIndex = "2"; // Make sure it is above the piece

            // Append the red cross over the piece
            pieceElement.appendChild(redCross);
        }
        // }
    });
}
function removeHighlightBubble(previousHighlightedSquare) {
    previousHighlightedSquare.forEach(element => {
        console.log(element);
        const square = document.getElementById(element);
        const bubble = square.querySelector(".bubble");
        square.removeChild(bubble);
    });

}
function removeHighlightCross(previousHighlightedCross) {
    previousHighlightedCross.forEach(element => {
        console.log("Remove Cross highlight : " + element);
        const square = document.getElementById(element);
        const redCross = square.querySelector(".red-cross");
        square.removeChild(redCross);
    });

}
function temp(id) {
    let temp1 = +id[1] + 1;
    let temp2 = +id[1] + 2;
    // console.log(temp);
    return [id[0] + temp1, id[0] + temp2];
}

function globalEventListner(pieceColor) {
    rootDiv.addEventListener("click", (Event) => {
        console.log(Event);
        const clickedId = Event.target.parentNode.id;
        const flatArray = globalState.flat();
        console.log("my piece colour is : "+playerColor);

        // console.log(Event.target.className);
        //if we click on image piece that mean we are exploring possible moves
        if (Event.target.localName === 'img') {
            let url = Event.target.src;
            let parts = url.split('/');
            console.log("your pawn is " + parts[parts.length - 2]);
            if (pieceColor == parts[parts.length - 2]) {
                // console.log(clickedId + " " + previousHighlightedSquare[0])
                const square = flatArray.find((temp) => temp.id === clickedId);
                // console.log(square);
                console.log(clickedId);
                console.log(previousHighlightedSquare.length);
                if (previousHighlightedSquare.length > 0) {
                    removeHighlightBubble(previousHighlightedSquare);
                    previousHighlightedSquare = [];
                }
                if (previousHighlightedCross.length > 0) {
                    removeHighlightCross(previousHighlightedCross);
                    previousHighlightedCross = [];
                }
                storedPosition = clickedId; // Store the clicked piece's position (e.g., "e2")

                // Update previousHighlightedSquare with the new position
                // Create the JSON payload

                let filename = parts[parts.length - 1]; // Get the filename (pawn.png)
                let pieceName = filename.split('.')[0]; // Remove the extension (.png)
                console.log(pieceName); // Output: pawn
                const sendingJson = JSON.stringify({
                    purpose: "generateMove",
                    pieceName: pieceName,
                    position: clickedId // Send the clicked square (e.g., "e2")
                });

                // Send the JSON through WebSocket
                socket.send(sendingJson);
            }


        }
        //if class is bubble that mean we either move pieces or capture the pieces
        else if (Event.target.className == "bubble" || Event.target.className == "red-cross" || previousHighlightedSquare.find((temp) => temp == Event.target.id)) {

            if (storedPosition) {
                // Concatenate the stored position with the current square to form the move
                let move = "";
                if (clickedId) {
                    console.log("you have clicked on either bubble or red-cross");
                    move = storedPosition + clickedId;
                }
                else {
                    console.log("you have clicked on square");
                    move = storedPosition + Event.target.id;
                }

                console.log("Sending Move: " + move);

                // Send the move to the backend
                const updateJson = JSON.stringify({
                    purpose: "updateBoard",
                    position: move // e.g., "e2e4"
                });
                socket.send(updateJson);

                // Clear the stored position after sending the move
                storedPosition = "";
            } else {
                console.log("No piece selected, click on a piece first.");
            }



        }
        else {
            if (previousHighlightedSquare.length > 0) {
                removeHighlightBubble(previousHighlightedSquare);
                previousHighlightedSquare = [];
            }
            if (previousHighlightedCross.length > 0) {
                removeHighlightCross(previousHighlightedCross);
                previousHighlightedCross = [];
            }
        }
    });
}



//this code is used to connection of frontend to bakcend using socket
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

function updatingPieceMove(move){
        const fromPosition = move.slice(0, 2); // "e2"
        const toPosition = move.slice(2, 4); // "e4"

        // Find the elements for the previous and new positions
        const fromElement = document.getElementById(fromPosition);
        const toElement = document.getElementById(toPosition);

        if (fromElement && toElement) {
            // Get the piece (child) from the previous position
            const piece = fromElement.querySelector('img');
            const destinationpiece = toElement.querySelector('img');
            
            if (destinationpiece) return;
            // Remove the piece from the previous position
            if (piece) {
                fromElement.removeChild(piece);

                // Append the piece to the new position
                toElement.appendChild(piece);

                console.log(`updatig your board ... Moved piece from ${fromPosition} to ${toPosition}`);
            }
           }
}

// Listen for messages
socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data); // Parse the received JSON
    console.log("Received from server:", data);
    //check that either match started 
    if (data.color) {
        if (data.color == "black") {
            playerColor = data.color;
            globalEventListner(data.color);
        }
        else if (data.color == "white") {
            playerColor = data.color;
            globalEventListner(data.color);
        }
    }
    if(data.purpose == "updateBoard"&&data.position!=""){
        
            updatingPieceMove(data.previousMove);
        
    }
    // If the response contains possible moves, update previousHighlightedSquare
    if (data.possibleMoves || data.possibleCaptures) {
        // Highlight the possible move squares (bubbles)
        if (data.possibleMoves) {
            console.log(data.possibleMoves);
            previousHighlightedSquare = data.possibleMoves; // List of possible moves
            highlightSquareBubble(previousHighlightedSquare); // Call your function to highlight these squares
        }

        // Highlight capture moves with a red cross
        if (data.possibleCaptures) {
            console.log(data.possibleCaptures);
            previousHighlightedCross = data.possibleCaptures; // List of possible moves
            highlightCaptureMoves(previousHighlightedCross); // A new function to highlight captures
        }
    }
    //this is the case for updating board 

    if (data.status == "success") {
        console.log("backend board is updated successfully");

        // Get the previous and new positions from the move (e.g., "e2e4")
        const move = data.position; // e.g., "e2e4"
        const fromPosition = move.slice(0, 2); // "e2"
        const toPosition = move.slice(2, 4); // "e4"

        // Find the elements for the previous and new positions
        const fromElement = document.getElementById(fromPosition);
        const toElement = document.getElementById(toPosition);

        if (fromElement && toElement) {
            // Get the piece (child) from the previous position
            const piece = fromElement.querySelector('img');
            const destinationpiece = toElement.querySelector('img');
            if (destinationpiece)
                toElement.removeChild(destinationpiece);
            // Remove the piece from the previous position
            if (piece) {
                fromElement.removeChild(piece);

                // Append the piece to the new position
                toElement.appendChild(piece);

                console.log(`Moved piece from ${fromPosition} to ${toPosition}`);
            }

            // Remove any bubbles (possible moves) after the move is completed
            removeHighlightBubble(previousHighlightedSquare); // Assuming removeHighlight() is a function to remove bubbles
            removeHighlightCross(previousHighlightedCross);
            previousHighlightedSquare = []; // Clear highlighted squares array
            previousHighlightedCross = [];
        }

    }
    else if (data.status == "check") {
        console.log("protect your king");
    }
    else if (data.status == "Checkmate") {
        console.log("Checkmate! " + data.winColor + "Wins");
        checkmate(data.winColor);

    }
    else {
        console.log("There is an error in updating the backend board");
    }
});

// Send a message to the server

// Handle connection close
socket.addEventListener('close', function (event) {
    console.log('Disconnected from WebSocket server');
});

// Handle errors
socket.addEventListener('error', function (event) {
    console.error('WebSocket error: ', event);
});

renderEachSquare(globalState);

function sendPeriodicUpdateRequest() {
    const updateRequest = JSON.stringify({
        purpose: "givemeopponentupdate",
        color: playerColor // Assuming you have a variable that stores the player's color
    });

    // Send the JSON through WebSocket
    socket.send(updateRequest);
}

// Call this function every 10 seconds (or your desired interval)
setInterval(sendPeriodicUpdateRequest, 3000);


// Simulating a checkmate condition
function checkmate(winner) {
    // Create a new div to show the result
    const message = document.createElement('div');
    message.classList.add('checkmate-message');

    // Set the content based on the winner
    // console.log("wincolor"+winner);
    message.innerText = winner == "Black" ? 'Black Wins!' : 'White Wins!';

    // Append the message to the root
    document.getElementById('root').appendChild(message);
}
