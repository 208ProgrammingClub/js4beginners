var basePath = '';
var checkTime = 15 // seconds

var size = 22;
var x = 0;
var y = 0;
var direction = '';
var offX = 0;
var offY = 0;
var messagePath = basePath + '../message.js';
var messageShowing = false;
var can = null;
var ctx = null;
var grid = 'yes';
var moveAmount = 8;
var doEndingRitual = false;
var currentSteve = null;

function masterStartup() {

    loadScripts();

    // lame way of waiting for scripts to load
    setTimeout(function() {
        enableMessaging(); // probably always leave this on
 
        wireUpKeys();

        //congratulate();
        createColorButtonAndFriends();
        createCanvas();

        //createHelpSection();

        // last call (does it all)
        if (startup) {

            //turnForward(true);

            startup();
            
            endingRitual();            

            if (grid == 'yes') {
                var checkbox = document.getElementById("showGridCheckbox");
                checkbox.checked = true;
                repaintCanvas(shouldDrawGrid(checkbox));
            }
        }

        setTimeout(processQueue, queueInterval);

    }, 300);
}

function endingRitual(){
    if (doEndingRitual && queue.length > 0){
        turnForward();
        wink();
        turnForward();
        turnForward();
        turnForward();
        turnForward();
        blink();
        turnForward();
        smile();
        turnForward();
        turnForward();
        blink();
        turnForward();
    }
}

var queueIndex = 0;
var queueId = null;
var queueInterval = 400;
var queue = [];

function queueCommand(run, fn) {
    if (!run) {
        queue.push(fn);
        // should not run
        return false;
    }
    // should run
    return true;
}

function processQueue() {
    console.log('in processQueue');
    
    if (!queueId) {
        queueId = setInterval(processQueue, queueInterval);
    }

    var fn = queue[queueIndex++]; // see incrementer

    if (fn) {
        fn(true);
    }
    else {
        clearInterval(queueId);
    }
}

function createHelpSection() {
    var s = '';

    s += '<div><div style="display: inline-block;">Help me with:</div><br/>';
    s += '<a href="' + basePath + 'functions.html">functions</a><br/>';
    s += '<a href="' + basePath + 'conditions.html">conditions</a><br/>';
    s += '<a href="' + basePath + 'for-loops.html">for loops</a></div>';

    var help = htmlToElement(s);
    addEl(help);
}

function congratulate() {
    alert('\n\n\n\nNice job ' + name + '!  \n\nYou linked to Mr J\'s script.  :) \n\n\n\n NOW, raise your hand and be quiet if you see this.\n\n\n\n');
}

function createColorButtonAndFriends() {
    // color button
    var colorButtonHtml = '<button onclick="togglePalette()">Colors</button>'

    var colorButton = htmlToElement(colorButtonHtml);
    document.body.appendChild(colorButton);

    // palette image
    var paletteHtml = '<img id="palette" style="visibility:hidden; position:absolute; z-index: 1; max-height:500px" src="' + basePath + '../img/web-color-names.png">';
    var palette = htmlToElement(paletteHtml);
    addEl(palette);

    // steve button
    var steveButtonHtml = '<button onclick="toggleSteve()">Steve</button>'

    var steveButton = htmlToElement(steveButtonHtml);
    document.body.appendChild(steveButton);

    // steve image
    var steveHtml = '<img id="steve" style="visibility:hidden; position:absolute; top:350px; left:45px; max-height: 225px; z-index: 1;" src="' + basePath + '../img/steve.jpg">';
    var steve = htmlToElement(steveHtml);
    addEl(steve);


    createGridCheckbox();
}

function createGridCheckbox() {
    var chkHtml = '<div style="display: inline-block;"><input id="showGridCheckbox" type="checkbox" onchange="toggleGrid(this)" /><label for="showGridCheckbox">Grid</label></div>';
    var chk = htmlToElement(chkHtml);
    addEl(chk);
}

function toggleGrid(checkbox) {
    repaintCanvas(shouldDrawGrid(checkbox));
}

function shouldDrawGrid(checkbox) {
    return $(checkbox).is(':checked') || grid==='yes';
}

