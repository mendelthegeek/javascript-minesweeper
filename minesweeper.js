		//initialize center
	var bombCount = 0 ;
		//array of bomb locations
	var bomb = [];
		//sorry gotta press start
	var gameOn = false;
		//keeps evrything nice and colorful
	var classList = [ 'zero', 'one' , 'two' , 'three' , 'four' , 'five' , 'six' , 'seven' , 'eight' ];
		//time place-holder
	var timePast = 0;
		//array to keep track of flagged squares
	var flagged = [];
		//amount of bombs
	var bombAmount = 10;
		//total amount of rows
	var rowAmount = 10;
		//isn't it obvious?
	var columnAmount = 10;
		//amount of cells (assigned after <table> is built)
	var cellAmount;
		//initialize array needed for not repeating expand
	var alreadyFlipped = [];
		//var to enable speed-sweep version
	var speedSweep = false; 
		//var to enable timer reset
	var timoutID = "";
		
	//fill table
write();

function write() {
	
		//empty table ( dont make multiple games)
	document.getElementById("grid").innerHTML = "";

		//gamebox initlazation
	var gameBox = "";

	//write rows
for ( i = 0 ; i < rowAmount ; i++ ) {
	gameBox += "<tr>";
		//write cells
	for ( var j = 0 ; j < columnAmount ; j++ ) {
			//produce id value
		var idValue = ( i * columnAmount ) + j;
			//write cell
		gameBox += "<td class = 'box' id = '" + idValue + "' ></td>";
	}
	gameBox += "</tr>";
}
	//assign cellAmount
cellAmount = rowAmount * columnAmount;

	//now to actually write it
document.getElementById("grid").innerHTML = gameBox;

}

function timer() {
	if ( timePast < 0 ) {
		gameOver("time");
	}
	if ( gameOn ) {
		speedSweep?timePast--:timePast++;
		$("#timer").html( timePast );
		timoutID = window.setTimeout(timer, 1000);
	} 
}

function speedStart() {
	speedSweep = true;
	start();
}

function regStart() {
	speedSweep = false;
	start();
}

function start() {
	
		//reset
	
	gameOn = true;
	write();
	writeBombs();
	
		//start the timer
	speedSweep?timePast = 30:timePast = 0;
	window.clearTimeout(timoutID);
	timoutID = setTimeout(timer, 1000);
	
		//clear flipped counter
	alreadyFlipped = [];
	$("#flipped").html(alreadyFlipped.length);
	
		//clear text under start button
	document.getElementById("youSuck").innerHTML = "";
	document.getElementById("youRock").className = "hidden";
	
}

function beginnerStart() {
	rowAmount = 10;
	columnAmount = 10;
	bombAmount = 10;
	regStart();
}

function intermediateStart() {
	rowAmount = 16;
	columnAmount = 16;
	bombAmount = 40;
	regStart();
}

function expertStart() {
	rowAmount = 16;
	columnAmount = 30;
	bombAmount = 99;
	regStart();
}

function writeBombs() {	
	for ( var j = 0 ; j < bombAmount ; j++ ) {
		bomb[j] = 0;
	}
		//assign bombs as numbers within the cell range
	for ( var i in bomb ) {
			//produce random number ( based on amount of cells in the game )
		var number = Math.floor( Math.random() * ( cellAmount - 1 ) );
				//check if its already a bomb value if yes reassign
			if( bomb.indexOf(number) >= 0 ){
				reassign(i);
				//if not cool lets move on
			} else {
				bomb[i] = number;
			}	
		}
		 
		//haha i can cheat (for debugging)
	console.log(bomb);
}
	
function reassign(i) {
	//find a new number that wasent used yet
	
		//produce random number ( based on amount of cells in the game )
	var number = Math.floor( Math.random() * ( cellAmount - 1 ) );
			//check if its already a bomb value if yes reassign
	if( bomb.indexOf(number) >= 0 ) {
		reassign(i);
		//if not cool lets move on
	} else {
		bomb[i] = number;
	}		
}

$(document).on("mousedown","td", function(event) {
	//handles box click
	
	event.preventDefault();
	
		var clicked = event.target;
	
	if ( gameOn && clicked.className == "box" ) {
	
	if ( event.which == "3" ) {
		flag( parseInt(clicked.id,10) );
		return;
	}
		
			//run bombcheck functions if you havent lost yet and box isnt flagged
	if (gameOn && flagged.indexOf( parseInt(clicked.id,10) ) == -1 ) {
		bombCheck(clicked);
		nextToBombCheck( parseInt(clicked.id,10) );
		checkWin();	
	}
		
		//display these messages if game isnt in progress
	} else if ( !gameOn && alreadyFlipped.length > 0 && alreadyFlipped.length < ( cellAmount - bombAmount ) ) {
		document.getElementById("youSuck").innerHTML = "YOU LOST ITS GAME OVER PRESS START BUTTON TO RESTART";
	} else if (!gameOn) {
			document.getElementById("youSuck").innerHTML = "PRESS START BUTTON TO START";
	}
});

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

function bombCheck(event) {
		var boxNum = parseInt(event.id,10);
			//check if you clicked a bomb
    if ( bomb.indexOf(boxNum) >= 0 ) {
			//show and style as bomb
		event.innerHTML = "B";
		event.className = "bomb";
			//you lose
		gameOver("bomb");			
	}
}

