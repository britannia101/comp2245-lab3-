
const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" }
];

const board = document.querySelector("#board");
const movesDisplay = document.querySelector("#moves");
const statusDisplay = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");

let deck = [];
let turnedCards = [];
let moves = 0;
let waiting = false;
let mismatchTimer = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);
    board.replaceChildren();

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;
        board.appendChild(card);
    });
}

function flipCard(card) {
    const index = Number(card.dataset.index);
    const fruit = deck[index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", `Card ${index + 1}, ${fruit.name}`);
}

function turnBack() {
    turnedCards.forEach((card) => {
        card.textContent = "";
        card.classList.remove("flipped");
        card.setAttribute(
            "aria-label",
            `Card ${Number(card.dataset.index) + 1}, face down`
        );
    });

    turnedCards = [];
    waiting = false;
    mismatchTimer = null;
    statusDisplay.textContent =
        "Turn over two cards to find a matching pair.";
}

board.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card || !board.contains(card)) return;
    if (waiting || card.disabled || card.classList.contains("flipped")) return;

    flipCard(card);
    turnedCards.push(card);

    if (turnedCards.length !== 2) return;

    moves++;
    movesDisplay.textContent = moves;

    const firstFruit = deck[Number(turnedCards[0].dataset.index)];
    const secondFruit = deck[Number(turnedCards[1].dataset.index)];

    if (firstFruit.name === secondFruit.name) {
        turnedCards.forEach((matchedCard) => {
            matchedCard.classList.add("matched");
            matchedCard.disabled = true;
        });

        turnedCards = [];

        const allMatched = [...board.querySelectorAll(".card")]
            .every((gameCard) => gameCard.classList.contains("matched"));

        if (allMatched) {
            statusDisplay.textContent =
                `You found all the pairs in ${moves} moves!`;
            statusDisplay.classList.add("you-won");
        } else {
            statusDisplay.textContent = "That's a pair!";
        }
    } else {
        statusDisplay.textContent = "Not a pair. Try again.";
        waiting = true;
        mismatchTimer = setTimeout(turnBack, 1000);
    }
});

newGameButton.addEventListener("click", () => {
    if (mismatchTimer !== null) {
        clearTimeout(mismatchTimer);
        mismatchTimer = null;
    }

    waiting = false;
    turnedCards = [];
    moves = 0;
    movesDisplay.textContent = moves;
    statusDisplay.textContent =
        "Turn over two cards to find a matching pair.";
    statusDisplay.classList.remove("you-won");

    buildBoard();
});

buildBoard();
