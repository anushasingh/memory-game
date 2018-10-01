/*
 * A list that holds all of the cards
 */
const cardList  = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb"
];
let isStarted   = false;
let openCards   = [];
let noOfMoves   = 0;
let timerCount  = 0;
let solvedCount = 0;
let timer;

/*
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (currentIndex !== 0) {
        randomIndex         =
            Math.floor(Math.random() * currentIndex);
        currentIndex -=
            1;
        temporaryValue      =
            array[currentIndex];
        array[currentIndex] =
            array[randomIndex];
        array[randomIndex]  =
            temporaryValue;
    }
    return array;
}

/*
 * When count becomes two,check the open cards
 */
function checkCards() {
    if (getCardClass(openCards[0]) === getCardClass(openCards[1])) {
        solvedCount++;
        openCards.forEach(function (card) {
            card.animateCss('tada', function () {
                card.toggleClass("open show match");
            });
        });
    }
    else {
        openCards.forEach(function (card) {
            card.animateCss('shake', function () {
                card.toggleClass("open show");
            });
        });
    }
    openCards =
        [];
    incrementMoveCount();
    if (solvedCount === 8) {
        gameEnd();
    }
}

/*
 * Returns the value of the class from the card DOM
 */
function getCardClass(card) {
    return card[0].firstChild.className;
}


/*
 * Starts the timer
 */
function startTimer() {
    timerCount +=
        1;
    $("#timer").html(timerCount);
    timer =
        setTimeout(startTimer, 1000);
}

/*
 * Increment move count
 */
function incrementMoveCount() {
    noOfMoves +=
        1;
    $("#moves").html(noOfMoves);
    if (noOfMoves === 14 || noOfMoves === 20) {
        decrementStars();
    }
}

/**
 * Event handler card click
 */
function cardClicked() {
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1) {
        return;
    }
    if (!isStarted) {
        isStarted  =
            true;
        timerCount =
            0;
        timer      =
            setTimeout(startTimer, 1000);
    }
    if (openCards.length < 2) {
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    if (openCards.length === 2) {
        checkCards();
    }
}

/*
 * Create a single card element
 */
function createCardElement(cardClass) {
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

/*
 * Create the cards in DOM
 */
function createCards() {
    shuffle(cardList.concat(cardList)).forEach(createCardElement);
}

/*
 * Resets the game
 */
function resetGame() {
    $("ul.deck").html("");
    $(".stars").html("");
    noOfMoves =
        -1;
    incrementMoveCount();
    isStarted   =
        false;
    openCards   =
        [];
    timerCount  =
        0;
    solvedCount =
        0;
    clearTimeout(timer);
    $("#timer").html(0);
    initializeGame();
}

/**
 * After either player has won
 */
function gameEnd() {
    clearTimeout(timer);
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
                           message : `Congratulations! You just won the game in ${timerCount} seconds with ${stars}/3 star rating in ${noOfMoves} moves. Do you want to play again?`,
                           callback: function (value) {
                               if (value) {
                                   resetGame();
                               }
                           }
                       });
}

/*
 * Initializes the stars
 */
function initStars() {
    for (
        let i = 0;
        i < 3;
        i++
    ) {
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

/*
 * Decrements star rating
 */
function decrementStars() {
    let stars = $(".fa-star");
    $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
}

/*
 * Starts the game
 */
function initializeGame() {
    createCards();
    initStars();
    $(".card").click(cardClicked);
}

/*
 * After initialization of DOM
 */
$(document).ready(function () {
    initializeGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className =
        'vex-theme-os';
    vex.dialog.buttons.YES.text  =
        'Yes!';
    vex.dialog.buttons.NO.text   =
        'No';
});

/*
 * handles animations
 */
$.fn.extend({
                animateCss: function (animationName, callback) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    this.addClass('animated ' + animationName).one(animationEnd, function () {
                        $(this).removeClass('animated ' + animationName);
                        if (callback) {
                            callback();
                        }
                    });
                    return this;
                }
            });
