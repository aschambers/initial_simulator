var charmander = {
	name: "Charmander",
	health: 100,
	level: 50,
	effect: null,
	// array of objects (key -> value)
	move: [{
		name: "Ember",
		type: "Attack",
		power: 20,
		accuracy: 1
	},
	{
		name: "Scratch",
		type: "Attack",
		power: 10,
		accuracy: .95
	},
	{
		name: "Leer",
		type: "Defense",
		power: 0,
		accuracy: 1
	},
	{
		name: "Growl",
		type: "Defense",
		power: 0,
		accuracy: 1
	}]
};

var pikachu = {
	name: "Pikachu",
	health: 100,
	level: 50,
	effect: null,
	// array of objects (key -> value)
	move: [{
		name: "Thunder Shock",
		type: "Attack",
		power: 20,
		accuracy: 0.5
	},
	{
		name: "Thunder Wave",
		type: "Attack",
		power: 25,
		accuracy: 0.5
	},
	{
		name: "Tail Whip",
		type: "Defense",
		power: 20,
		accuracy: 0.5
	},
	{
		name: "Growl",
		type: "Defense",
		power: 10,
		accuracy: 0.5
	}]
};

// create state machine (just like a light switch, turns on and off)

// declare global variables
var currentState;
var enemyPokemon;
var userPokemon;
var attackingMove;
var defensiveMove;

// whenever opposing pokemon has a turn, what happens??
// once it hits setUpEnemyMove, we set up enemy chatbox, then call prepare to attack (show move).
// then we call get accuracy and if accurate it will attack and get move type, if not 
// it will switch to players turn so players turn can run through. 
// in attacking move function, see if it has effect and update health bar, and run loop function. 
var enemyTurn = {
	play: function() {
		// when the enemy has a turn, what is going to happen??
		// math.random randomly selects a number between 0 and 1, so we multiply by 4 because of 4 attacking moves.
		var randomMove = Math.floor(Math.random() * 4);
		// create variable so we can use this random move by passing it in, sets the variable globally inside
		// enemy turn variable. 
		var currentEnemyMove = enemyPokemon.move[randomMove];
		// sets up chat box to say: "What will pikachu do?", where pikachu is the name of enemy pokemon.
		
		// sets up field effects, chat-text, pokemon animation, etc, based on functions below.
		var setUpEnemyField = function () {
			$('#chat-text').text("What will " + enemyPokemon.name + " do?");
			$(document).ready(prepareToAttack);
		};

		// this animates pikachu on page load, move up 25 pixels, then down 25 pixels.
		// note: this function can be before var setUpEnemyField function.
		var prepareToAttack = function() {
			$("#pikachu").animate({
				top: "-=25",
			}, 200, function() {
				$("#pikachu").animate({
					top: "+=25",
				}, 200)
			});
			// call getAccuracy, and make sure it gets called. 
			$(document).ready(getAccuracy);
		};

		// move accuracy function, will the pokemon accurately place a hit.
		var getAccuracy = function() {
			// set accuracy to a number between 0 and 1.
			var setAccuracy = Math.random();
			// if the setAccuracy <= current move (we have access to that )
			// references var currentEnemyMove. 
			if (setAccuracy <= currentEnemyMove.accuracy) {
				$("#chat-text").text(enemyPokemon.name + " used " + currentEnemyMove.name + "!");
				// now we call getMoveType if move hit.
				$(document).ready(getMoveType);
			} else {
				$("#chat-text").text(enemyPokemon.name + " missed with " + currentEnemyMove.name + "!");
				// switch state to player turn, since move missed.
				currentState = playerTurn;
				// wait a whole 1.5 seconds and then call loop function which changes the turn. 
				setTimeout(loop, 1500);
			}
		};

		// if enemy move did not miss, execute this function.
		var getMoveType = function () {
			// every time move is successful, we will see (showMoveAnimation) come in.
			$(document).ready(showMoveAnimation);
			if(currentEnemyMove.type == "Attack") {
				setTimeout(attackingMove, 1500);
			} else {
				setTimeout(defensiveMove, 1500);
			}
		};

		// show animation if enemy attack hits.
		var showMoveAnimation = function () {
			// if attack hits, uses enemy-attack-img class in stylesheet.css
			$("#attack-img").addClass("enemy-attack-img");
			$("#attack-img").removeClass("hide");
			$("#attack-img").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
		};

		// set up attacking move function, if randomized move is an attack type move. (ATTACK MOVE).
		var attackingMove = function() {
			// add hide class so it's not showing when it's charmander's turn.
			$("#attack-img").addClass("hide");
			// remove class, so when player position is changed, it's back to how it was in the beginning.
			$("#attack-img").removeClass("enemy-attack-img");
			// if not enemy pokemon effect.
			if (!enemyPokemon.effect) {
				// no adverse effect to our power, so our power would be deducted. 
				userPokemon.health -= currentEnemyMove.power;
			} else {
				// if there is an adverse affect move previous pokemon gave off.
				userPokemon.health -= (currentEnemyMove.power) - (currentEnemyMove.power * enemyPokemon.effect);
				// set to null so pokemon doesn't get hit with it again.
				enemyPokemon.effect = null;
			}
			$("#user-health-bar").css("width", userPokemon.health + "%");
			// change turn to players turn.
			currentState = playerTurn;
			// call loop function.
			$(document).ready(loop);
		};

		var defensiveMove = function () {
			// add hide class so it's not showing when it's charmander's turn.
			$("#attack-img").addClass("hide");
			// remove class, so when player position is changed, it's back to how it was in the beginning.
			$("#attack-img").removeClass("enemy-attack-img");
			// set effect on opposing player's effect.
			userPokemon.effect = currentEnemyMove.power;
			// passing turn over to player
			currentState = playerTurn;
			// call loop function to make check, and continue to play with player's turn.
			$(document).ready(loop);
			// END OF OPPOSING PLAYER'S TURN //
		};

		$(document).ready(setUpEnemyField);
	}
};

