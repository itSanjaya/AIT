const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = ['0','A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

//Card Object
class Card{
    constructor(suit, rank){
        this.suit = suit;
        this.rank = rank;
    }
}


class Computer{
    constructor(){
        this.deck = [];
        this.score = 0;
    }
}


class Player{
    constructor(){
        this.deck = [];
        this.score = 0;
    }
}


function shuffle(mainDeck){
    const deck = [...mainDeck];
    const len = deck.length;

    for(let i = len-1; i>0; i--){
        const randm = Math.floor(Math.random() * 52);
        const variab = deck[randm];
        deck[randm] = deck[i];
        deck[i] = variab;
    }

    return deck;
}

function newDeck(){
    const nDeck = [];

    for(let i = 1; i < 14; i++){

        const c1 = new Card(suits['SPADES'], ranks[i]);
        const c2 = new Card(suits['HEARTS'], ranks[i]);
        const c3 = new Card(suits['CLUBS'], ranks[i]);
        const c4 = new Card(suits['DIAMONDS'], ranks[i]);
        nDeck.push(c1, c2, c3, c4);

    }
    return shuffle(nDeck);
}


function generateDeck(){

    const sessionDeck = newDeck();
    let deck = [];
    const fvalues = document.querySelector('#startValues');

    let inputuser = fvalues.value.trim();
    inputuser = inputuser.split(',');
    if (inputuser[0] !== ''){
        for (let i=0; i<inputuser.length; i++){   
                const card = new Card(suits['CLUBS'], (inputuser[i]));            
                deck.push(card);
        }
    }
    deck = deck.concat(sessionDeck);
    return deck;
}

function display(boolVal, player, computer, hit, stand, winner = null){

    const sessionDiv = document.querySelector(".game");

    while (sessionDiv.firstChild) {
        sessionDiv.removeChild(sessionDiv.firstChild);
        hit.innerHTML = '';
        stand.innerHTML = '';
    }

    const firstheading = document.createElement("h1");
    firstheading.style.display = 'flex';
    firstheading.style.justifyContent= 'center';

    let content = document.createTextNode(boolVal? "Computer Hand - Total: ?" : "Computer Hand - Total: " + computer.score);
    firstheading.appendChild(content);
    sessionDiv.append(firstheading);
    
    const computerDiv = document.createElement("div");
    computerDiv.style.display = 'flex';
    computerDiv.style.justifyContent = 'space-evenly';
    sessionDiv.append(computerDiv);


    computer.deck.map((v, i)=>{
        const computerCard = document.createElement("p");
        computerCard.style.minHeight = '200px';
        computerCard.style.minWidth = '130px';
        computerCard.style.background = '#eff2f5';
        computerCard.style.borderRadius = '15px';
        computerCard.style.padding = '15px';

        content = document.createTextNode(v.rank+" "+v.suit);
        computerCard.appendChild(content);

        if(i===0 && boolVal === true){
            computerCard.style.backgroundColor = 'black';
        }

        computerDiv.append(computerCard);  
    });


    const currentheading = document.createElement("h1");
    content = document.createTextNode("Player Hand - Total: "+ player.score);

    currentheading.style.display = 'flex';
    currentheading.style.justifyContent= 'center';
    currentheading.appendChild(content);
    sessionDiv.append(currentheading);

    const playerDiv = document.createElement("div");
    playerDiv.style.display = 'flex';
    playerDiv.style.justifyContent = 'space-evenly';
    sessionDiv.append(playerDiv);


    player.deck.map((v, i)=>{
        const playerCard = document.createElement("p");
        playerCard.style.minHeight = '200px';
        playerCard.style.minWidth = '130px';
        playerCard.style.background = '#eff2f5';
        playerCard.style.borderRadius = '15px';
        playerCard.style.padding = '15px';

        content = document.createTextNode(v.rank+" "+v.suit);
        playerCard.appendChild(content);
        playerDiv.append(playerCard);
    });

    
    if(boolVal){
        const buttonDiv = document.createElement("div");
        buttonDiv.style.display = 'flex';
        buttonDiv.style.justifyContent = 'center';
        sessionDiv.append(buttonDiv);

        content = document.createTextNode("Hit");
        hit.className = "hit"; 
        hit.appendChild(content);
        buttonDiv.append(hit);

        content = document.createTextNode("Stand");
        stand.className = "stand";
        stand.appendChild(content);
        stand.style.display = 'flex';
        stand.style.justifyContent = 'center';

        buttonDiv.append(stand);
    }
    else{
        const card = document.createElement("h3");
        card.style.display = 'flex';
        card.style.justifyContent = 'center';
        sessionDiv.append(card);

        if(winner === 'computer'){
            content = document.createTextNode("Player Lost (Bust!)");
            card.appendChild(content);
        }
        else if (winner === 'player'){
            content = document.createTextNode("Player Won!");
            card.appendChild(content);
        }
        else {
            content = document.createTextNode("It's a TIE!");
            card.appendChild(content);
        }
    }
}

function getWinner(computer, player, hit , stand){
    if(computer.score > 21 && player.score > 21){
        display(false, player, computer, hit, stand, 'tie');
    }
    else if (player.score > 21){
        console.log("You Lose!");
        display(false, player, computer, hit, stand, 'computer');
    }
    else if(computer.score > 21){
        console.log('Player Wins!');
        display(false, player, computer, hit, stand, 'player');
    }
    else if(computer.score === player.score){
        console.log('tie');
        display(false, player, computer, hit, stand, 'tie');
    }
}

function play(deck, computer, player){
    player.score = player.deck.map((k, i)=>{
      if(k.rank==="A"){
        return 11;
      }
      else{
        return ranks.indexOf((k.rank));
      }
    }).reduce((prev, curr)=>prev+curr, 0);

    computer.score = computer.deck.map((k, i)=>{
      if(k.rank==="A"){
        return 11;
      }
      else{
        return ranks.indexOf((k.rank));
      }
    }).reduce((prev, curr)=>prev+curr, 0);

    let playercheck = false;
    player.deck.forEach((k)=>{
      if(k.rank === 'A'){
        playercheck = true;
      }
    });

    if (player.score > 21 && (playercheck)){
        playercheck = false;
        player.score = player.score - 10;
    }

    let computercheck = false;
    computer.deck.forEach((k)=>{
      if(k.rank === 'A'){
        computercheck = true;
      }
    });

    console.log(computer.score, computercheck);
    if (computer.score > 21 && (computercheck)){
        computercheck = false;
        computer.score = computer.score - 10;
    }

    console.log(computer, player);

    const hit = document.createElement("BUTTON");
    const stand = document.createElement("BUTTON");

    display(true, player, computer, hit, stand);
    getWinner(computer, player, hit, stand);

    document.querySelector('.hit').addEventListener("click", function(evt){       
        const variab = deck.shift();
        player.deck.push(variab);
        player.score = player.deck.map((k, i)=>{
          if(k.rank==="A"){
            return 11;
          }
          else{
            return ranks.indexOf((k.rank));
          }
        }).reduce((prev, curr)=>prev+curr, 0);

        player.deck.forEach((k)=>{if(k.rank === 'A'){playercheck = true;}});
        if (player.score > 21 && (playercheck)){
            playercheck = false;
            player.score = player.score - 10;
        }

        display(true, player, computer, hit, stand);
        getWinner(computer, player, hit, stand);
    });

    document.querySelector('.stand').addEventListener("click", function(evt){
        document.querySelector('.hit').display = 'none';
        document.querySelector('.stand').display = 'none';

        while(computer.score < 21){
            const variab = deck.shift();
            computer.deck.push(variab);
            computer.score = computer.deck.map((k, i)=>{
              if(k.rank==="A"){
                return 11;
              }
              else{
                return ranks.indexOf((k.rank));
              }
            }).reduce((prev, curr) => prev+curr, 0);
            
            computer.deck.forEach((k)=>{if(k.rank === 'A'){computercheck = true;}});
            if (computer.score > 21 && (computercheck)){
                computercheck = false;
                computer.score = computer.score - 10;
            }            

            display(true, player, computer, hit, stand);
            getWinner(computer, player, hit, stand);
        } 
    });
}


function main(){
    document.querySelector('.playBtn').addEventListener('click', (err)=>{
        err.preventDefault();

        document.querySelector('.start').style.display = "none";

        const computer = new Computer();
        const player = new Player();
        const gdeck = generateDeck();

        computer.deck.push(gdeck.shift());
        player.deck.push(gdeck.shift());
        computer.deck.push(gdeck.shift());
        player.deck.push(gdeck.shift());

        play(gdeck, computer, player);
    });
}

document.addEventListener('DOMContentLoaded', main);