// app state
// ===================
var chips = 100;
var pot = 0;
var deckID = '';
var dealerCards = [];
var playerCards = [];
var playerScore = 0;
var dealerScore = 0;
var roundLost = false;
var roundWon = false;
var roundTied = false;
var bettingTime = false;

//node backups:
var dealerScoreNodeReset = document.querySelector('#dealer-number');
var playerScoreNodeReset = document.querySelector('#player-number');
var dealerCardsNodeReset = document.querySelector('#dealer-cards');
var playerCardsNodeReset = document.querySelector('#player-cards');
var announcementNodeReset = document.querySelector('#announcement');
var newDeckNodeReset = document.querySelector('#new-game');
var nextHandNodeReset = document.querySelector('#next-hand');
var hitMeNodeReset = document.querySelector('#hit-me');
var stayNodeReset = document.querySelector('#stay');


// game play nodes:
// ===================

var dealerScoreNode = document.querySelector('#dealer-number');

var playerScoreNode = document.querySelector('#player-number');

var dealerCardsNode = document.querySelector('#dealer-cards');

var playerCardsNode = document.querySelector('#player-cards');

var announcementNode = document.querySelector('#announcement');

var newDeckNode = document.querySelector('#new-game');

var nextHandNode = document.querySelector('#next-hand');

var hitMeNode = document.querySelector('#hit-me');

var stayNode = document.querySelector('#stay');

var placeBet = document.querySelector('#placeBet')

//here be chips...
//===================
var chip1Node = document.querySelector('#chip1');
var chip5Node = document.querySelector('#chip5');
var chip25Node = document.querySelector('#chip25');
var chip50Node = document.querySelector('#chip50');
var totalChips = document.querySelector('#totalChips')
var totalBets = document.querySelector('#totalBets')
// On click events
// ==================

newDeckNode.onclick = getNewDeck;
nextHandNode.onclick = () => {
  resetPlayingArea()
  bet()
}
hitMeNode.onclick = () => hitMe('player');
stayNode.onclick = () => setTimeout(() => dealerPlays(), 600);
placeBet.onclick = newHand;
chip1Node.onclick = () => betAmmount(1);
chip5Node.onclick = () => betAmmount(5);
chip25Node.onclick = () => betAmmount(25);
chip50Node.onclick = () => betAmmount(50);
// ==================

function betAmmount(amount){
  if(bettingTime && (chips-amount >= 0)){
    chips = chips - amount
    pot += amount
    totalBets.textContent = pot;
    totalChips.textContent = chips;
  }
  return;
}

//Game mechanics functions
//========================

function checkIfCanBet(){
  return new Promise(function(resolve,reject){
    if(chips > 0){
      resolve(true)
    }else{
      reject(false)
    }
  })
}

function bet(){
  return checkIfCanBet()
  .then( (r) => {
    bettingTime = true;
    return r;
  })
  .catch(function(err){
    console.log('no muneh', err);
  })
}

function getNewDeck() {
  totalChips.textContent = chips;
  resetChips()
  resetPlayingArea()
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then(res => res.json())
  .then(function(res){
    deckID = res.deck_id
    nextHandNode.style = ""
    hitMeNode.style = ""
    stayNode.style = ""
  })
  .catch(function(err){
    console.log(err,'newdeck error');
  })
}

function computeScore(cards) {
  var hasAce = false;
  var score = cards.reduce(function(accu,el,indx){
    if(el.value === '0' || el.value === 'JACK' || el.value === 'QUEEN' || el.value === 'KING'){
      accu += 10;
    }else if(el.value === 'ACE'){
      hasAce = true;
      accu += 1;
    }else{
      accu+= Number(el.value);
    }
    return accu
  },0)
  score = (hasAce && score < 12) ? score + 10 : score;
  return score
}