function checkWin() {
	if ( alreadyFlipped.length === ( cellAmount - bombAmount ) ) {
			//tell you that you are cool
		alert("you won in just " + timePast + " seconds");
		document.getElementById("youRock").className = "";
			//bombs, show yourselfs!
		revealBombs();
			//game is over
		gameOn = false;
			//stop timer
		window.clearTimeout(timoutID);
	}
}

function gameOver(reasonLost) {
		//tell you that you lost and why
	reasonLost == "bomb"?
		alert("you clicked a bomb"):
		alert("out of time");
	revealBombs();
		//dont let clicks trigger events
	gameOn = false;
		//give sarcastic mean comment
	document.getElementById("youSuck").innerHTML = "<a href = 'http://www.wikihow.com/Play-Minesweeper'"
	+ "target = '_blank'>This is for you</a>";
		//stop timer
	window.clearTimeout(timoutID);
}

function revealBombs() {
	var bombsFoundInLoop = 0;
		//reveals bombs
	for ( var currentLoop = 0 ; currentLoop < cellAmount ; currentLoop++ ) {
		if ( bombsFoundInLoop === bomb.length )
			return;
		if ( bomb.indexOf(currentLoop) >=0 ) {
				document.getElementById(currentLoop).innerHTML = "B";
				document.getElementById(currentLoop).className = "bomb";
				bombsFoundInLoop++;
		}
	}
}
	
function nextToBombCheck( boxNum ) {	
		//add to amount of flipped boxes
	if(alreadyFlipped.indexOf(boxNum) >= 0 ) {
		return;
	} else {
	alreadyFlipped.push(boxNum);
	document.getElementById("flipped").innerHTML = alreadyFlipped.length;
	console.log(alreadyFlipped);
	console.log(boxNum);
	}
			//check for nearby bombs
	
		//reset bomb count
	bombCount = 0 ;
		//initialize variable for checking nearby boxes
	var nextToBox = 0;
		
	var checkSide = 0;
	
	for ( var i = ( columnAmount - 1 ); i <= ( columnAmount + 1 ) ; i++ ) {
		nextToBox = boxNum + i;
			//check if its a wrap
		if ( ( nextToBox%columnAmount === 0 && boxNum%columnAmount === ( columnAmount - 1 ) ) || 
			( nextToBox%columnAmount === ( columnAmount - 1 ) && boxNum%columnAmount === 0 ) ) {
			continue;
			//check boxes below
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
	
	for ( i = -1 ; i <= 1 ; i++ ) {
		nextToBox = boxNum + i;
			//check if its a wrap (above and below wont work anyway)
		if ( ( nextToBox%columnAmount === 0 && boxNum%columnAmount === ( columnAmount - 1 ) ) || 
			( nextToBox%columnAmount === ( columnAmount - 1 ) && boxNum%columnAmount === 0 ) ) {
			continue;
			//check boxes alongside
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
	
	for ( i = ( 0 - columnAmount - 1 ) ; i <= ( 0 - columnAmount + 1 ) ; i++ ) {
		nextToBox = boxNum + i;
		if ( ( nextToBox%columnAmount === 0 && boxNum%columnAmount === ( columnAmount - 1 ) ) || 
			( nextToBox%columnAmount === ( columnAmount - 1 ) && boxNum%columnAmount === 0 ) ) {
			continue;
			//check boxes above
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
			//set class(colors) based on bombCount
		var ele = document.getElementById(boxNum);
		
		if(!ele) return;
		
		ele.className = classList[bombCount] + ' flipped';
			
	if ( bombCount !== 0 ) {
			//write number of neighboring bombs
		ele.innerHTML = bombCount;
	}
	else {
		expand(boxNum);
	}	
}
	
function expand( emptyBoxId ) {
		//expand until you hit numbers
	checkRightOfEmpty( emptyBoxId + 1 );
	checkLeftOfEmpty( emptyBoxId - 1 );
	checkAboveEmpty( emptyBoxId - columnAmount );
	checkBelowEmpty( emptyBoxId + columnAmount );
} 

function checkRightOfEmpty( boxToTheRightId ) {
		//if box is at the edge or off the edge
	if ( boxToTheRightId % columnAmount === ( 0 ) || boxToTheRightId > ( cellAmount - 1 ) ) {
		//do nothing
	} else {
		nextToBombCheck( boxToTheRightId );
	}
}

function checkLeftOfEmpty( boxToTheLeftId ) {
		//if box is at the edge or off the edge
	if ( boxToTheLeftId % columnAmount === ( columnAmount - 1 ) || boxToTheLeftId < 0 ) {
		//do nothing
	} else {
		nextToBombCheck( boxToTheLeftId );
	}
}

function checkAboveEmpty( boxAboveId ) {
		//if box is at the edge
	if ( boxAboveId < 0 ) {
		//do nothing
	} else {
		nextToBombCheck( boxAboveId );
	}
}

function checkBelowEmpty( boxBelowId ) {
		//if box is at the edge
	if ( boxBelowId > cellAmount - 1 ) {
		//do nothing
	} else {
		nextToBombCheck( boxBelowId );
	}
}


















