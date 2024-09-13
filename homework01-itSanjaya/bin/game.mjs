// game.mjs
import clear from 'clear';
import { question } from 'readline-sync';
import { readFile } from 'fs';
import * as card from '../lib/cards.mjs';

const option = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'];

let inf;
let deck1;
let deal1;
let later;
let dlist = [];
let player;
let computer;

const way = process.argv[2];

function main() {
    clear();

    if (typeof(way) !== 'undefined') {
        
        newPack();

    } 
    else {

        newDeck();

        [computer, player] = deal1.hands;

        game();

    }
}

const newDeck = () => {
    let origin;

    const old = card.deck();

    const latest = card.shuffle(old);

    deal1 = card.deal(latest);

    [deck1, origin] = card.drawUntilPlayable(latest, null);

    dlist.push(origin[0]);

    if (origin[0].rank === '8') {

        newDeck();
    }
}

const randSuit = () => {
    const rand = Math.floor(Math.random() * 4);

    return card.suits[option[rand]];
}

const gameShow = (lat, pl, n, comp, playr, pass) => {

    console.log('\t\t CR🤪 ZY 8\'S ',
        '\n-----------------------------------------------',
        `\nNext suit/rank to play: ➡️  ${lat} ⬅️`,
        '\n-----------------------------------------------',
        `\nTop of discard pile: ${pl}`,
        `\nNumber of Cards left in the deck: ${n}`,
        '\n-----------------------------------------------',
        `\n🤖✋ (computer hand): ${comp}`,
        `\n😊✋ (player hand): ${playr}`,
        `\n-----------------------------------------------`,
        `\n(passes ${pass})`);
}

const eightPlay = () => {
    console.log("CRAZY EIGHTS! You played an 8 - choose a suit",
        `\n1: ${card.suits[option[0]]}`, `\n2: ${card.suits[option[1]]}`, `\n3: ${card.suits[option[2]]}`, `\n4: ${card.suits[option[3]]}`);

    let inp = question("> ");


    if (inp === '1'){

        later = card.suits[option[0]];

    }
    else if (inp === '2'){

            later = card.suits[option[1]];

    }
    else if (inp === '3'){

            later = card.suits[option[2]];

    }
    else if (inp === '4'){

            later = card.suits[option[3]];
    }
    else{

        console.log('Invalid Input. Try it again!')
    }
    const res = { suit: later, rank: '' };

    dlist.push(res);

    console.log("You can choose to set the suit to: ", later, "\nPress ENTER to continue...");

    inp = question(' ');
}

const newPack = () => {
    readFile(way, (error, source) => {

        if (error) {

            console.log(error);
        } 
        else {

            inf = JSON.parse(source);
            deck1 = inf.deck;
            player = inf.playerHand;
            computer = inf.computerHand;
            dlist = inf.discardPile;
            later = inf.nextPlay;

            game();
        }
    });
}

const playerPlay = (player, obj) => {
    let bool = true;

    for (let i = 0; i < player.length; i++) {

        if (player[i].rank === '8' || card.matchesAnyProperty(player[i], obj)) {
            bool = false;
            break;
        }
    }

    if (!bool) {

        let bool1 = false;

        let inp;

        while (!bool1) {

            console.log(`\n\n😊 Player's turn ...`,
                `\nEnter the number you would like to play: `,);
            console.log(card.handToString(player, '\n', true));


            inp = question('> ');

            if (card.matchesAnyProperty(player[inp - 1], obj) || player[inp - 1].rank === '8' || inp > player.length - 1) {
                bool1 = true;
            } 

            else {
                console.clear();

                console.log("Invalid Input, Please enter Again!");
            }
        }

        const varb = player[inp - 1];

        player.splice(inp - 1, 1);

        dlist.push(varb);

        console.log("You Played: ", card.handToString([varb]));
        if (varb.rank === '8') {

            eightPlay();
            return;
        }

        inp = question('Press ENTER to continue... ');

    }

    else {
        console.log(`\n😊 Player's turn ...`,
            `\nYou cannot play. You do not have playeable cards`,
            `\nPress ENTER to draw cards until the cards match: `, obj.rank + ',', obj.suit + ',', '8',
            '\n.');

        question(' ');

        let withdraw;

        [deck1, withdraw] = card.drawUntilPlayable(deck1, obj);

        player.push(...withdraw);
        console.log('Cards Drawn: ', card.handToString(withdraw));
        console.log('Card Played: ', player[player.length - 1].rank + player[player.length - 1].suit);

        const varb = player[player.length - 1];

        player.splice(player.length - 1, 1);

        dlist.push(varb);

        if (varb.rank === '8') {
            eightPlay();
            return;
        }

        question('Press ENTER to Continue... ');
    }
}

const computerPlay = (computer, obj) => {

    let bool2 = true;

    for (let i = 0; i < computer.length; i++) {

        if (card.matchesAnyProperty(computer[i], obj) || computer[i].rank === '8') {
            bool2 = false;

            console.log(`\n\n🤖 Computer's turn ...`,
                `\nComputer's hand is: `,
                card.handToString(computer));

            const varb1 = computer[i];

            computer.splice(i, 1);

            console.log("Computer Plays: ", card.handToString([varb1]));

            dlist.push(varb1);

            if (varb1.rank === '8') {

                later = randSuit();
                console.log("Crazy Eights! Computer Played an 8",
                    '\nComputer chose to set the suit to: ', later);

                const varb2 = { suit: later, rank: '' };
                dlist.push(varb2);
            }

            question('Press ENTER to Continue... ');
            break;
        }
    }

    if (bool2) {

        console.log(`\n🤖 Computer's turn ...`,
            `\nComputer has no playable cards`);

        let withdraw;

        [deck1, withdraw] = card.drawUntilPlayable(deck1, obj);

        computer.push(...withdraw);
        console.log('Cards Drawn: ', card.handToString(withdraw));
        console.log('Card Played: ', computer[computer.length - 1].rank + computer[computer.length - 1].suit);

        const varb1 = computer[computer.length - 1];

        computer.splice(computer.length - 1, 1);

        dlist.push(varb1);

        if (varb1.rank === '8') {

            later = randSuit();

            console.log("Crazy Eights! Computer Played an 8",
                '\nComputer chose to set the suit to: ', later);

            const varb2 = { suit: later, rank: '' };

            dlist.push(varb2);
        }
        question('Press ENTER to Continue... ');
    }
}

const game = () => {
    let a = 0;

    const b = 2;

    while (a < b) {
        if (!player) {
            continue;
        }

        if (player.length === 0) {
            console.log("\nPlayer Wins!");
            break;

        } else if (computer.length === 0) {
            console.log("\nComputer Wins!");
            break;
        }

        const later = dlist[dlist.length - 1];

        if (dlist[dlist.length - 1].rank === '') {
            dlist.pop();
        }

        const high = dlist[dlist.length - 1].rank + dlist[dlist.length - 1].suit;
        gameShow(card.handToString([later]), high, deck1.length, card.handToString(computer), card.handToString(player), 0);

        if (a % 2 === 0) {
            playerPlay(player, later);
            clear();
        } else {
            computerPlay(computer, later);
            clear();
        }
        a++;
    }
}

main();