import { renderEachSquare } from "./renderer.js";
import { initgame } from "./data.js";
//this will be used until the game ends

const globalState = initgame();
const rootDiv = document.getElementById("root");
const flatArray = globalState.flat();
let previousHighlightedSquare = [];
let previousHighlightedCross = [];
let playerColor = "";
let currentPlayerName = "";
let opponentPlayerName = "";
let previousMessage = "";
// let previousMove="";
let lastMove = "";
let flag = 1;
let isai = false;

let storedPosition = ""; // To store the clicked piece's position

const whiteTimerElement = document.querySelector("#timer .timeText:last-child");
const blackTimerElement = document.querySelector(
  "#timer .timeText:first-child"
);
let whiteTimer, blackTimer;
// Timer class to manage countdown for each player
class ChessTimer {
  constructor(minutes, seconds, displayElement) {
    this.totalSeconds = minutes * 60 + seconds;
    this.displayElement = displayElement;
    this.timerId = null;
  }

  start() {
    if (this.timerId === null) {
      this.timerId = setInterval(() => {
        this.totalSeconds--;
        this.updateDisplay();
        if (this.totalSeconds <= 0) {
          this.stop();
          // Handle time's up scenario
          alert("Time's up!");
        }
      }, 1000);
    }
  }

  stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;
    this.displayElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
function initializeTimers() {
  let initialMinutes;
  if (isai) initialMinutes = 60; // Change this to your desired initial time
  else initialMinutes = 10;
  whiteTimer = new ChessTimer(initialMinutes, 0, whiteTimerElement);
  blackTimer = new ChessTimer(initialMinutes, 0, blackTimerElement);
  whiteTimer.updateDisplay();
  blackTimer.updateDisplay();
}

function highlightSquareBubble(previousHighlightedSquare) {
  previousHighlightedSquare.forEach((element) => {
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
  previousHighlightedSquare.forEach((element) => {
    console.log(element);
    const square = document.getElementById(element);
    const bubble = square.querySelector(".bubble");
    square.removeChild(bubble);
  });
}
function removeHighlightCross(previousHighlightedCross) {
  previousHighlightedCross.forEach((element) => {
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
function updateMove(move) {
  // alert("move updated");
  const previousMove = document.getElementById("previousMove");

  const moveContainer = document.createElement("div");
  moveContainer.classList.add("moveConatainer");
  const moveFrom = document.createElement("div");
  const moveTO = document.createElement("div");
  moveFrom.classList.add("move");
  moveTO.classList.add("move");
  // if(!flag){
  //     moveContainer.style.backgroundColor="black";
  //     flag=!flag;
  // }

  moveFrom.innerText = move.slice(0, 2);
  moveTO.innerText = move.slice(2, 4);
  moveContainer.appendChild(moveFrom);
  moveContainer.appendChild(moveTO);
  previousMove.appendChild(moveContainer);

  lastMove = move;
  // scroll move to last
  let previousMoveContainer = document.getElementById("previousMove");
  previousMoveContainer.scrollTop = previousMoveContainer.scrollHeight;
}
function updateMessage(playerName, message) {
  const messageContainer = document.getElementById("messageContainer");
  const newMessage = document.createElement("div");
  newMessage.innerText = `${playerName}: ${message}`;
  messageContainer.appendChild(newMessage);
}
function sendButtonEventListner() {
  document.getElementById("sendButton").addEventListener("click", (Event) => {
    const messageInput = document.getElementById("messageInput").value.trim();
    previousMessage = messageInput;

    // Display message with player name
    if (messageInput) {
      updateMessage(currentPlayerName, messageInput);

      // Send JSON message over WebSocket
      const messageData = {
        purpose: "messageSent",
        message: messageInput,
      };
      socket.send(JSON.stringify(messageData));

      // Clear input after sending
      document.getElementById("messageInput").value = "";
      // scroll message to last
      let messageContainer = document.getElementById("messageContainer");
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  });
}
sendButtonEventListner();
function globalEventListner(pieceColor) {
  rootDiv.addEventListener("click", (Event) => {
    console.log(Event);
    const clickedId = Event.target.parentNode.id;
    const flatArray = globalState.flat();
    console.log("my piece colour is : " + playerColor);

    // console.log(Event.target.className);
    //if we click on image piece that mean we are exploring possible moves
    if (Event.target.localName === "img") {
      let url = Event.target.src;
      let parts = url.split("/");
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
        let pieceName = filename.split(".")[0]; // Remove the extension (.png)
        console.log(pieceName); // Output: pawn
        const sendingJson = JSON.stringify({
          purpose: "generateMove",
          pieceName: pieceName,
          position: clickedId, // Send the clicked square (e.g., "e2")
        });
        socket.send(sendingJson);

        // Send the JSON through WebSocket
      }
    }
    //if class is bubble that mean we either move pieces or capture the pieces
    else if (
      Event.target.className == "bubble" ||
      Event.target.className == "red-cross" ||
      previousHighlightedSquare.find((temp) => temp == Event.target.id)
    ) {
      if (storedPosition) {
        // Concatenate the stored position with the current square to form the move
        let move = "";
        if (clickedId) {
          console.log("you have clicked on either bubble or red-cross");
          move = storedPosition + clickedId;
        } else {
          console.log("you have clicked on square");
          move = storedPosition + Event.target.id;
        }

        console.log("Sending Move: " + move);

        // Send the move to the backend
        const updateJson = JSON.stringify({
          purpose: "updateBoard",
          position: move, // e.g., "e2e4"
        });
        socket.send(updateJson);

        // Clear the stored position after sending the move
        storedPosition = "";
      } else {
        console.log("No piece selected, click on a piece first.");
      }
    } else {
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

function updatingPieceMove(move) {
  // console.log("chal htt bahen ke lori");
  const fromPosition = move.slice(0, 2); // "e2"
  const toPosition = move.slice(2, 4); // "e4"

  // Find the elements for the previous and new positions
  const fromElement = document.getElementById(fromPosition);
  const toElement = document.getElementById(toPosition);
  console.log("come in updating fucntion to update move");

  if (fromElement && toElement) {
    // Get the piece (child) from the previous position
    const piece = fromElement.querySelector("img");
    const destinationpiece = toElement.querySelector("img");

    if (destinationpiece && piece) toElement.removeChild(destinationpiece);
    // Remove the piece from the previous position
    if (piece) {
      fromElement.removeChild(piece);

      // Append the piece to the new position
      toElement.appendChild(piece);

      console.log(
        `updatig your board ... Moved piece from ${fromPosition} to ${toPosition}`
      );
    }
  }
}
function updateName(whitePlayerName, blackPlayerName) {
  let whitePlayerElement = document.getElementById("whitePlayer");
  let blackPlayerElement = document.getElementById("blackPlayer");

  console.log(
    "whiteplayer name : " + whitePlayerName + " Black : " + blackPlayerName
  );
  console.log(
    whitePlayerElement.innerText + "  " + blackPlayerElement.innerText
  );

  if (whitePlayerElement.innerText == "") {
    whitePlayerElement.innerText = whitePlayerName;
  }
  if (blackPlayerElement.innerText == "") {
    blackPlayerElement.innerText = blackPlayerName;
  }
}

let socket;
function initializeWebsocket(playerName) {
  socket = new WebSocket("ws://13.201.103.250:8080");

  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("Connected to WebSocket server");
  });
  // Listen for messages
  socket.addEventListener("message", function (event) {
    const data = JSON.parse(event.data); // Parse the received JSON
    console.log("Received from server:", data);
    //check that either match started
    if (data.color) {
      //check if ai is playing then add event listner to both piece
      if (isai) {
        globalEventListner("white");
        // globalEventListner("black");
      } else {
        if (data.color == "black") {
          playerColor = data.color;
          globalEventListner(data.color);
        } else if (data.color == "white") {
          playerColor = data.color;
          globalEventListner(data.color);
        }
      }
    }
    if (data.purpose == "updateBoard" && data.message != "") {
      if (playerColor != data.colorToUpdate) {
        previousMessage = data.message;
        updateMessage(opponentPlayerName, data.message);
        // scroll message to last
        let messageContainer = document.getElementById("messageContainer");
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
    if (data.purpose == "updateBoard" && data.previousMove != "") {
      console.log("ladfslkjjlkdfskjldsaflkjdadlk");
      if (data.previousMove != lastMove) {
        if (playerColor == "white") {
          whiteTimer.start();
          blackTimer.stop();
        } else {
          blackTimer.start();
          whiteTimer.stop();
        }
      }
      updatingPieceMove(data.previousMove);
    }
    if (data.purpose == "updateBoard" && data.position != "") {
      if (playerColor == "white") updateName(playerName, data.opponentName);
      else updateName(data.opponentName, playerName);

      if (opponentPlayerName == "") opponentPlayerName = data.opponentName;
      if (data.previousMove != "" && data.previousMove != lastMove) {
        lastMove = data.previousMove;
        updateMove(data.previousMove);
        // scroll move to last
        let previousMoveContainer = document.getElementById("previousMove");
        previousMoveContainer.scrollTop = previousMoveContainer.scrollHeight;
      }
    }
    if (data.message == "Match started") {

      document.body.classList.add('match-started'); //i add this class when match started for mobile responsiveness

      // Hide login and show game elements
      document.getElementById("login").style.display = "none";
      document.getElementById("playedMove").style.display = "flex";
      if (!isai) {
        document.getElementById("timer").style.display = "flex";
        document.getElementById("messageBox").style.display = "block";
      }
      let players = document.getElementsByClassName("playerName");
      for (let i = 0; i < players.length; i++) {
        players[i].style.display = "flex";
      }
      initializeTimers();
      // if (playerColor == "white") {
      whiteTimer.start();
      // }
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
      if (playerColor == "white") {
        whiteTimer.stop();
        blackTimer.start();
      } else {
        blackTimer.stop();
        whiteTimer.start();
      }

      // Get the previous and new positions from the move (e.g., "e2e4")
      const move = data.position; // e.g., "e2e4"

      //calling update move function to update prev move on box
      updateMove(move);

      const fromPosition = move.slice(0, 2); // "e2"
      const toPosition = move.slice(2, 4); // "e4"

      // Find the elements for the previous and new positions
      const fromElement = document.getElementById(fromPosition);
      const toElement = document.getElementById(toPosition);

      if (fromElement && toElement) {
        // Get the piece (child) from the previous position
        const piece = fromElement.querySelector("img");
        const destinationpiece = toElement.querySelector("img");
        if (destinationpiece) toElement.removeChild(destinationpiece);
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
    } else if (data.status == "check") {
      console.log("protect your king");
    } else if (data.status == "Checkmate") {
      console.log("Checkmate! " + data.winColor + "Wins");
      checkmate(data.winColor);
    } else {
      console.log("There is an error in updating the backend board");
    }
  });

  // Send a message to the server

  // Handle connection close
  socket.addEventListener("close", function (event) {
    console.log("Disconnected from WebSocket server");
  });

  // Handle errors
  socket.addEventListener("error", function (event) {
    console.error("WebSocket error: ", event);
  });
  function sendPeriodicUpdateRequest() {
    const updateRequest = JSON.stringify({
      purpose: "givemeopponentupdate",
      color: playerColor, // Assuming you have a variable that stores the player's color
      playerName: playerName,
    });

    // Send the JSON through WebSocket
    socket.send(updateRequest);
  }

  // Call this function every 1 seconds (or your desired interval)
  setInterval(sendPeriodicUpdateRequest, 400);
}
// initializeWebsocket();

// Function to handle the "Play Now" button click
function initializeAIGame() {
  isai = true;
  const playerName = document.getElementById("loginmessageInput").value;

  if (!playerName) {
    alert("Please enter your name before playing.");
    return;
  }
  currentPlayerName = playerName;
  playerColor = "white";

  // Initialize WebSocket connection
  initializeWebsocket(playerName);

  // Prepare and send the AI game request

  const gameRequest = {
    purpose: "playWithAI",
    playerName: playerName,
  };
  socket.onopen = function () {
    socket.send(JSON.stringify(gameRequest));
  };
}
function handlePlayNow(isAI) {
  if (isAI) {
    initializeAIGame();
    return;
  }
  const playerName = document.getElementById("loginmessageInput").value;
  const selectedTime = document.getElementById("timerValue").textContent;

  if (!playerName) {
    alert("Please enter your name before playing.");
    return;
  }
  currentPlayerName = playerName;

  // Initialize WebSocket connection
  initializeWebsocket(playerName);

  // Prepare and send the game request
  const gameRequest = {
    purpose: "playRequest",
    playerName: playerName,
  };

  // socket.onopensend(JSON.stringify(gameRequest));
  socket.onopen = function () {
    socket.send(JSON.stringify(gameRequest));
  };
}

renderEachSquare(globalState);
// Add event listener to the "Play Now" button
document.getElementById("play-button").addEventListener("click", (Event) => {
  console.log(Event);
  handlePlayNow(false);
});
document.getElementById("play-ai-button").addEventListener("click", (Event) => {
  console.log(Event);
  handlePlayNow(true);
});

// Simulating a checkmate condition
function checkmate(winner) {
  // Create a new div to show the result
  const message = document.createElement("div");
  message.classList.add("checkmate-message");

  // Set the content based on the winner
  // console.log("wincolor"+winner);
  message.innerText = winner == "Black" ? "Black Wins!" : "White Wins!";

  // Append the message to the root
  document.getElementById("root").appendChild(message);
}

//dropdown selection of timer
const selectedTimer = document.getElementById("selectedTimer");
const dropdownOptions = document.getElementById("dropdownOptions");
const timerValue = document.getElementById("timerValue");
const dropdownItems = document.querySelectorAll(".dropdownItem");

// Toggle dropdown visibility
selectedTimer.addEventListener("click", function () {
  dropdownOptions.classList.toggle("hidden");
});

// Update selected timer when an option is clicked
dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedValue = item.getAttribute("data-value");
    timerValue.textContent = selectedValue;
    dropdownOptions.classList.add("hidden"); // Hide dropdown after selection
  });
});

//hide everything except login class
function hideTimer() {
  document.getElementById("timer").style.display = "none";
}
hideTimer();
function playedMove() {
  document.getElementById("playedMove").style.display = "none";
}
playedMove();
function messageBox() {
  document.getElementById("messageBox").style.display = "none";
}
messageBox();
function timerDropdownContainer() {
  document.getElementById("timerDropdownContainer").style.display = "none";
}
timerDropdownContainer();
function playerName() {
  let players = document.getElementsByClassName("playerName");
  for (let i = 0; i < players.length; i++) {
    players[i].style.display = "none"; // Hides each element
  }
}
playerName();
function login() {
  document.getElementById("login").style.display = "none";
}
// login();
// for login functionality
