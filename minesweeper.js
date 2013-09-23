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
	
	var flagged = [];
		//amount of squares clicked while game on place-holder
	var flippedCount = 0;
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
		
for ( var i = 0 ; i < bombAmount ; i++ ) {
	bomb[i] = 0;
}
	//fill table
write();



function write() {
	
		//empty table ( dont make multiple games)
	document.getElementById("grid").innerHTML = "";

		//clears text under start button
	document.getElementById("youSuck").innerHTML = "";
	
	alreadyFlipped = [];

		//gamebox initlazation
	var gameBox = "";

	//ten rows
for ( i = 0 ; i < rowAmount ; i++ ) {
	gameBox += "<tr>";
		//ten columns
	for ( var j = 0 ; j < columnAmount ; j++ ) {
			//produce id value
		var idValue = ( i * rowAmount ) + j;
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
	if ( gameOn ) {
		timePast++;
		$("#timer").html( timePast );
		timoutID = window.setTimeout(timer, 1000);
	} 
}

function speedTimer() {
	if ( timePast == 0 ) {
		gameOver("time");
	}
	if ( gameOn ) {
		timePast--;
		$("#timer").html( timePast );
		timoutID = window.setTimeout(speedTimer, 1000);
	} 
}

function speedStart() {
	speedSweep = true;
	$("#timer").html( timePast );
	start();
}

function regStart() {
	speedSweep = false;
	start();
}

function start() {
	
		//reset
	write();
	speedSweep?timePast = 30:timePast = 0;
	flippedCount = 0;		
	$("#flipped").html(flippedCount);
	document.getElementById("youRock").className = "hidden";
	$("#timer").html( timePast );
	window.clearTimeout(timoutID);
	
		//start the timer
	speedSweep?
		timoutID = setTimeout(speedTimer, 1000):
		timoutID = setTimeout(timer, 1000);

		
		//game will now check for bombs if box is clicked
	gameOn = true;

	writeBombs();
}

function writeBombs() {	
		//assign bombs as numbers within the call range
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
	
	console.log(bomb);
}
	//find a new number that wasent used yet
function reassign(i) {
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
	//handles box click
$(document).on("mousedown","td", function(event) {
	
	event.preventDefault();
	
		clicked = event.target;
	
	if ( gameOn && clicked.className == "box" ) {
	
	if ( event.which == "3" ) {
		flag( parseInt(clicked.id) );
		return;
	}
	
	if ( flagged.indexOf( parseInt(clicked.id) ) >= 0 ) return;

		//run bombcheck functions if you havent lost yet
		
		bombCheck(clicked);
		if (gameOn) {
		nextToBombCheck( parseInt(clicked.id) );
		checkWin();
		
		}
		
	} else if ( !gameOn && flippedCount > 0 && flippedCount < ( cellAmount - bombAmount ) ) {
		document.getElementById("youSuck").innerHTML = "YOU LOST ITS GAME OVER PRESS START BUTTON TO RESTART";
	} else if (!gameOn) {
			document.getElementById("youSuck").innerHTML = "PRESS START BUTTON TO START";
	}
});

function flag( boxId ){
	flaggedPos = flagged.indexOf( boxId );
	if ( flaggedPos == -1 ) {
		$("#" + boxId).html("<img src = 'http://upload.wikimedia.org/wikipedia/commons/" +
			"thumb/1/1c/Flag_icon_red_4.svg/250px-Flag_icon_red_4.svg.png' class='flag' />");
		flagged.push( boxId );
	} else {
		flagged.splice( flaggedPos, 1);
		document.getElementById(boxId).innerHTML = "";
	}
	console.log(flagged + "-" + boxId + "-" + flaggedPos );
}

function bombCheck(event) {
		var boxNum = parseInt(event.id);
			//check if bomb
    if ( bomb.indexOf(boxNum) >= 0 ) {
			//show and style as bomb
		event.innerHTML = "B";
		event.className = "bomb";
			//you lose
		gameOver("bomb");			
	}
}

function checkWin() {
	if ( flippedCount === ( cellAmount - bombAmount ) ) {
		alert("you won in just " + timePast + " seconds");
		document.getElementById("youRock").className = "";
		revealBombs();
		gameOn = false;
	}
}

/* function nextToBombCheck(boxVal) {	//new needs help
		//reset bomb count
	bombCount = 0 ;
		//initialize variable for checking nerby boxes
	var nextToBox = 0;
		
	for ( var i = 9 ; i <= 11 ; i++ ) {
		nextToBox = boxVal + i;
			//check if its a wrap
		if ( ( nextToBox%10 === 0 && boxVal%10 === 9 ) || ( nextToBox%10 === 9 && boxVal%10 === 0 ) ) {
			continue;
			//check boxes below
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
	
	for ( i = -1 ; i <= 1 ; i++ ) {
		nextToBox = boxVal + i;
			//check if its a wrap (above and below wont work anyway)
		if ( ( nextToBox%10 === 0 && boxVal%10 === 9 ) || ( nextToBox%10 === 9 && boxVal%10 === 0 ) ) {
			continue;
			//check boxes alongside
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
	
	for ( i = -11 ; i <= -9 ; i++ ) {
		nextToBox = boxVal + i;
		if ( ( nextToBox%10 === 0 && boxVal%10 === 9 ) || ( nextToBox%10 === 9 && boxVal%10 === 0 ) ) {
			continue;
			//check boxes above
		} else if ( bomb.indexOf( nextToBox ) >= 0 ) {
			bombCount++;
		}
	}
			//asign the box's id as boxId
		var boxId =  boxVal;
		
			//set class(colors) based on bombCount
		document.getElementById(boxId).className = classList[ bombCount ];
		
	if ( bombCount > 0 ) {
		
			//write number of neighboring bombs
		document.getElementById(boxId).innerHTML = bombCount;
	
	}else {
			//open bigger grid
		expand(boxVal);
	}	
}







function expand(emptyBox) {
		//go right
	if ( emptyBox%10 === 9 ) {
		//do nothing
	} else if ( emptyBox%10 === 8 ) {
			//one to the right is empty
		var boxPlusOne = emptyBox + 1;
		document.getElementById(boxPlusOne).className = "zero";
	} else {
		nextToBombCheck(emptyBox - 1);
	}
		
	
}
//*/

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
	//check for nearby bombs
function nextToBombCheck( boxNum ) {	
		//add to amount of flipped boxes
	if(alreadyFlipped[ boxNum ] === "yes") {
		return;
	} else {
	flippedCount++;
	document.getElementById("flipped").innerHTML = flippedCount;
	alreadyFlipped[ boxNum ] = "yes";
	}
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
	//expand until you hit numbers
function expand( emptyBoxId ) {
	checkRightOfEmpty( emptyBoxId + 1 );
	checkLeftOfEmpty( emptyBoxId - 1 );
	checkAboveEmpty( emptyBoxId - columnAmount );
	checkBelowEmpty( emptyBoxId + columnAmount );
} 

function checkRightOfEmpty( boxToTheRightId ) {
		//if box is at the edge/ if its right next to the edge / if else
	if ( boxToTheRightId % columnAmount === ( 0 ) ) {
		//do nothing
	} else {
		nextToBombCheck( boxToTheRightId );
	}
}

function checkLeftOfEmpty( boxToTheLeftId ) {
		//if box is at the edge/ if its right next to the edge / if not ( its in middle )
	if ( boxToTheLeftId % columnAmount === ( columnAmount - 1 ) ) {
		//do nothing
	} else {
		nextToBombCheck( boxToTheLeftId );
	}
}

function checkAboveEmpty( boxAboveId ) {
		//if box is at the edge/ if its right next to the edge / if else
	if ( boxAboveId < 0 ) {
		//do nothing
	} else {
		nextToBombCheck( boxAboveId );
	}
}

function checkBelowEmpty( boxBelowId ) {
		//if box is at the edge/ if its right next to the edge / if else
	if ( boxBelowId > cellAmount ) {
		//do nothing
	} else {
		nextToBombCheck( boxBelowId );
	}
}


















