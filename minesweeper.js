var rowAmount = 10; //total amount of rows
var columnAmount = 10; //isn't it obvious?
var cellAmount; //amount of cells (assigned after <table> is built)
var bombAmount = 10; //amount of bombs
var bomb = []; //array of bomb locations
var gameOn = false; //sorry gotta press start
var alreadyFlipped = []; //initialize array needed for not repeating expand(?) :implement next
var flagged = []; //array to keep track of flagged squares

function write() {
	
document.getElementById("grid").innerHTML = ""; 	//empty table ( dont make multiple games)
var gameBox = ""; //gamebox initlazation

//write rows
for ( i = 0 ; i < rowAmount ; i++ ) {
	gameBox += "<tr>";
		//write cells
		for ( var j = 0 ; j < columnAmount ; j++ ) {
			var idValue = ( i * columnAmount ) + j; //produce id value
			gameBox += "<td class = 'box' id = '" + idValue + "' ></td>"; //write cell
		}
	gameBox += "</tr>";
}

cellAmount = rowAmount * columnAmount; //assign cellAmount
document.getElementById("grid").innerHTML = gameBox; //now to actually write it
}

function writeBombs() {
	
	//assign bombs as numbers within the cell range
	for ( var i = 0; i < bombAmount; i++ ) {
		reassign(i);
	}
 
	//haha i can cheat (for debugging)
	bomb.sort(function(a,b){return a-b});
	console.log(bomb);
}
	
function reassign(i) {
	
	//find a new number that wasent used yet
	var number = Math.floor( Math.random() * ( cellAmount - 1 ) );//produce random number ( based on amount of cells in the game )
	
	//check if its already a bomb value if yes reassign
	if( bomb.indexOf(number) >= 0 ) {
		reassign(i);
	//if not cool lets move on
	} else {
		bomb[i] = number;
	}		
}

function regStart() {
	start();
}

function start() {
	
	//reset
	gameOn = true;
	write();
	writeBombs(); 
	
	//clear text under start button
	document.getElementById("youSuck").innerHTML = "";
	document.getElementById("youRock").className = "hidden"; 
	
	alreadyFlipped = []; //clear flipped counter
	$("#flipped").html(alreadyFlipped.length);
	
	flagged = []; //reset the flagged array
	
	//revealBombs();//debugging

/*	//start the timer
	timePast = speedSweep?30:0;
	window.clearTimeout(timoutID);
	timoutID = setTimeout(timer, 1000);
*/	
	
	
}

//handles box click
$(document).on("mousedown","td", function(event) {

	if (gameOn) {

		event.preventDefault();
		var clicked = event.target;

		if (clicked.className != "box") {return;}
		
		if ( event.which == "3" ) {
		flag( parseInt(clicked.id,10) );
		return;
		}

		//run bombcheck functions if you havent lost yet and box isnt flagged
		if (  flagged.indexOf( parseInt(clicked.id,10) ) == -1 && 
			bombCheck(clicked) 
		) {
		//flip function
		//check nearby function
		//(flip touchin function)
		//check win
		}
	
	}
	//display these messages if game isnt in progress
	else {
		document.getElementById("youSuck").innerHTML = "PRESS START BUTTON TO START";
	} 
});

function bombCheck(event) {
	
	var boxNum = parseInt(event.id,10);
	
	//check if you clicked a bomb
	if ( bomb.indexOf(boxNum) >= 0 ) {
		//show and style as bomb
		event.innerHTML = "B";
		event.className = "bomb";
		//you lose
		gameOver("bomb");
		return false;
	}
	return true;
};	

function flag( boxId ){
	var flaggedPos = flagged.indexOf( boxId );
	if ( flaggedPos == -1 ) {
		$("#" + boxId).html("<img src = 'http://upload.wikimedia.org/wikipedia/commons/" +
			"thumb/1/1c/Flag_icon_red_4.svg/250px-Flag_icon_red_4.svg.png' class='flag' />");
		flagged.push( boxId );
	} else {
		flagged.splice( flaggedPos, 1);
		document.getElementById(boxId).innerHTML = "";
	}
}

function gameOver(reasonLost) {
	
	//tell you that you lost and why
	if (reasonLost == "bomb")
		alert("you clicked a bomb");
	else
		alert("out of time");
		
	
	revealBombs();
	
	//dont let clicks trigger events
	gameOn = false;
	
	//give sarcastic mean comment
	document.getElementById("youSuck").innerHTML = "<a href = 'http://www.wikihow.com/Play-Minesweeper'" +
	"target = '_blank'>This is for you</a>";
	
	//stop timer
	//window.clearTimeout(timoutID); :not yet
}

function revealBombs() {
	for(var i = 0; i < bomb.length; i++ ) {
		document.getElementById( bomb[i] ).innerHTML = "B";
		document.getElementById( bomb[i] ).className = "bomb";
	}
}