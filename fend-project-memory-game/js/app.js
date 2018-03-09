// List of cards
const cards = [
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
];

const cardBlocks = document.querySelectorAll('li.card');

var firstFlipped = -1;
var secondFlipped = -1;

var moves = 0,
    correct = 0;

// Modal
var modal = document.querySelector('.modal'),
    modalCloseButton = document.querySelector('.modal .close-button'),
    modalTime = document.querySelector('.modal .time'),
    modalStars = document.querySelectorAll('.modal .stars li'),
    modalButton = document.querySelector('.modal button')

// Stars
var stars = document.querySelectorAll('.score-panel .stars li');

// Timer
var seconds = 0,
    minutes = 0, 
    hours = 0;

var timeout;

var time = document.querySelector('.score-panel .time');

// Shows if the game is started or not
var startedOrNot = false;

function setTime() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    time.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    timeout = setTimeout(setTime, 1000);
}

// Run displayCards whenever window loads or user clicks restart button
window.onload = displayCards;
document.querySelector('.restart').addEventListener('click', displayCards);

function displayCards(){
    reset();

    const shuffledCards = shuffle(cards);
    shuffledCards.forEach((card, index) => {
        cardBlocks[index].className = 'card';
        setTimeout(() => {
            cardBlocks[index].querySelector('i').className = card;
        },500);
    }); 
}

// Reset all the variables
function reset(){
    // Reset moves
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;

    correct = 0;

    firstFlipped = -1;
    secondFlipped = -1;

    // Reset time
    clearTimeout(timeout);
    seconds = 0;
    minutes = 0;
    hours = 0;
    time.textContent = '00:00:00';

    // Reset stars
    stars.forEach(star => star.classList.add('colored'));

    startedOrNot = false
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

cardBlocks.forEach(cardBlock => cardBlock.addEventListener('click', flipCard));

function flipCard(){
    // Check if card we picked is not already correct
    if (this.className === 'card open show' || this.className === 'card match'){
        return;
    }
    // Check if we already picked two cards, if yes do nothing
    if (firstFlipped !== -1 && secondFlipped !== -1){
        return;
    }

    if (!startedOrNot){
        startedOrNot = true;
        setTime();
    }

    this.className = 'card open show';
    if (firstFlipped === -1){
        firstFlipped = this
    }    
    else{
        secondFlipped = this;

        // Wait for transition to end and fire checkCards function
        setTimeout(checkCards, 400);
    }
}

function checkCards(){
    moves++;
    document.querySelector('.moves').innerHTML = moves;

    // Remove stars if there are several moves made already
    if (moves === 15){
        stars[2].classList.remove('colored');
    }
    if (moves === 25){
        stars[1].classList.remove('colored');
    }

    if (firstFlipped.querySelector('i').className === secondFlipped.querySelector('i').className){
        firstFlipped.className = 'card match';
        secondFlipped.className = 'card match';

        // Check if all the cards are open, if yes modal appears
        correct++;
        if (correct === 8){
            // Set modal time and stars
            modalTime.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
            clearTimeout(timeout);
            
            modalStars.forEach((modalStar, index) => {
                modalStar.className = stars[index].className;
            });

            toggleModal();
        }
    }
    else{
        firstFlipped.className = 'card';
        secondFlipped.className = 'card';
    }
    firstFlipped = -1;
    secondFlipped = -1;
}

modalButton.addEventListener('click', displayCards, false);
modalButton.addEventListener('click', toggleModal, false);
modalCloseButton.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('show-modal');
}