function clearCanvas() {
    ctx.clearRect(0, 0, can.width, can.height);
}

function repaintCanvas(showGrid) {
    ctx.clearRect(0, 0, can.width, can.height);
    if (showGrid) {
        drawGrid();
    }
    drawSteve();
    //if (startup) startup();
}

function createCanvas() {
    var canvasHtml = '<div><label for="can"><p><b>Minecraft...ish</b></p></label><canvas id="can" width="550" height="500" style="padding:0px; border:1px solid gray; background-color:#618C2E; display:block" /></div>';
    cvs = htmlToElement(canvasHtml);
    addEl(cvs);
    can = el('can');
    ctx = can.getContext('2d');
    //(&apos;canvas&apos; and &apos;ctx&apos;)
}

function addEl(el, parent) {
    if (!parent) parent = document.body;
    parent.appendChild(el);
}

setTimeout(masterStartup, 500);

function drawSquare(x, y, color) {
    ctx.beginPath();
    ctx.rect((x + offX - 1) * size + 0.5, (y + offY - 1) * size + 0.5, size, size);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawGrid() {
    
    var x = 0,
        y = 0;

    do {
        line(0, y, can.width, y, 'black');
        y = y + size*8;
    }
    while (y <= can.height);

    x = 0;
    do {
        line(x, 0, x, can.height, 'black');
        x = x + size*8;
    }
    while (x <= can.width);
}

function line(x1, y1, x2, y2, color) {

    if (!color) color = 'gray';

    ctx.beginPath();
    ctx.moveTo(x1 + 0.5, y1 + 0.5);
    ctx.lineTo(x2 + 0.5, y2 + 0.5);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

function togglePalette() {
    var pal = el('palette');
    if (pal.style.visibility == 'visible') {
        pal.style.visibility = 'hidden';
    }
    else {
        pal.style.visibility = 'visible';
    }
    toggleSteve();
}

function toggleSteve() {
    var pal = el('steve');
    if (pal.style.visibility == 'visible') {
        pal.style.visibility = 'hidden';
    }
    else {
        pal.style.visibility = 'visible';
    }
}

function el(id) {
    return document.getElementById(id);
}

function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function drawHead() {
    do {
        y = y + 1;
        do {
            x = x + 1;
            drawSquare(x, y, 'peru');
        }
        while (x < 9);
        x = 0;
    }
    while (y < 9);
}

function drawHair() {
    for (y = 1; y < 4; y++) {
        for (x = 1; x < 10; x++) {
            if (y != 3 || (y == 3 && (x == 1 || x == 9))) {
                drawSquare(x, y, 'black');
            }
        }
    }
}

function drawEyes() {
    drawSquare(4, 5, 'blue');
    drawSquare(6, 5, 'blue');
    drawSquare(3, 5, 'white');
    drawSquare(7, 5, 'white');
}

function drawMouth() {
    drawSquare(4, 8, 'salmon');
    drawSquare(5, 8, 'salmon');
    drawSquare(6, 8, 'salmon');
}

function doCheck() {
    var tag = document.createElement('script');
    tag.setAttribute('id', 'messageScript');
    tag.setAttribute('type', 'text/javascript');
    tag.setAttribute('src', messagePath);
    document.body.appendChild(tag);
}

function cleanUpMessageScript() {
    var tag = document.getElementById('messageScript');
    document.body.removeChild(tag);
}

function enableMessaging() {
    setInterval(function() {
        doCheck();
    }, checkTime * 1000);
}

function loadScripts() {
    addScript('https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js');
    setTimeout(loadJqueryUi, 300);
}

function loadJqueryUi() {
    addCss('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css');
    addScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js');
}

function addScript(src) {
    var tag = document.createElement('script');
    tag.setAttribute('type', 'text/javascript');
    tag.setAttribute('src', src);
    document.body.appendChild(tag);
}

function addCss(src) {
    var tag = document.createElement('link');
    tag.setAttribute('rel', 'stylesheet');
    tag.setAttribute('href', src);
    document.head.appendChild(tag);
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    }
}


function turnForward() {

    var faceForward = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 3, 0, 0, 3, 2, 0],
        [0, 0, 0, 4, 4, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
    ];
    direction = 'F';
    drawSteve(faceForward);
}

