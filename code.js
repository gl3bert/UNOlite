// Program was created in code.org App Lab
// Sounds: code.org library
// Images: blank card images (R.png, G.png, B.png, Y.png, W.png) - created on my own; all other icons - code.org library

// initializing global variables

var deck=[]; // for all game cards
var player=[]; // player's hand
var comp=[]; // computer's hand
var current; // current game card (open card)
var currentCol; // current card color
var idxPlayer; // index of player's card displayed

// below are all functions

// sets up the game
function setup(){ 
  comp=[];
  deck=[];
  player=[];
  var colors=["Red", "Green", "Blue", "Yellow"];
  var powers=["1", "2", "3", "4", "5", "6", "7", "S", "+1"];
  for(var a=0; a<4; a++) {
    appendItem(deck, "Wild"); // appends wild cards
    appendItem(deck, "Wild +2");
    for(var c=0; c<powers.length; c++) {
        appendItem(deck, colors[a]+" "+powers[c]); // adds all other cards to the deck
    }
  }
  var idx=randomNumber(0, deck.length-1); // chooses a random starting card; keeps picking new cards if a selected card is not a number card for ease of play
  while(deck[idx]=="Wild" || deck[idx]=="Wild +2" || deck[idx].substring(deck[idx].length-1)=="S" || deck[idx].substring(deck[idx].length-2) == "+1") {
    idx=randomNumber(0, deck.length-1);
  }
  current=deck[idx];
  updateCurrentCard(current);
  draw(player, 7); // distributing cards 
  draw(comp, 7);
  idxPlayer=0; // now all UI elements are set up - player card display, buttons, messages
  updatePlayerCard(idxPlayer);
  setText("turnMessage", "Your turn!"); 
  setText("drawButton", "Draw");
  hideElement("hidePlayerUI");
  hideElement("skipTurn");
  hideElement("draw1");
  hideElement("draw2");
  showElement("deckCard");
  setProperty("deckCardLabel", "text-color", rgb(183, 216, 214));
  setProperty("deckCardLabel", "font-size", 25);
  setText("deckCardLabel", "UNO");
  setText("opponentMessage", "I am ready to start!");
}

// for drawing cards
// list {who} - either player or comp, where cards would be added
// num {num} - how many cards to add
function draw(who, num) { 
  if(deck.length==0) { // if deck empty, does nothing
    return;
  }
  else if(num<deck.length) { // appends all requested cards, if there are more cards in the deck than needed
    for(var j=1; j<=num; j++) {
      var idx=randomNumber(0, deck.length-1);
      appendItem(who, deck[idx]);
      removeItem(deck, idx);
    }
    playSound("assets/category_board_games/card_fan_2.mp3");
  }
  else if(num>=deck.length){ // if there are less cards in the deck than needed, only add what's left (to avoid errors); only executes once
    for(var i=0; i<deck.length; i++) {
      var rnd=randomNumber(0, deck.length-1);
      appendItem(who, deck[rnd]);
      removeItem(deck, rnd);
    }
    if(deck.length!=0) {
      playSound("assets/category_board_games/card_fan_2.mp3");
    }
    hideElement("deckCard"); // changes screen elements once there are no more cards left in the deck
    setText("deckCardLabel", "Empty");
    setProperty("deckCardLabel", "font-size", 12);
    setProperty("deckCardLabel", "text-color", rgb(77, 100, 102));
    setText("drawButton", "Skip");
  }
}

// updates player card display
// num {idx} - index of card in player to be displayed
function updatePlayerCard(idx) { 
  if(idx==null){ 
    idx=0;
  }
  setImageURL("playerCard", "assets\\"+player[idx].substring(0,1)+".png"); // from an image library - for every color of the background
  if(player[idx].substring(player[idx].length-2, player[idx].length-1)=="+") { // + card displays
    setText("playerCardText", player[idx].substring(player[idx].length-2));
  }
  else if(player[idx]=="Wild") { // Wild card display
    setText("playerCardText", "W");
  }
  else {
    setText("playerCardText", player[idx].substring(player[idx].length-1)); // all other cards
  }
  setText("playerCardList", player.join("\n")); // regenerates text list
  setText("cardsCount", player.length+" cards");
}

