// cards.mjs
const ranks = ['0','A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};

//Card Object
class Card{
    constructor(suit, rank){

        this.suit = suit;
        this.rank = rank;
    }
}

//Function Range
const range = (start, end, inc) => {

    if(typeof(end) === 'undefined'){

        end = start;
        start = 0;

    }
    if(typeof(inc)==='undefined'){

        inc = 1;
    }

    if ((inc > 0 && start >= end) || (inc < 0 && start <= end) || (inc===0)) {

        return [];

    }

    const arrNum = [];

    for (let i = start; (inc > 0 ? i < end : i > end); i = i + inc){

        arrNum.push(i);
    }
    return arrNum;
}

//Function Deck Generate
const deck = () => {

    const Pack = [];

    for(let i = 1; i < 14; i++){

        const card1 = new Card(suits['SPADES'], ranks[i]);
        const card2 = new Card(suits['HEARTS'], ranks[i]);
        const card3 = new Card(suits['CLUBS'], ranks[i]);
        const card4 = new Card(suits['DIAMONDS'], ranks[i]);
        Pack.push(card1, card2, card3, card4);

    }

    return Pack;
}

//Shuffling
const shuffle = (deck) => {

    const pack = [...deck];

    const len = pack.length;

    for(let i = len -1; i > 0; i--){

        const randomm = Math.floor(Math.random() * 52);
        const res = pack[randomm];

        pack[randomm] = pack[i];
        pack[i] = res;

    }

    return pack;
}

//Function Deal
const deal = (cardsArray, numHands = 2, cardsPerHand = 5) => {
    let onebyone = 0;

    const contestants = [];


    for(let i=0; i<numHands; i++){

        contestants.push([]);
    }

    const len = cardsArray.length - 1, end=numHands*cardsPerHand;

    const pack = [...cardsArray];

    for(let i=len; i>len-end; i--){
      
        if(onebyone < numHands){

            contestants[onebyone].push(pack.pop());
        }
        
        else{
            onebyone = 0;

            contestants[onebyone].push(pack.pop());
        }
        onebyone++; 
    }

    return {deck:pack, hands:contestants}; 
}

//Function Draw 
const draw = (cardsArray, n =1) => {
    const len = cardsArray.length - 1;

    const ans = [...cardsArray];

    const cardR = [];


    for(let i=len; i>len-n; i--){

        cardR.push(ans.pop());
    }

    return [ans,cardR];
}

// Function HandtoString
const handToString = (hand, sep='  ', numbers = false) => {
    let ans = "";

    for(let i=0; i<hand.length;i++){

            if(!numbers && hand.length!==1){

                ans += hand[i].rank + hand[i].suit;

                if(i+1<hand.length){

                    ans = ans+sep;
                }

            }
            
            else if(!numbers && hand.length===1){

                ans += hand[i].rank + hand[i].suit;
            }

            else{
                ans += String(i+1) + ': ' + hand[i].rank + hand[i].suit;

                if(i+1<hand.length){

                    ans = ans+sep;
                }
            }        
    }

    return ans;
}

//Function DrawuntilPlayable 
const drawUntilPlayable = (deck, matchObj=null) => {

    const pack = [...deck];
    const play = [];
    const lenn = deck.length;

    if(matchObj === null){

            play.push(pack.pop());
            return [pack, play];
        }

    for(let i=lenn-1; i>-1; i--){

        if(deck[i].rank==='8' || matchesAnyProperty(deck[i],matchObj)){

            play.push(pack.pop());
            break;
        }

        play.push(pack.pop());
        
    }

    return [pack, play];

}

//Function MatchesanyProperty 
const matchesAnyProperty = (obj, matchObj) => {

    const mapped = new Map();

    const objfir = Object.keys(obj);

    const objsec = Object.keys(matchObj);

    for(let i=0; i<objfir.length; i++){
        if(mapped.has(objfir[i])){
            mapped.set(objfir[i],mapped.get(objfir[i]) + 1);
        }
        else{
            mapped.set(objfir[i],1);
        }
    }

    for(let i=0; i<objsec.length;i++){
        if(mapped.has(objsec[i])){
            mapped.set(objsec[i],mapped.get(objsec[i]) + 1);
        }
        else{
            mapped.set(objsec[i],1);
        }
    }

    for (const [key, value] of mapped) {
        
        if(value>1){
            if(obj[key]===matchObj[key]){
                return true;
            }
        }
      }
    return false;
}

//Exporting Module
export {
    suits,
    range,
    deck,
    shuffle,
    deal,
    draw,
    handToString,
    drawUntilPlayable,
    matchesAnyProperty
};