function turnRight() {

    var faceRight = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 3, 0, 2, 3, 0],
        [0, 0, 0, 0, 4, 4, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 0],
    ];
    direction = 'E';
    drawSteve(faceRight);
}

function turnLeft() {

    var faceLeft = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 2, 0, 3, 2, 0, 0],
        [0, 0, 4, 4, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0],
    ];
    direction = 'W';
    drawSteve(faceLeft);
}

function turnDown() {

    var faceDown = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 2, 0, 0, 2, 0, 0],
        [0, 0, 3, 0, 0, 3, 0, 0],
        [0, 0, 0, 4, 4, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    direction = 'S';
    drawSteve(faceDown);
}

function turnUp() {

    var faceUp = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 3, 0, 0, 3, 0, 0],
        [0, 0, 2, 0, 0, 2, 0, 0],
        [0, 0, 0, 4, 4, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    direction = 'N';
    drawSteve(faceUp);
}

function blink() {

    var faceBlink = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 4, 4, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
    ];
    drawSteve(faceBlink);
}

function wink() {

    var faceWink = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 3, 0, 0, 0, 0, 0],
        [0, 0, 0, 4, 4, 0, 0, 0],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0],
    ];
    drawSteve(faceWink);
}

function smile() {

    var faceSmile = [
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0],
        [0,2,3,0,0,3,2,0],
        [0,0,0,4,4,0,0,0],
        [0,1,2,2,2,2,1,0],
        [0,1,1,1,1,1,1,0],
    ];
    drawSteve(faceSmile);
}

function tongue() {

    var faceTongue = [
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0],
        [0,2,3,0,0,3,2,0],
        [0,0,0,4,4,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,0,1,5,5,1,0,0],
        [9,9,9,5,5,9,9,9],
        [9,9,9,5,5,9,9,9],
    ];
    drawSteve(faceTongue);
}


function drawSteve(steveArray) {
    clearCanvas();
    if (steveArray) {
        currentSteve = steveArray;
    }

    if (currentSteve){
        for (var y = 0; y < currentSteve.length; y++){
            for (var x = 0; x < currentSteve[y].length; x++){

                var colorIndex = currentSteve[y][x];
                if (colorIndex != 9){
                    drawSquare(x + 1 + window.x, y + 1 + window.y, colorArray[colorIndex]);
                }
            }
        }

        if (shouldDrawGrid){
            drawGrid();
        }
    }
}

function onKeyUp(e) {
    turnForward(true);
}

function onKeyDown(e){
	if (e.keyIdentifier == 'Left'){
		turnLeft(true);
	}
	else if (e.keyIdentifier == 'Right'){
		turnRight(true);
	}
	else if (e.keyIdentifier == 'Down'){
		turnDown(true);
	}
	else if (e.keyIdentifier == 'Up'){
		turnUp(true);
	}
	else if (e.keyIdentifier == 'U+0042'){
		blink(true);
	}
	else if (e.keyIdentifier == 'U+0057'){
		wink(true);
	}
	else if (e.keyIdentifier == 'U+0053'){
		smile(true);
	}
	else if (e.keyIdentifier == 'U+0054'){
		tongue(true);
	}
	else{
		console.log(e.keyIdentifier);
	}
	
	e.preventDefault();
}

function wireUpKeys() {
    addEvent(window, "keydown", onKeyDown);
    addEvent(window, "keyup", onKeyUp);
}

function moveForward(run) {

    if (!queueCommand(run, moveForward)) return;

    switch (direction) {
        case 'N':
            y -= moveAmount;
            break;
        case 'S':
            y += moveAmount;
            break;
        case 'E':
            x += moveAmount;
            break;
        case 'W':
            x -= moveAmount;
            break;
        default:
    }
    drawSteve();
}

// delay stuff ----------------------------    
var delayMs = 300;

function delay(callback) {
    pausecomp(delayMs);
    setTimeout(callback, 0, true);
}

function pausecomp(millis) {
    var date = new Date();
    var curDate = null;

    do {
        curDate = new Date();
    }
    while (curDate - date < millis);
}
// END delay stuff ----------------------------
