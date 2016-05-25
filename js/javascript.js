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
		accuracy: 1
	},
	{
		name: "Thunder Wave",
		type: "Attack",
		power: 0,
		accuracy: 1
	},
	{
		name: "Tail Whip",
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

// create state machine (just like a light switch, turns on and off)

// declare variable for state machine.
var currentState;
var enemyPokemon;
var userPokemon;

// whenever opposing pokemon has a turn, what happens.
var enemyTurn = {
	play: function() {
		// when the enemy has a turn, what is going to happen??
		// math.random randomly selects a number between 0 and 1, so we multiply by 4 because of 4 attacking moves.
		var randomMove = Math.floor(Math.random() * 4);
		// create variable so we can use this random move by passing it in. 
		var currentEnemyMove = enemyPokemon.moves[randomMove];

		// sets up chat box to say: "What will pikachu do?", where pikachu is the name of enemy pokemon.
		var setUpEnemyField = function () {
			$('#chat-text').text("What will " + enemyPokemon.name + " do?");
		};
	};
};

// whenever you have a turn, what happens.
var playerTurn = {
	play: function() {

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


