// updates current game card display
// string {crd} - name of card to to update current card display with
function updateCurrentCard(crd) { 
  if(crd=="Wild +2") {
    setText("currentCardText", "+2"); // generates text for Draw Two...
  }
  else if(crd=="Wild") {
    setText("currentCardText", "W"); // and Wild
  }
  else if(crd.substring(crd.length-2)=="+1") {
    setText("currentCardText", crd.substring(crd.length-2)); // formats +1...
    currentCol=crd.substring(0,1);
  }
  else {
    setText("currentCardText", crd.substring(crd.length-1)); // and all the rest
    currentCol=crd.substring(0,1);
  }
  setImageURL("currentCard", "assets\\"+currentCol+".png"); // sets background of appropriate color
  current=crd;
}

// checks if card sent is playable against the current game card
// string {crd} - string of the card to be checked
function check(crd) { 
  if(crd=="Wild" || crd=="Wild +2") {
    return true;
  }
  else if(crd.substring(0,1)==currentCol || crd.substring(crd.length-2)==current.substring(current.length-2)) {
    return true;
  }
  return false;
}

// computer's actions code
// num {code} - determines which condition to run (either respond to played card or continue without responding)
function ai(code) { // computer's actions
  var possible=[];
  var possibleIdx=[];
  if(code==0) { // the computer would respond to current game card (played by the user)
    if(current.substring(current.length-1)=="S") {
      setTimeout(function() { // skips if S
        setText("opponentMessage", "I skip.");
        setText("turnMessage", "Your turn!");
        hideElement("hidePlayerUI");
        }, 1000);
      return;
    }
    else if(current.substring(current.length-2)=="+1" || current.substring(current.length-2)=="+2") {
      setTimeout(function() {
        if(current.substring(current.length-1)=="1") {
          if(deck.length==0) { // if card is +1, computer skips if no cards in the deck and draws 1 if there are
            setText("opponentMessage", "I skip, no cards in the deck.");
          }
          else {
            draw(comp, 1);
            setText("opponentMessage", "I draw one card and skip.");
          }
          
        }
        else { // same thing for +2
          if(deck.length==0) {
            setText("opponentMessage", "I skip, no cards in the deck.");
          }
          else {
            draw(comp, 2);
            setText("opponentMessage", "I draw two cards and skip.");
          }
        }
        setText("turnMessage", "Your turn!");
        hideElement("hidePlayerUI");
        }, 1000); // user's turn
      return;
    }
    else {
      setText("opponentMessage", "Thinking...");
      for(var a=0; a<comp.length; a++) { // collects all possible cards and saves their indexes in the list
        if(check(comp[a])) {
          appendItem(possible, comp[a]);
          appendItem(possibleIdx, a);
        }
      }
      chooseCard(possible, possibleIdx); // computer plays if the current card was not a card that required to skip a turn
    }
  }
  else { // code is 1 - for when computer plays more than once in a row (not responding to current card's actions played by itself)
    setText("opponentMessage", "Thinking...");
    for(var b=0; b<comp.length; b++) { // collects all possible cards and saves their indexes in the list
      if(check(comp[b])) {
        appendItem(possible, comp[b]);
        appendItem(possibleIdx, b);
      }
    }
    chooseCard(possible, possibleIdx); // computer plays
  }
}

