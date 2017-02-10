
//card constructor
function Card(value,name,suit){
  this.value = value;
  this.name = name;
  this.suit = suit;
}
//create deck
function deck(howMany){
	this.names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K','A'];
	this.suits = ['H','D','S','C'];
	var cards = [];
  for(var x = howMany; x > 0; x--){
    for( var i = 0; i < this.suits.length; i++ ) {
      for( var n = 0; n < this.names.length; n++ ) {
        var value;
        if(this.names[n] == 'A'){
          value = 1;
        }else if(this.names[n] === 'J'||this.names[n] ==='Q'||this.names[n] ==='K'){
          value= 10;
        }else{
          value = Number(this.names[n]);
        }
        cards.push( new Card(value,this.names[n], this.suits[i] ) );
      }
    }
  }
  return cards;
}
//BROUGHT TO YOU BY Fisher-Yates HIMSELF!!! he came to my house around 1am and showed me the light..lolololololo
function superShuffle(howMany) {
  var i = 0
  var j = 0
  var temp = null
  var stack = deck(6)
  for(var x = 0; x<howMany;x++){
    for (i = stack.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = stack[i]
      stack[i] = stack[j]
      stack[j] = temp
    }
  }
  return stack
}
//deal card and takes it outta tha deck
function dealCard(stack) {
  if (stack.length > 0)
    return stack.shift();
  else
    return null;
}

//deals and makes a game
function deal(stack){
  var player=[];
  var dealer=[];
  //deals cards to dealer and player
  player.push(dealCard(stack));
  dealer.push(dealCard(stack));
  player.push(dealCard(stack));
  dealer.push(dealCard(stack));
  //checks if any card is null...meaning the end of the pack...meaning you are crazy for playing 6 decks...
  if(player[0] === null || player[1] === null || dealer[0] === null || dealer[1] === null ){
    start()
  }
  return [player,dealer]
}
//function reders initial html classes to remember, 'card' and 'count'


//waits for user to choose
function waitForInput(){
  return new Promise(function(resolve, reject){
    var stand = document.getElementById("stand");
    var hit = document.getElementById("hitme");
    stand.addEventListener("click",function(e){
      resolve('stand')
    },false);
    hit.addEventListener("click",function(e){
      resolve('hit')
    },false);
  })
}

function hitMe(game,decks){
  game[0].push(dealCard(decks))
  var val = game[0].reduce(function(accu,el,indx){
    return accu.value + el.value
  })
  if(val > 21 && game[0].indexOf('A') != -1){
    game[0][game[0].indexOf('A')] = 11
  }
  if(val === 21){
    stand(game,stack,pVal)
  }else if(val < 21){
    document.getElementById('board').innerHTML = renderGameHtml(game)
    waitForInput()
    .then(function(res){
      if(res === 'hit'){
        hitMe(game,decks)
      }else{
        stand(game,decks)
      }
    })
  }else{
    bust(game,decks)
  }
}
function stand(game,decks,pVal){
  var dVal = game[1].reduce(function(accu,el,indx){
    return accu.value + el.value
  })
  if(dVal < 17){
    game[1].push(dealCard(decks))
    stand(game,decks)
  }else{
    if(dVal === pVal){
      document.getElementById('board').innerHTML = renderTieHtml(game)
    }else if(dVal > pVal && dVal <= 21){
      document.getElementById('board').innerHTML = renderLossHtml(game)
    }else{
      document.getElementById('board').innerHTML = renderWinHtml(game)
    }
  }
}
function bust(game,decks){
document.getElementById('board').innerHTML =  renderLossHtml(game)
}
//this functions plays and takes the dealt game
function play(decks){
  var game = deal(decks)
  var val = game[0].reduce(function(accu,el,indx){
    return accu.value + el.value
  })
  if(val === 21){
    document.getElementById('board').innerHTML = renderWinHtml(game)
  }
  document.getElementById('board').innerHTML = renderInitHTML(game)
  waitForInput()
  .then(function(res){
    if(res === 'hit'){
      hitMe(game,decks)
    }else{
      stand(game,decks)
    }
  })
}
//main function that resests the game and will incorporate everything
function start(){
  var howMany = document.getElementById('howManyTimes').value
  if(howMany < 1){
    howMany = 1;
  }else if(howMany > 124){
    howMany = 124;
  }else{
    howMany = 1
  }
  var decks = superShuffle(howMany)
  play(decks)
}

//ALL html render functions... to be replaced with something betta

