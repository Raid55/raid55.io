

//card constructor
function Card(value,name,suit){
  this.value = value;
  this.name = name;
  this.suit = suit;
}
//create deck
function deck(howMany){
	this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K','A'];
	this.suits = ['H','D','S','C'];
	var cards = [];
  for(var x = howMany; x > 0; x--){
    for( var i = 0; i < this.suits.length; i++ ) {
      for( var n = 0; n < this.names.length; n++ ) {
        var value;
        if(this.names[n] == 'A'){
          value = 11;
        }else if(this.names[n] === 'J'||this.names[n] ==='Q'||this.names[n] ==='K'){
          value= 10;
        }else{
          value= n+1;
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
  var stack = deck(howMany)
  for (i = stack.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = stack[i]
    stack[i] = stack[j]
    stack[j] = temp
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
  if(player[0] == null || player[1] == null || dealer[0] == null || dealer[1] == null ){
    start()
  }
  return [player,dealer]
}
//function reders initial html classes to remember, 'card' and 'count'
function renderInitHTML(game){
  var dealer1Html;
  var dealer2Html;
  var playa1Html;
  var playa2Html;
  dealer1Html = `<img class="card" src="./images/cards/`+game[1][0].names+game[1][0].suits+`.svg" alt="">`
  dealer2Html = `<img class="card" src="./images/cards/Red_Back.svg" alt="">
  <div class="count">The dealer has: `+game[1][0].value+`</div>`
  playa1Html =`<img class="card" src="./images/cards/`+game[0][0].names+game[0][0].suits+`.svg" alt="">`
  playa2Html =`<img class="card" src="./images/cards/`+game[0][1].names+game[0][1].suits+`.svg" alt="">
  <div class="count">You have: `+game[0][0].value+game[0][1].value+`</div>`
}
//this functions plays and takes the dealt game
function play(game){

}
//main function that resests the game and will incorporate everything
function start(howMany){
  var decks = superShuffle(howMany)

}