// chooses a card to play from pre-filtered list
// list {options} - strings of all playable cards from computer's hand
// list {idxs} - nums of corresponding indexes in comp for each playable card
function chooseCard(options, idxs) {
    if(comp.length==1 && check(comp[0])) { // if computer plays last card, player defeat sequence
      setTimeout(function() {
        playSound("assets/category_board_games/card_flipping.mp3");
        setText("turnMessage", "Ooopsss...");
        updateCurrentCard(comp[0]);
      }, 1000);
      setTimeout(function() {
        setScreen("defeat");
        playSound("assets/category_instrumental/marimba_downscale_1.mp3");
        setText("defMsg", "Opponent ran out of cards!");
      }, 3000);
      return;
    }
    if(options.length==0) {
        setTimeout(function() {
        if(deck.length==0) { // if computer has no playable cards, draw/skip
          setText("opponentMessage", "I skip, deck empty.");
        }
        else {
          setText("opponentMessage", "I skip and draw one card.");
          draw(comp, 1);
        }
        hideElement("hidePlayerUI");
        setText("turnMessage", "Your turn!");
        }, 1000);
        return;
    }
    setTimeout(function() {
      var choice=randomNumber(0, options.length-1); // if wild was chosen, choose color randomly
      if(options[choice]=="Wild" || options[choice]=="Wild +2") {
        var rand=randomNumber(1, 4);
        if(rand==1) {
          currentCol="R";
        }
        else if(rand==3) {
          currentCol="G";
        }
        else if(rand==2) {
          currentCol="B";
        }
        else {
          currentCol="Y";
        }
      }
      playSound("assets/category_board_games/card_flipping.mp3");
      updateCurrentCard(options[choice]); // UI elements adjusted
      setText("opponentMessage", "I played "+options[choice]+".");
      setText("turnMessage", "Your turn!");
      removeItem(comp, idxs[choice]);
      hideElement("hidePlayerUI");
      if(current.substring(current.length-2)=="+1") { // if card chosen by computer is +1,
        if(deck.length==0) {
          setText("draw1", "Skip");
          setText("opponentMessage", "I played "+options[choice]+". You skip, deck empty."); // player skips if deck empty
        }
        else {
          setText("opponentMessage", "I played "+options[choice]+". You draw one card."); // player gets a card
        }
        showElement("draw1"); // action button shown
        showElement("hidePlayerUI");
        playSound("assets/category_board_games/card_flipping.mp3");
      }
      if(current.substring(current.length-1)=="S") {
        setText("opponentMessage", "I played "+options[choice]+". You skip."); // players skips, action button
        showElement("hidePlayerUI");
        showElement("skipTurn");
      }
      if(current.substring(current.length-2)=="+2") { // same algorithm as for +1 but for +2
        if(deck.length==0) {
          setText("draw2", "Skip");
          setText("opponentMessage", "I played "+options[choice]+". You skip, deck empty.");
        }
        else {
          setText("opponentMessage", "I played "+options[choice]+". You draw two cards.");
        }
        showElement("draw2");
        showElement("hidePlayerUI");
        playSound("assets/category_board_games/card_flipping.mp3");
      }
    }, 1000);
}
// repetitive code for player's wild card color selection
function colorSelection() { 
  updateCurrentCard(player[idxPlayer]);
  removeItem(player, idxPlayer);
  idxPlayer=0;
  updatePlayerCard(0);
  setScreen("game");
  playSound("assets/category_board_games/card_dealing_single.mp3");
  showElement("hidePlayerUI");
  ai(0);
}

// below are all onEvents

onEvent("playButton", "click", function() { // player plays card
  if((check(player[idxPlayer]) && player.length-1==0)|| (player.length-1==0 && (player[idxPlayer]=="Wild" || player[idxPlayer]=="Wild +2"))){ // victory if played last card
   setScreen("victory");
   setText("winMsg", "You ran out of cards!");
   playSound("assets/category_instrumental/marimba_upscale_1.mp3");
  }
  else if(player[idxPlayer]=="Wild" || player[idxPlayer]=="Wild +2") { // to color selection screen
    setScreen("colorSelect");
  }
  else if(check(player[idxPlayer])){ // checks card, changes UI elements
   updateCurrentCard(player[idxPlayer]);
   currentCol=player[idxPlayer].substring(0,1);
   removeItem(player, idxPlayer);
   idxPlayer=0;
   updatePlayerCard(0);
   showElement("hidePlayerUI");
   setText("turnMessage", "Opponent's turn...");
   playSound("assets/category_board_games/card_dealing_single.mp3");
   ai(0);
  }
  else { // if card is not playable
   setText("playerMessage", "You can't play this card!");
   playSound("assets/category_digital/error_1.mp3");
   setTimeout(function() {
    setText("playerMessage", ""); 
   }, 1500);
  }
});