// whenever you have a turn, what happens.
var playerTurn = {
	play: function() {
		// initiate variable.
		var currentUserMove;

		var setUpUserField = function() {
			// first thing we need to do is change the text of move, dynamic instead of static.
			// set up an array of buttons, edit text of button.
			var moveButtons = ["#move1-text", "#move2-text", "#move3-text", "#move4-text"];
			// remove the hide class if it's players turn ..
			$("#user-buttons").removeClass("hide");
			$("#chat-text").text("What will " + userPokemon.name + " do?");
			// add in text via object using name key with for loop.
			// sets up button name with for loop.
			for(var i = moveButtons.length - 1; i >= 0; i--) {
				$(moveButtons[i]).text(userPokemon.move[i].name);
			}
		};

		// pretty much the same function's as opposing pokemon's moves from here.. and stopping at moves with unbind.
		// this animates charmander on page load, move up 25 pixels, then down 25 pixels.
		// note: this function can be before var setUpEnemyField function.
		var prepareToAttack = function() {
			// need to add something at top to hide buttons.
			$("#user-buttons").addClass("hide");


			$("#charmander").animate({
				top: "-=25",
			}, 200, function() {
				$("#charmander").animate({
					top: "+=25",
				}, 200)
			});
			// call getAccuracy, and make sure it gets called. 
			$(document).ready(getAccuracy);
		};

		// move accuracy function, will the pokemon accurately place a hit.
		var getAccuracy = function() {
			// set accuracy to a number between 0 and 1.
			var setAccuracy = Math.random();
			// if the setAccuracy <= current move (we have access to that )
			// references var currentEnemyMove. 
			if (setAccuracy <= currentUserMove.accuracy) {
				$("#chat-text").text(userPokemon.name + " used " + currentUserMove.name + "!");
				// now we call getMoveType if move hit.
				$(document).ready(getMoveType);
			} else {
				$("#chat-text").text(userPokemon.name + " missed with " + currentUserMove.name + "!");
				// switch state to player turn, since move missed.
				currentState = enemyTurn;
				// wait a whole 1.5 seconds and then call loop function which changes the turn. 
				setTimeout(loop, 1500);
			}
		};

		// if enemy move did not miss, execute this function.
		var getMoveType = function () {
			// every time move is successful, we will see (showMoveAnimation) come in.
			$(document).ready(showMoveAnimation);
			if(currentUserMove.type == "Attack") {
				setTimeout(attackingMove, 1500);
			} else {
				setTimeout(defensiveMove, 1500);
			}
		};

		// show animation if enemy attack hits.
		var showMoveAnimation = function () {
			// if attack hits, uses enemy-attack-img class in stylesheet.css
			$("#attack-img").addClass("user-attack-img");
			$("#attack-img").removeClass("hide");
			$("#attack-img").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
		};

		// set up attacking move function, if randomized move is an attack type move. (ATTACK MOVE).
		var attackingMove = function() {
			// add hide class so it's not showing when it's charmander's turn.
			$("#attack-img").addClass("hide");
			// remove class, so when player position is changed, it's back to how it was in the beginning.
			$("#attack-img").removeClass("user-attack-img");
			// if not enemy pokemon effect.
			if (!userPokemon.effect) {
				// no adverse effect to our power, so our power would be deducted. 
				enemyPokemon.health -= currentUserMove.power;
			} else {
				// if there is an adverse affect move previous pokemon gave off.
				enemyPokemon.health -= (currentUserMove.power) - (currentUserMove.power * userPokemon.effect);
				// set to null so pokemon doesn't get hit with it again.
				userPokemon.effect = null;
			}
			$("#enemy-health-bar").css("width", enemyPokemon.health + "%");
			// change turn to players turn.
			currentState = enemyTurn;
			// call loop function.
			$(document).ready(loop);
		};

		var defensiveMove = function () {
			// add hide class so it's not showing when it's charmander's turn.
			$("#attack-img").addClass("hide");
			// remove class, so when player position is changed, it's back to how it was in the beginning.
			$("#attack-img").removeClass("enemy-attack-img");
			// set effect on opposing player's effect.
			enemyPokemon.effect = currentUserMove.power;
			// passing turn over to player
			currentState = playerTurn;
			// call loop function to make check, and continue to play with player's turn.
			$(document).ready(loop);
			// END OF OPPOSING PLAYER'S TURN //
		};

		// create jquery item to find out when buttons are clicked.
		// we need unbind (took like a day because didn't know what was going on, needed to add it),
		// because the next time we click it, it's still binded and will call it 2 times, then 4 times, etc.
		$("#move1-button, #move2-button, #move3-button, #move4-button").unbind().click(function () {
			// find out which button was clicked. (add attribute on divs for move buttons).
			// this is a special keyword in javascript and means whichever selector was chose 
			// such as move3 or move4, etc. 
			var move = $(this).attr("value");
			// console.log("Click");
			currentUserMove = userPokemon.move[move];
			$(document).ready(prepareToAttack);
		});
		// call function setUpUserField, instantiate it.
		$(document).ready(setUpUserField);
	}
};

// check to see if a pokemon is dead.
var loop = function () {
	if (enemyPokemon.health <= 0 || userPokemon.health <= 0) {
		// shows hidden GAME-OVER text.
		$("#game-over").removeClass("hide");
		console.log("Game Over");
	} else {
		currentState.play();
	}
};

// create init function setting rival name and level, user name and level where we are the first person to play (current state).
var init = function() {
	enemyPokemon = pikachu;
	userPokemon = charmander;
	// div with id rival-name will have text equal to enemyPokemon (name of that object).
	$("#rival-name").text(enemyPokemon.name);
	$("#rival-level").text("lvl " + enemyPokemon.level);
	$("#user-name").text(userPokemon.name);
	$("#user-level").text("lvl " + userPokemon.level);
	// first persons turn.
	currentState = playerTurn;
	loop();
};

// call init function
$(document).ready(init);


















