var pc;
var npc_prince;

var output;
var leftArrowDown = false;
var rightArrowDown = false;
var upArrowDown = false;
var gameTimer;

const GRAVITY = 1;
var fallSpeed = 0;

var platforms = new Array();

var level = 0;

var lifebar;
var numLives = 0;

function init(){
	output = document.getElementById('output');
	output.innerHTML = level;
	
	lifebar = document.getElementById('lifebar');
	for(var i = 0; i < 3; i++) addLife();

	pc = document.getElementById('pc');
	pc.style.width = '20px';
	pc.style.height = '40px';
	
	npc_prince = document.getElementById('npc_prince');
	npc_prince.style.width = '20px';
	npc_prince.style.height = '40px';
	
	nextLevel();
}

function addPlatform(x, y, w, h) {
	var p = document.createElement('DIV');
	p.className = 'platform';
	p.style.left = x + 'px';
	p.style.top = y + 'px';
	p.style.width = w + 'px';
	p.style.height = h + 'px';
	
	platforms.push(p);
	gameWindow.appendChild(p);
}

function gameloop(){
	
	// HORIZONTAL MOVEMENT
	if(leftArrowDown){
		pc.style.left = parseInt(pc.style.left) - 5 + 'px';
		
		var sideHit = false;
		for(var i = 0; i < platforms.length; i++) {
			if(hittest(pc, platforms[i])) sideHit = true;
		}
		pc.style.left = parseInt(pc.style.left) + 5 + 'px';
		
		if(!sideHit) {
			for(var i = 0; i < platforms.length; i++) {
				platforms[i].style.left = parseInt(platforms[i].style.left) + 5 + 'px';
			}
			npc_prince.style.left = parseInt(npc_prince.style.left) + 5 + 'px';
		}
	}
	
	if(rightArrowDown){
		pc.style.left = parseInt(pc.style.left) + 5 + 'px';	
		
		var sideHit = false;
		for(var i = 0; i < platforms.length; i++) {
			if(hittest(pc, platforms[i])) sideHit = true;
		}
		pc.style.left = parseInt(pc.style.left) - 5 + 'px';
		
		if(!sideHit) {
			for(var i = 0; i < platforms.length; i++) {
				platforms[i].style.left = parseInt(platforms[i].style.left) - 5 + 'px';
			}
			npc_prince.style.left = parseInt(npc_prince.style.left) - 5 + 'px';
		}
	}
	
	
	//VERTICAL MOVEMENT
	fallSpeed += GRAVITY;
	pc.style.top = parseInt(pc.style.top) + fallSpeed + 'px';
	
	for(var i = 0; i < platforms.length; i++) {
		if( hittest(pc, platforms[i]) ) {
			if(fallSpeed < 0) {
				pc.style.top = parseInt(platforms[i].style.top) + parseInt(platforms[i].style.height) + 'px';
				fallSpeed *= -1;
			} else {
				pc.style.top = parseInt(platforms[i].style.top) - parseInt(pc.style.height) + 'px';
			
				if(upArrowDown) fallSpeed = -16; //upward force
				else {
					fallSpeed = 0;
				}
			}
		}
	}
    
    //WINNING THE GAME
    if(hittest(pc, npc_prince)) {
        clearInterval(gameTimer);
        alert('You saved the prince!');
        
        if(level == 3) {
        	gameWindow.innerHTML = '<br><br>You win!';
        	gameWindow.className = 'msgGameOver';
        } else {
        	document.getElementById('btnContinue').style.display = 'block';
        }
        
    } else if( parseInt(pc.style.top) > 400) {
        clearInterval(gameTimer);
        alert('Welp, you died. :/');
        
        removeLife();
        level--;
        nextLevel();
    }
}

function nextLevel() {
	document.getElementById('btnContinue').style.display = 'none';
	level++;
    output.innerHTML = "Level " + level;
    
    fallSpeed = 0;
    leftArrowDown = false;
    rightArrowDown = false;
    upArrowDown = false;
    
    pc.style.left = '190px';
    pc.style.top = '50px';
    
    for(var i = 0; i < platforms.length; i++) {
    	gameWindow.removeChild(platforms[i]);
    }
    platforms = new Array();
    
    if(level == 1) {
    	npc_prince.style.left = '2000px';
    	npc_prince.style.top = '340px';
    	
		addPlatform(0, 380, 500, 20);
		addPlatform(150, 300, 100, 20);
		addPlatform(550, 380, 400, 20);
		addPlatform(400, 300, 100, 100);
		addPlatform(900, 200, 100, 20);
		addPlatform(800, 300, 100, 20);
		addPlatform(1180, 380, 1400, 20);
    } else if(level == 2) {
    	npc_prince.style.left = '500px';
    	npc_prince.style.top = '340px';
    	
    	addPlatform(0, 380, 250, 20);
    	addPlatform(300, 380, 250, 20);
    } else if(level == 3) {
    	npc_prince.style.left = '500px';
    	npc_prince.style.top = '340px';
    	
    	addPlatform(0, 380, 500, 20);
    	addPlatform(550, 280, 150, 20);
    }
    
    gameTimer = setInterval(gameloop, 25);
}

function addLife() {
	numLives++;
	var life = document.createElement('IMG');
	life.src = 'heart.png';
	lifebar.appendChild(life);
}

function removeLife() {
	if(numLives > 0) {
		numLives--;
		lifebar.removeChild(lifebar.lastChild);
	} else {
		gameWindow.innerHTML = '<br><br>Game Over!';
		gameWindow.className = 'msgGameOver';
	}
}

//JQUERY EVENT LISTENERS FOR MOVEMENT
$(document).keydown(function() {
	if(event.keyCode==37) leftArrowDown = true;
	if(event.keyCode==39) rightArrowDown = true;
	if(event.keyCode==38) upArrowDown = true;
	
	event.preventDefault();
});

$(document).keyup(function() {
	if(event.keyCode==37) leftArrowDown = false;
	if(event.keyCode==39) rightArrowDown = false;
	if(event.keyCode==38) upArrowDown = false;
});