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
	timePast = speedSweep?30:0;
	window.clearTimeout(timoutID);
	timoutID = setTimeout(timer, 1000);
	
		//clear flipped counter
	alreadyFlipped = [];
	$("#flipped").html(alreadyFlipped.length);
	
		//reset the flagged array
	flagged = [];
	
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

function customStart() {
$("#cover,#custom").removeClass("hidden");
	rowAmount = 16;
	columnAmount = 30;
	bombAmount = 99;
	regStart();///
	//alert("sorry  this ability is not ready yet");//*/
}

function customSubmit() {
	rowAmount = parseInt($("#customRows").val(),10);
	columnAmount = parseInt($("#customColumns").val(),10);
	bombAmount = parseInt($("#customBombs").val(),10);//*/
	regStart();
	$("#cover,#custom").addClass("hidden");
}

function writeBombs() {
	
		//assign bombs as numbers within the cell range
	for ( var i = 0; i < bombAmount; i++ ) {
				reassign(i);
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
		nextToBombCheck( parseInt(clicked.id,10) );
		checkWin();	
	}

		//display these messages if game isnt in progress
	} else if ( alreadyFlipped.length > 0 && alreadyFlipped.length < ( cellAmount - bombAmount ) ) {
		document.getElementById("youSuck").innerHTML = "YOU LOST ITS GAME OVER PRESS START BUTTON TO RESTART";
	} else {
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
		return false;
	}
	return true;
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
	window.clearTimeout(timoutID);
}

function revealBombs() {
	for(var i = 0; i < bomb.length; i++ ) {
				document.getElementById( bomb[i] ).innerHTML = "B";
				document.getElementById( bomb[i] ).className = "bomb";
	}
}
	
function nextToBombCheck( boxNum ) {	
		//add to amount of flipped boxes
	if(alreadyFlipped.indexOf(boxNum) >= 0 ) {
		return;
	} else {
		alreadyFlipped.push(boxNum);
		document.getElementById("flipped").innerHTML = alreadyFlipped.length;
	}
			//check for nearby bombs
	
		//reset bomb count
	bombCount = 0 ;
		//initialize variable for checking nearby boxes
	
		//check boxes above
	bombCount += check( boxNum + columnAmount - 1 );
	
		//check boxes alongside
	bombCount += check( boxNum - 1 );
	
		//check boxes below
	bombCount += check( boxNum - columnAmount - 1 );
	
			//set class(colors) based on bombCount
		var ele = document.getElementById(boxNum);
		
		if(!ele) return;
		
		ele.className = classList[bombCount] + ' flipped';
			
	if ( bombCount !== 0 ) {
			//write number of neighbouring bombs
		ele.innerHTML = bombCount;
	}
	else {
		expand(boxNum);
	}	
}

function check(startNum) {
    var bombsFound = 0;
    for (var i = startNum; i < startNum + 2; i++) {
        //check for wrap
        if ((i % columnAmount === 0 && startNum % columnAmount === (columnAmount - 1)) || 
	(i % columnAmount === (columnAmount - 1) && startNum % columnAmount === 0)) {
            continue;
            //check for bombs
        } else if (bomb.indexOf(i) >= 0) {
            bombsFound++;
        }
    }
    return bombsFound;
}
	
	
function expand( emptyBoxId ) {
		//expand until you hit numbers
		
		//left
	expandCheck( emptyBoxId -1, ( emptyBoxId -1 % columnAmount === ( columnAmount - 1 ) ) );
		//right
	expandCheck( emptyBoxId +1, ( emptyBoxId +1 % columnAmount === 0 ) );
		//up
	expandCheck( emptyBoxId - columnAmount, false );
		//down
	expandCheck( emptyBoxId + columnAmount, false );
		//up and left
	expandCheck( emptyBoxId - columnAmount -1, ( emptyBoxId -1 % columnAmount === ( columnAmount - 1 ) ) );
		//up and right
	expandCheck( emptyBoxId - columnAmount +1, ( emptyBoxId +1 % columnAmount === 0 ) );
		//down and left
	expandCheck( emptyBoxId + columnAmount -1, ( emptyBoxId -1 % columnAmount === ( columnAmount - 1 ) ) );
		//down and right
	expandCheck( emptyBoxId + columnAmount +1, ( emptyBoxId +1 % columnAmount === 0 ) );
}

function expandCheck( boxId,uniqueCheck ){
	if ( !( boxId < 0 || boxId > cellAmount - 1 ) && !uniqueCheck ) {
		nextToBombCheck( boxId );
	}
}

