onEvent("stuckButton", "click", function() { // for use when seemingly the game can't continue
  playSound("assets/category_app/app_button_2.mp3");
  var playerCtr=0;
  var compCtr=0;
  for(var a=0; a<player.length; a++) { // counts if player has any playable cards
    if(check(player[a])) {
      playerCtr++;
    }
  }
  for(var b=0; b<comp.length; b++) { // if computer
    if(check(comp[b])) {
      compCtr++;
    }
  }
  if(playerCtr!=0 || compCtr!=0) { // if there are playable cards
    setScreen("keepPlaying");
    playSound("assets/category_digital/error_1.mp3");
    setTimeout(function() {
      setScreen("game");
    }, 1000);
  }
  else { // if not...
    if(player.length>comp.length) { // player loses if they have more cards
      setScreen("defeat");
      playSound("assets/category_instrumental/marimba_downscale_1.mp3");
      setText("defMsg", "Opponent had fewer cards left!");
    }
    else if(player.length<comp.length) { // wins if less
      setScreen("victory");
      playSound("assets/category_instrumental/marimba_upscale_1.mp3");
      setText("winMsg", "You had fewer cards left!");
    }
    else { // tie is equal
      playSound("assets/category_instrumental/marimba_music_1.mp3");
      setScreen("tie");
      setText("tieMsg", "Equal number of cards left!");
    }
  }
});

onEvent("drawButton", "click", function() { // player draw/skip button
  draw(player, 1);
  playSound("assets/category_board_games/card_fan_2.mp3");
  showElement("hidePlayerUI");
  setText("turnMessage", "Opponent's turn...");
  updatePlayerCard();
  if(current.substring(current.length-1)=="S" || current.substring(current.length-2, current.length-1)=="+"){
    ai(1);
  }
  else {
    ai(0);
  }
});

onEvent("skipTurn", "click", function() { // skip button for player - when computer plays S
  hideElement("skipTurn");
  playSound("assets/category_app/app_button_2.mp3");
  ai(1);
});

onEvent("draw1", "click", function() { // draw 1 button - when computer plays +1
  hideElement("draw1");
  draw(player, 1);
  updatePlayerCard();
  ai(1);
});

onEvent("draw2", "click", function() { // draw 2 button - when computer plays +2
  hideElement("draw2");
  draw(player, 2);
  updatePlayerCard();
  ai(1);
});

onEvent("play", "click", function() { // game sets up
  playSound("assets/category_board_games/card_fan_1.mp3");
  setup();
  setScreen("game");
});

onEvent("next", "click", function() { // next card button
  idxPlayer++;
  if(idxPlayer>=player.length) {
    idxPlayer=0;
  }
  updatePlayerCard(idxPlayer);
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("prev", "click", function() { // previous card button
  idxPlayer--;
  if(idxPlayer<0) {
    idxPlayer=player.length-1;
  }
  updatePlayerCard(idxPlayer);
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("endGame", "click", function() { // ends game, returns home, resets values
  setScreen("home");
  deck=[];
  player=[];
  comp=[];
  current="";
  playSound("assets/category_instrumental/marimba_music_1.mp3");
});

onEvent("toRules", "click", function() { // to rules screen
  setScreen("rules");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("toHome", "click", function() { // back home from rules
  setScreen("home");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("toHomeW", "click", function() { // back home from victory screen
  setScreen("home");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("toHomeL", "click", function() { // back home from losing screen
  setScreen("home");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("toHomeT", "click", function() { // back home from tie screen
  setScreen("home");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("toRulesGame", "click", function() { // to rules screen - from game
  setScreen("rulesGame");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("returnGame", "click", function() { // back to game from rules 
  setScreen("game");
  playSound("assets/category_app/app_button_2.mp3");
});

onEvent("redButton", "click", function() { // sets wild card color to red
  currentCol="R";
  colorSelection();
});

onEvent("greenButton", "click", function() { // sets wild card color to green
  currentCol="G";
  colorSelection();
});

onEvent("blueButton", "click", function() { // sets wild card color to blue
  currentCol="B";
  colorSelection();
});

onEvent("yellowButton", "click", function() { // sets wild card color to yellow
  currentCol="Y";
  colorSelection();
});

onEvent("cancelColor", "click", function() { // cancels wild card color selection
  setScreen("game");
  playSound("assets/category_app/app_button_2.mp3");
});