function renderInitHTML(game){
  var dealer1Html;
  var dealer2Html;
  var dCount;
  var pCount;
  var playa1Html;
  var playa2Html;
  dealer1Html = `<img class="card" src="../images/cards/`+game[1][0].name+game[1][0].suit+`.svg" alt="">`
  dealer2Html = `<img class="card" src="../images/cards/Red_Back.svg" alt="">`
  dCount = game[1][0].value
  playa1Html =`<img class="card" src="../images/cards/`+game[0][0].name+game[0][0].suit+`.svg" alt="">`
  playa2Html =`<img class="card" src="../images/cards/`+game[0][1].name+game[0][1].suit+`.svg" alt="">`
  pCount = game[0][0].value+game[0][1].value
  return `<div class="flex">
            <span>`+dealer1Html+`</span>
            <span>`+dealer2Html+`</span>
          </div>
          <div class="flex count countdealer">Dealer count: `+dCount+`</div>
          <div class="flex count countplayer">Your count: `+pCount+`</div>
          <div class='flex'>
            <span>`+playa1Html+`</span>
            <span>`+playa2Html+`</span>
          </div>
          <div class='flex'>
            <span class="playTheGame">
              <button type="button" class="btn btn-danger" id="stand" style="margin-top: 10px">stand like a little b****</button>
              <button type="button" class="btn btn-success" id="hitme" style="margin-top: 10px">HIT IT LIKE A MAN WOULD!</button>
            </span>
          </div>`
}
// returns if playa did not go voer 21
function renderGameHtml(game){
  var dealer1Html;
  var dealer2Html;
  var dCount;
  var pCount = 0;
  var playerHtml;
  dealer1Html = `<img class="card" src="../images/cards/`+game[1][0].name+game[1][0].suit+`.svg" alt="">`
  dealer2Html = `<img class="card" src="../images/cards/Red_Back.svg" alt="">`
  dCount = game[1][0].value
  // playa1Html =`<img class="card" src="../images/cards/`+game[0][0].name+game[0][0].suit+`.svg" alt="">`
  // playa2Html =`<img class="card" src="../images/cards/`+game[0][1].name+game[0][1].suit+`.svg" alt="">`
  for(var i =0; i < game[0].length;i++){
    playerHtml += `<span><img class="card" src="../images/cards/`+game[0][i].name+game[0][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[0][i].value
  }
  return `<div class="flex">
            <span>`+dealer1Html+`</span>
            <span>`+dealer2Html+`</span>
          </div>
          <div class="flex count countdealer">Dealer count: `+dCount+`</div>
          <div class="flex count countplayer">Your count: `+pCount+`</div>
          <div class='flex'>
            `+playerHtml+`
          </div>
          <div class='flex'>
            <span class="playTheGame">
              <button type="button" class="btn btn-danger" id="stand" style="margin-top: 10px">Let's play</button>
              <button type="button" class="btn btn-success" id="hitme" style="margin-top: 10px">Let's play</button>
            </span>
          </div>`
}

function renderLossHtml(game) {
  var dealerHtml;
  var dCount;
  var pCount = 0;
  var playerHtml;
  for(var i =0; i < game[1].length;i++){
    dealerHtml += `<span><img class="card" src="../images/cards/`+game[1][i].name+game[1][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[1][i].value
  }
  dCount = game[1][0].value
  // playa1Html =`<img class="card" src="../images/cards/`+game[0][0].name+game[0][0].suit+`.svg" alt="">`
  // playa2Html =`<img class="card" src="../images/cards/`+game[0][1].name+game[0][1].suit+`.svg" alt="">`
  for(var i =0; i < game[0].length;i++){
    playerHtml += `<span><img class="card" src="../images/cards/`+game[0][i].name+game[0][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[0][i].value
  }
  return `<div class="flex">
            `+dealerHtml+`
          </div>
          <div class="flex count countdealer">Dealer count: `+dCount+`</div>
          <div class="flex count countplayer">Your count: `+pCount+`</div>
          <div class='flex'>
            `+playerHtml+`
          </div>
          <div class='flex'>
            <span><h1>BUST</h1></span>
            <span>
            <button type="button" class="btn btn-danger" onclick="start()" style="margin-top: 10px">play AGUAIN</button>
            </span>
          </div>`
}

function renderTieHtml(game) {
  var dealerHtml;
  var dCount;
  var pCount = 0;
  var playerHtml;
  for(var i =0; i < game[1].length;i++){
    dealerHtml += `<span><img class="card" src="../images/cards/`+game[1][i].name+game[1][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[1][i].value
  }
  dCount = game[1][0].value
  // playa1Html =`<img class="card" src="../images/cards/`+game[0][0].name+game[0][0].suit+`.svg" alt="">`
  // playa2Html =`<img class="card" src="../images/cards/`+game[0][1].name+game[0][1].suit+`.svg" alt="">`
  for(var i =0; i < game[0].length;i++){
    playerHtml += `<span><img class="card" src="../images/cards/`+game[0][i].name+game[0][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[0][i].value
  }
  return `<div class="flex">
            `+dealerHtml+`
          </div>
          <div class="flex count countdealer">Dealer count: `+dCount+`</div>
          <div class="flex count countplayer">Your count: `+pCount+`</div>
          <div class='flex'>
            `+playerHtml+`
          </div>
          <div class='flex'>
            <span><h1>TIE!!!</h1></span>
            <span>
            <button type="button" class="btn btn-danger" onclick="start()" style="margin-top: 10px">play AGUAIN</button>
            </span>
          </div>`
}


function renderWinHtml(game) {
  var dealerHtml;
  var dCount;
  var pCount = 0;
  var playerHtml;
  for(var i =0; i < game[1].length;i++){
    dealerHtml += `<span><img class="card" src="../images/cards/`+game[1][i].name+game[1][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[1][i].value
  }
  dCount = game[1][0].value
  // playa1Html =`<img class="card" src="../images/cards/`+game[0][0].name+game[0][0].suit+`.svg" alt="">`
  // playa2Html =`<img class="card" src="../images/cards/`+game[0][1].name+game[0][1].suit+`.svg" alt="">`
  for(var i =0; i < game[0].length;i++){
    playerHtml += `<span><img class="card" src="../images/cards/`+game[0][i].name+game[0][i].suit+`.svg" alt=""></span>`
    pCount = pCount + game[0][i].value
  }
  return `<div class="flex">
            `+dealerHtml+`
          </div>
          <div class="flex count countdealer">Dealer count: `+dCount+`</div>
          <div class="flex count countplayer">Your count: `+pCount+`</div>
          <div class='flex'>
            `+playerHtml+`
          </div>
          <div class='flex'>
            <span><h1>WIN</h1></span>
            <span>
            <button type="button" class="btn btn-danger" onclick="start()" style="margin-top: 10px">play AGUAIN</button>
            </span>
          </div>`
}
