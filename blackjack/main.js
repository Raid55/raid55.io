

//card constructor
function Card(value,name,suit){
  this.value = value;
  this.name = name;
  this.suit = suit;
}
//create deck
function deck(howMany){
	this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K','A'];
	this.suits = ['Hearts','Diamonds','Spades','Clubs'];
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
function superShuffle() {
  var i = 0
  var j = 0
  var temp = null
  var stack = deck(6)
  for (i = stack.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = stack[i]
    stack[i] = stack[j]
    stack[j] = temp
  }
  return stack
}
// console.log(deck(2));
console.log(superShuffle());