function newHand() {
  resetPlayingArea()
  bet()
  .then( () => {
    bettingTime = false;
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
    .then(res => res.json())
    .then(function(res){
      return res.cards.forEach(function(el,indx){
        if(indx == 0 || indx == 2){
          playerCards.push(el)
        }else{
          dealerCards.push(el)
        }
      })
    })
    .then(function(res){
      dealerScore = '?';
      dealerScoreNode.textContent = dealerScore;
      return res
    })
    .then(function(res){
      dealerCards.forEach(function(el,indx){
        var imgNode = document.createElement("IMG");
        imgNode.src = el.image
        dealerCardsNode.appendChild(imgNode);
        if(indx === 1){
          imgNode.style = "display:none;"
          imgNode.id = 'hiddenCard'
        }
      })
      playerCards.forEach(function(el,indx){
        var imgNode = document.createElement("IMG");
        imgNode.src = el.image
        playerCardsNode.appendChild(imgNode);
      })
      return computeScore(playerCards)
    })
    .then(function(res){
      playerScoreNode.textContent = res
      if(res === 21){
        roundWon = true;
        chips = chips + Math.floor(pot*2.25)
        pot = 0;
        totalBets.textContent = pot;
        totalChips.textContent = chips;
        announcementNode.textContent = "BlackJack! You Win...but remeber...the house always wins..."
      }
    })
    .catch(function(err){
      console.log(err,'newHAND');
    })
  })
}

function resetChips() {
  chips = 100
}

function resetPlayingArea() {
  dealerCards = [];
  playerCards = [];
  playerScore = 0;
  dealerScore = 0;
  roundLost = false;
  roundWon = false;
  roundTied = false;
  dealerScoreNode.textContent = '0'
  playerScoreNode.textContent = '0'
  while (dealerCardsNode.hasChildNodes()) {
    dealerCardsNode.removeChild(dealerCardsNode.lastChild);
  }
  while (playerCardsNode.hasChildNodes()) {
    playerCardsNode.removeChild(playerCardsNode.lastChild);
  }
  announcementNode.textContent = ""
}


function hitMe(target) {
  // if(roundLost === true || roundTied === true || roundWon === true){
  //   return
  // }
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
  .then(res => res.json())
  .then(function(res){
    if(target === 'player'){
      playerCards.push(res.cards[0])
    }else{
      dealerCards.push(res.cards[0])
    }
    return res.cards[0]
  })
  .then(function(res){
    if(target === 'player'){
      var imgNode = document.createElement("IMG");
      imgNode.src = res.image
      playerCardsNode.appendChild(imgNode);
      playerScoreNode.textContent = computeScore(playerCards)
      if(computeScore(playerCards) > 21){
        pot = 0;
        totalBets.textContent = pot;
        totalChips.textContent = chips;
        announcementNode.textContent = "the house always wins... you should know better..."
      }
    }else{
      var imgNode = document.createElement("IMG");
      imgNode.src = res.image
      dealerCardsNode.appendChild(imgNode);
      dealerPlays()
    }
  })
  .catch(function(err){
    console.log(err,'HIT ME');
  })
}

function dealerPlays() {
  var hiddenCard = document.querySelector('#hiddenCard');
  hiddenCard.style = "";
  playerScore = computeScore(playerCards);
  dealerScore = computeScore(dealerCards);
  dealerScoreNode.textContent = dealerScore;
  if (dealerScore < 17) {
    // a delay here because susspensesssssssss, sounds like steam escaping....
    setTimeout(()=>hitMe('dealer'), 900)
  }else if(dealerScore > 21) {
    roundWon = true;
    chips = chips + (pot*2)
    pot = 0;
    totalBets.textContent = pot;
    totalChips.textContent = chips;
    announcementNode.textContent = "You Win...but did you really??? Think about it..."
  }else if(dealerScore > playerScore) {
    roundLost = true;
    pot = 0;
    totalBets.textContent = pot;
    totalChips.textContent = chips;
    announcementNode.textContent = "the house always wins... you should know better..."
  }else if(dealerScore === playerScore) {
    roundTied = true;
    chips = chips + pot
    pot = 0;
    totalBets.textContent = pot;
    totalChips.textContent = chips;
    announcementNode.textContent = "A tie doesen't mean no one wins... it just means you postponed your loss..."
  }else{
    roundWon = true;
    chips = chips + (pot*2)
    pot = 0;
    totalBets.textContent = pot;
    totalChips.textContent = chips;
    announcementNode.textContent = "You Win...but did you really??? Think about it..."
  }
}

function endGame(){
  if(roundLost === true){

  }else if(roundTied === true){

  }else if(roundWon === true){

  }else if(chips <= 0){

  }else{

  }
}
