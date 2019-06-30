/**
 * @license Tetris v1.0.0 08/04/2014
 * http://www.xarg.org/project/tetris/
 *
 * Copyright (c) 2014, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

(function(window) {

    var document = window['document'];
    var location = window['location'];
    var navigator = window['navigator'];

    var canvas = document.getElementById('canvas');
    var preview = document.getElementById('preview');

    var favicon = document.getElementById('favicon');
    var fav = document.getElementById('fav');

    var divBest = document.getElementById('best');
    var divEdit = document.getElementById('edit');
    //var divOpen = document.getElementById('open');
    //var divOpenScore = document.getElementById('open2');

    var divScore = document.getElementById('score');

    var divTables = document.getElementById('tables');

    var highscore = document.getElementById('highscore');
    
    var sFB = document.getElementById('sFB');
    var sTW = document.getElementById('sTW');
    var sGP = document.getElementById('sGP');

    var ctx = canvas.getContext('2d');


    /**
     * Game Speed
     * 
     * @type number
     */
    var speed = 0;
    
    var diff = sessionStorage.getItem("diff");
    
    console.log(speed);
    
    if(diff == "Normaal"){
    	speed = 600;
    }
    
    else if(diff == "Moeilijk"){
    	speed = 200;
    }
    
    else if(diff == "Extreem"){
    	speed = 120;
    }
    
    else{
    	speed = 600;
    }

    console.log(speed);

    /**
     * Score for current speed
     * 
     * @type number
     */
    var speedScore = 0;

    /**
     * Somehow cheated? Entering the highscore isn't possible anymore
     * 
     * @type {boolean}
     */
    var expelled = false;


    /**
     * Game score
     * 
     * @type number
     */
    var score = 0;

    /**
     * Number of lines cleared
     * 
     * @type number
     */
    var clearedLines = 0;

    /**
     * Tile border width
     * 
     * @type number
     */
    var tileBorder = 2;

    /**
     * Number of tiles on the board in X direction
     * 
     * @type number
     */
    var tilesX = 10;

    /**
     * Number of tiles on the board in Y direction
     * 
     * @type number
     */
    var tilesY = 20;

    /**
     * The inner tile size - border exclusive
     * 
     * @type number
     */
    var tileSize = 16;


    /**
     * Game status types, enum doesn't fold properly :/
     */
    /**
     * 
     * @type {number}
     * @const
     */
    var STATUS_INIT = 0;
    /** 
     * @type {number}
     * @const
     */
    var STATUS_PLAY = 1;
    /** 
     * @type {number}
     * @const
     */
    var STATUS_PAUSE = 2;
    /** 
     * @type {number}
     * @const
     */
    var STATUS_GAMEOVER = 3;
    /** 
     * @type {number}
     * @const
     */
    var STATUS_WAIT = 4;

    /**
     * The actual game status
     * 
     * @type number
     */
    var gameStatus = STATUS_INIT;

    /**
     * Has the window lost the foucs?
     * 
     * @type boolean
     */
    var leftWindow = false;

    /**
     * Is the AI playing?
     * 
     * @type boolean
     */
    var autoMode = false;

    /**
     * Is the the helping shadow visible?
     * 
     * @type boolean
     */
    var showShadow = true;

    /**
     * Is the favicon animated?
     * 
     * @type boolean
     */


    /**
     * Is the preview box visible?
     * 
     * @type boolean
     */
    var showPreview = true;

    /**
     * The actual game board to work on (a Y/X matrix)
     * 
     * @type Array
     */
    var board;

    /**
     * The highest Y positions of all columns
     * 
     * @type Array
     */
    var topY;

    /**
     * The actual piece X position
     * 
     * @type number
     */
    var curX;

    /**
     * The actual piece Y position
     * @type number
     */
    var curY;

    /**
     * Game piece description, enum doesn't fold properly :/
     */

    /** 
     * @type {number}
     * @const
     */
    var PIECE_PROBABILITY = 0;
    /** 
     * @type {number}
     * @const
     */
    var PIECE_ROTATABLE = 1;
    /** 
     * @type {number}
     * @const
     */
    var PIECE_COLOR = 2;
    /** 
     * @type {number}
     * @const
     */
    var PIECE_SHAPE = 3;


    /**
     * The actual piece direction
     * @type number
     */
    var direction = PIECE_SHAPE;


    /**
     * Is Edit menu currently closed?
     * 
     * @type boolean
     */
    var menuOpen = false;


    /**
     * 
     * @type number
     */
    var pixelRatio = window['devicePixelRatio'] || 1;


    /**
     * All available piece definitions, see PIECE enum
     * @type Array
     */
    var pieces = [
        [
            0.25, // probability
            1, // rotatable
            [202, 81, 249], // pink
            [0, -1, -1, 0, 0, 0, 1, 0]
        ], [
            0.125, // probability
            1, // rotatable
            [255, 102, 0], // orange
            [0, -1, 0, 0, 0, 1, 1, 1]
        ], [
            0.125, // probability
            1, // rotatable
            [0, 255, 0], // green
            [0, -1, 0, 0, -1, 0, 1, -1]
        ], [
            0.125, // probability
            1, // rotatable
            [255, 0, 0], // red
            [0, -1, 0, 0, -1, 0, -1, 1]
        ], [
            0.125, // probability
            1, // rotatable
            [102, 204, 255], // light blue
            [-1, 0, 0, 0, 1, 0, 2, 0]
        ], [
            0.125, // probability
            1, // rotatable
            [0, 0, 255], // blue
            [-1, -1, -1, 0, 0, 0, 1, 0]
        ], [
            0.125, // probability
            0, // rotatable
            [255, 255, 0], // yellow
            [0, 0, 1, 0, 1, 1, 0, 1]
        ]
    ];

    /**
     * The fastest timer we can get
     * 
     * @type {Function}
     */
    var NOW;

    /**
     * The time when a game started
     * 
     * @type {Date}
     */
    var startTime = new Date;

    /**
     * The current piece flying around
     * 
     * @type Array
     */
    var curPiece;

    /**
     * The next piece in the queue
     * 
     * @type Array
     */
    var nextPiece;

    /**
     * The timeout ID of the running game
     * 
     * @type number
     */
    var loopTimeout;

    /**
     * The time of the flash effect in ms
     * @type number
     * @const
     */
    var flashTime = 350;
    	
    /**
     * Generates a rotated version of the piece
     * 
     * @param {Array} form the original piece
     * @returns {Array} The rotated piece
     */
    var getRotatedPiece = function(form) {

        var newForm = new Array(form.length);
        for (var i = 0; i < newForm.length; i+= 2) {
            newForm[i] = -form[i + 1];
            newForm[i + 1] = form[i];
        }
        return newForm;
    };


    /**
     * Get a new weighted random piece
     * 
     * @returns {Array} 
     */
    var getNextPiece = function() {

        var rnd = Math.random();
        for (var i = pieces.length; i--; ) {
            if (rnd < pieces[i][PIECE_PROBABILITY])
                return pieces[i];
            rnd-= pieces[i][PIECE_PROBABILITY];
        }
        return pieces[0];
    };


    /**
     * Take the next piece
     */
    var newPiece = function() {

        curPiece = nextPiece;
        nextPiece = getNextPiece();

        calcInitCoord();
    };


    /**
     * Calculate the initial coordinate of a new piece
     */
    var calcInitCoord = function() {

        var minY = -10;

        var cur = curPiece[direction];

        direction = PIECE_SHAPE + Math.random() * 4 | 0;

        for (var i = 0; i < cur.length; i+= 2) {

            minY = Math.max(minY, cur[i + 1]);
        }
        curX = tilesX >> 1;
        curY = -minY;
    };
    
    /**
     * Take the URL hash and set the initial settings
     */
    var prepareUrlHash = function(hash) {

        if (!hash) {
            return;
        }

        try {
            hash = JSON.parse(window['atob'](hash.slice(1)));
        } catch (e) {
            return;
        }

        // No highscore participation 
        setExpelled(true);

        if (hash['P']) {
            pieces = hash['P'];
        }

        if (hash['X']) {
            tilesX = hash['X'];
        }

        if (hash['Y']) {
            tilesY = hash['Y'];
        }

        if (hash['S']) {
            tileSize = hash['S'];
        }

        if (hash['B']) {
            tileBorder = hash['B'];
        }

        if (hash['Q']) {
            speed = hash['Q'];
        }
    };


    /**
     * Try if a move vertical move is valid 
     * 
     * @param {number} newY The new Y position to try
     * @returns {boolean} Indicator if it's possible to move
     */
    var tryDown = function(newY) {

        var cur = curPiece[direction];

        for (var i = 0; i < cur.length; i+= 2) {

            var x = cur[i] + curX;
            var y = cur[i + 1] + newY;

            if (y >= tilesY || board[y] !== undefined && board[y][x] !== undefined) {
                return false;
            }
        }
        curY = newY;
        return true;
    };


    /**
     * Try if a horizontal move is valid 
     * 
     * @param {number} newX The new X position to try
     * @param {number} dir The direction to try
     * @returns {boolean} Indicator if it's possible to move
     */
    var tryMove = function(newX, dir) {

        var cur = curPiece[dir];

        for (var i = 0; i < cur.length; i+= 2) {

            var x = cur[i] + newX;
            var y = cur[i + 1] + curY;

            if (x < 0 || x >= tilesX || y >= 0 && board[y][x] !== undefined) {
                return false;
            }
        }
        curX = newX;
        direction = dir;
        return true;
    };


    /**
     * Integrate the current piece into the board
     */
    var integratePiece = function() {

        var cur = curPiece[direction];

        for (var i = 0; i < cur.length; i+= 2) {

            // Check for game over
            if (cur[i + 1] + curY <= 0) {
                gameOver();
                break;
            } else {
                board[cur[i + 1] + curY][cur[i] + curX] = curPiece[PIECE_COLOR];
                topY[cur[i] + curX] = Math.min(topY[cur[i] + curX], cur[i + 1] + curY);
            }
        }

        if (gameStatus === STATUS_GAMEOVER) {
            pauseLoop();
        } else {
            checkFullLines();
        }

        updateScore(speedScore);
    };


    /**
     * Show the game over overlay
     */
    var gameOver = function() {

        gameStatus = STATUS_GAMEOVER;

        if (expelled) {

        } else {
            highscore.style.display = 'block';
        }
    };


    /**
     * Ultimately remove lines from the board
     * 
     * @param {Array} remove A stack of lines to be removed
     */
    var removeLines = function(remove) {

        var rp = remove.length - 1;
        var wp = remove[rp--];
        var mp = wp - 1;

        for (; mp >= 0; mp--) {

            if (rp >= 0 && remove[rp] === mp) {
                rp--;
            } else {
                board[wp--] = board[mp];
            }
        }

        while (wp >= 0) {
            board[wp--] = new Array(tilesX);
        }

        for (mp = tilesX; mp--; ) {

            topY[mp]+= remove.length;

            // It's not possible to simply add remove.length, because you can clear lines in arbitrary order
            while (topY[mp] < tilesY && board[topY[mp]][mp] === undefined) {
                topY[mp]++;
            }
        }

        // Calculate line scoring                    
        clearedLines+= remove.length;
        var setScore;
        switch (remove.length) {
	        case 0:
	            setScore = 0;
	            break;
	        case 1:
	        	setScore = 100;
	            break;
	        case 2:
	        	setScore = 200;
	            break;
	        case 3:
	        	setScore = 400;
	            break;
	        case 4:
	        	setScore = 800;
	            break;
        }
        updateScore(setScore);
    };


    /**
     * Check for full lines and drop them using removeLines()
     */
    var checkFullLines = function() {

        var flashColor = ['#fff', '#fff', '#fff'];

        var remove = [];

        for (var x, y = 0; y < tilesY; y++) {

            for (x = tilesX; x--; ) {

                if (board[y][x] === undefined) {
                    break;
                }
            }

            if (x < 0) {
                remove.push(y);
            }
        }

        if (remove.length > 0) {

            if (flashTime > 0) {

                gameStatus = STATUS_WAIT;
                pauseLoop();

                animate(flashTime, function(pos) {

                    var cond = pos * 10 & 1;

                    // Simply paint a flash effect over the current tiles
                    for (var i = 0; i < remove.length; i++) {

                        for (var x = tilesX; x--; ) {

                            if (cond) {
                                drawTile(ctx, x, remove[i], flashColor);
                            } else if (board[remove[i]][x] !== undefined) {
                                drawTile(ctx, x, remove[i], board[remove[i]][x]);
                            }
                        }
                    }

                }, function() {

                    removeLines(remove);

                    newPiece();

                    draw();
                    gameStatus = STATUS_PLAY;
                    loop();

                }, flashTime / 10);

            } else {

                removeLines(remove);

                newPiece();

                draw();
            }

        } else {
            newPiece();
        }
    };


    /**
     * The main loop of the game
     */
    var loop = function() {

        // If AI
        if (autoMode) {

            if (findOptimalSpot()) {
                integratePiece();
            }

        } else if (!tryDown(curY + 1)) {
            integratePiece();
        }

        draw();

        // AI or normal game
        if (gameStatus === STATUS_PLAY) {
            loopTimeout = window.setTimeout(loop, speed);
        }
    };


    /**
     * Pause the main loop
     */
    var pauseLoop = function() {

        window.clearTimeout(loopTimeout);
    };


    /**
     * Update the score
     * 
     * @param {number} n The number of points to add to the actual score
     */
    var updateScore = function(n) {

        score+= n;

        divScore.innerHTML = score;
    };


    /**
     * Find the optimal spot of a tile
     * 
     * @returns {boolean} Indicator if we found the spot already (false to indicate a small step)
     */
    var findOptimalSpot = function() {

        /**
         * @type number
         */
        var minCost = 100;
        
        /**
         * @type number
         */
        var minDir;
        
        /**
         * @type number
         */
        var minX;

        for (var o = PIECE_SHAPE; o < PIECE_SHAPE + 4; o++) {

            for (var x = tilesX; x--; ) {

                if (tryMove(x, o)) {

                    var cost = calcCost(x, o);

                    if (cost < minCost) {
                        minCost = cost;
                        minDir = o;
                        minX = x;
                    }
                }
            }

        }

        curX = minX;
        direction = minDir;
        
        while (tryDown(curY + 1)) {}
        
        return true;
    };


    /**
     * Calculate the cost to set the new element at the curX and rotation position
     * 
     * @param {number} curX The position to be checked
     * @param {number} rotation The rotation to be checked
     * @returns {number} The actual cost of the position
     */
    var calcCost = function(curX, rotation) {

        var cur = curPiece[rotation];

        // Calculate the height
        var dist = tilesY;
        for (var i = 0; i < cur.length; i+= 2) {
            dist = Math.min(dist, topY[curX + cur[i]] - curY - cur[i + 1]);
        }

        var minY = tilesY;
        for (var i = 0; i < cur.length; i+= 2) {
            minY = Math.min(minY, cur[i + 1] + curY + dist - 1);
        }

        if (minY < 0)
            return tilesY; // Something big

        // Count existing holes
        var holes = 0;
        for (var i = topY[curX + cur[i]]; i < tilesY; i++) {
            holes+= board[curX + cur[i]][i] === undefined;
        }

        // Count holes we're creating now
        var newHoles = 0;

        for (var i = 0; i < cur.length; i+= 2) {

            // Shadow-Tile position
            var x = cur[i] + curX;
            var y = cur[i + 1] + curY + dist - 1;
            var take = true;

            // Ignore tiles in the same column that are higher
            for (var j = 0; j < cur.length; j+= 2) {

                if (i !== j) {

                    if (cur[i] === cur[j] && cur[i + 1] < cur[j + 1]) {
                        take = false;
                        break;
                    }
                }
            }

            if (take) {

                for (j = y + 1; j < tilesY && board[j][x] === undefined; j++) {
                    newHoles++;
                }
            }
        }

        return (1 / minY + holes + newHoles);
    };


    /**
     * Draw a single tile on the screen
     * 
     * @param {CanvasRenderingContext2D} ctx The context to be used
     * @param {number} x X position on the grid
     * @param {number} y Y position on the grid
     * @param {Array} color - A RGB array
     */
    var drawTile = function(ctx, x, y, color) {

        ctx.save();

        ctx.translate(tileBorder + x * (tileBorder + tileSize), tileBorder + y * (tileBorder + tileSize));

        // Draw the tile border
        ctx.fillStyle = "#000";
        ctx.fillRect(-tileBorder, -tileBorder, tileSize + tileBorder + tileBorder, tileSize + tileBorder + tileBorder);

        // Draw a light inner border
        ctx.fillStyle = color[2];
        ctx.fillRect(0, 0, tileSize, tileSize);

        // Draw a dark inner border
        ctx.fillStyle = color[1];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, tileSize);
        ctx.lineTo(tileSize, tileSize);
        ctx.closePath();
        ctx.fill();

        // Draw the actual tile
        ctx.fillStyle = color[0];
        ctx.fillRect(tileBorder, tileBorder, tileSize - 2 * tileBorder, tileSize - 2 * tileBorder);

        ctx.restore();

    };


    /**
     * Draw a single tile in shadow color
     * 
     * @param {CanvasRenderingContext2D} ctx The context to be used
     * @param {number} x X position on the grid
     * @param {number} y Y position on the grid
     */
    var drawShadow = function(ctx, x, y) {

        ctx.save();

        ctx.translate(tileBorder + x * (tileBorder + tileSize), tileBorder + y * (tileBorder + tileSize));

        ctx.fillStyle = "#b7c7e4";
        ctx.fillRect(0, 0, tileSize, tileSize);

        ctx.restore();
    };


    /**
     * Draw a text on the screen
     * 
     * @param text The text to be drawn
     */
    var drawTextScreen = function(text) {

        ctx.font = "20px Lemon";

        // Background layer
        ctx.fillStyle = "rgba(119,136,170,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var size = ctx.measureText(text);

        ctx.fillStyle = "#fff";
        ctx.fillText(text, (canvas.width - size.width) / 2, canvas.height / 4);
    };


    /**
     * Initialize the game with a countdown
     */
    var init = function() {

        var cnt = 4;

        prepareBoard();

        curPiece = getNextPiece();
        nextPiece = getNextPiece();

        calcInitCoord();

        gameStatus = STATUS_INIT;

        score = clearedLines = 0;

        animate(4000, function() {

            cnt--;

            if (!cnt) {
                cnt = 'GO';
                ctx.fillStyle = "black";
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set the font once
            ctx.font = "40px Lemon";

            var size = ctx.measureText(cnt);

            ctx.fillText(cnt, (canvas.width - size.width) / 2, canvas.height / 3);

        }, function() {

            gameStatus = STATUS_PLAY;
            loop();

        }, 1000);
    };
    

    /**
     * Update the social links
     */
    var updateSocialLinks = function() {

        var fb = 'https://www.facebook.com/sharer/sharer.php?u=';
        var tw = 'http://twitter.com/share?text=Check%20out%20my%20custom%20HTML5%20Tetris%20(made%20by%20%40RobertEisele)&amp;url=';
        var gp = 'https://plus.google.com/share?url=';

        var P = [];
        
        for (var i = pieces.length; i--; ) {

            P[i] = pieces[i].slice(0, 1 + PIECE_SHAPE); // Upper slice() bound is exclusive, so 1+x
            P[i][PIECE_PROBABILITY] = 1; // We kill the probability for sake of string length. Maybe we'll find a better solution
           
            P[i][PIECE_COLOR] = P[i][PIECE_COLOR][0].substring(4, P[i][PIECE_COLOR][0].length - 1).split(',');
        }

        try {

            // See prepareUrlHash() as the opposite endpoint
            location.hash = window['btoa'](JSON.stringify({
                'P': P,
                'X': tilesX,
                'Y': tilesY,
                'S': tileSize,
                'B': tileBorder,
                'Q': speed
            }));
            
        } catch (e) {
            return;
        }

        var url = encodeURIComponent(location.href);
        sFB.setAttribute('href', fb + url);
        sTW.setAttribute('href', tw + url);
        sGP.setAttribute('href', gp + url);
    };

    function addScore(score) {	
        switch (sessionStorage.getItem("diff")) {
        case "Normaal":
            rank = 1;
            break;
        case "Moeilijk":
        	rank = 2;
            break;
        case "Extreem":
        	rank = 3;
            break;
        }
        
    	let fetchoptions = {
    			method: 'GET',
    			headers: {
    				'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
    			}
    		}
    	
        fetch('restservices/stuff/getScore/' + sessionStorage.getItem("email") + "/" + rank, fetchoptions)
		.then((response) => {
			if(response.status == 500){
				let fetchoptions2 = {
		    			method: 'POST',
		    			headers: {
		    				'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
		    			}
		    		}
		    		
		    		fetch('restservices/stuff/addScore/' + sessionStorage.getItem("email") + "/" + rank + "/" + rank + "/" + score, fetchoptions2)
		    		.then((response) => {
		    			console.log(response.status);
		    			location.href = 'index.html';
		    		});
		    		
		    		return false;
			}
		});
    }
    /**
     * Draw all components on the screen
     */
    var draw = function() {

        // http://jsperf.com/ctx-clearrect-vs-canvas-width-canvas-width/3
        // Should be fine and also the standard way to go
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        var cur = curPiece[direction];

        for (var y = tilesY; y--; ) {

            // Draw board
            for (var x = tilesX; x--; ) {

                if (board[y][x] !== undefined) {
                    drawTile(ctx, x, y, board[y][x]);
                }
            }
        }

        if (showShadow && !autoMode) {

            var dist = tilesY;
            for (var i = 0; i < cur.length; i+= 2) {
                dist = Math.min(dist, topY[cur[i] + curX] - (curY + cur[i + 1]));
            }

            for (var i = 0; i < cur.length; i+= 2) {
                drawShadow(ctx, cur[i] + curX, cur[i + 1] + curY + dist - 1);
            }
        }

        // Draw current piece
        for (var i = 0; i < cur.length; i+= 2) {

            drawTile(ctx, cur[i] + curX, cur[i + 1] + curY, curPiece[PIECE_COLOR]);
        }

        
        /* DEBUG LINES
         for (var i = 0; i < tilesX; i++) {
            ctx.save();
            ctx.fillStyle = "orange";
            ctx.translate(tileBorder + i * (tileBorder + tileSize), topY[i] * (tileBorder + tileSize) - tileBorder);
            ctx.fillRect(0, 0, tileSize, 2);
         
            ctx.restore();
         }
         */

        // Draw text overlay
        if (gameStatus === STATUS_PAUSE) {
            drawTextScreen("PAUSE");
        } else if (gameStatus === STATUS_GAMEOVER) {
        	
            document.getElementById('eindScore').innerHTML = 'Score: ' + score;

            if(sessionStorage.getItem('isLoggedIn') == "true"){
            	let fetchoptions = {
            			headers: {
            				'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
            			}
            		}
            	var rank;
            	
                switch (sessionStorage.getItem("diff")) {
                case "Normaal":
                    rank = 1;
                    break;
                case "Moeilijk":
                	rank = 2;
                    break;
                case "Extreem":
                	rank = 3;
                    break;
                }
            	
                fetch('restservices/stuff/getScore/' + sessionStorage.getItem("email") + "/" + rank, fetchoptions)
    			.then((response) => {
    				if(response.status == 500){
    	            	document.getElementById('noScoreAdd').style.display = "none";
    	                document.getElementById("ja").addEventListener("click", function(){
    	                	addScore(score);
    	                });
    	                document.getElementById("nee").addEventListener("click", function(){
    	                	location.href = 'index.html';
    	                });
    				}
    				else {
    					document.getElementById('scoreAdd').style.display = "none";

						fetch('restservices/stuff/getScore/' + sessionStorage.getItem("email") + "/" + rank, fetchoptions)
						.then((response) => { 
    						if (response.ok) {
    							return response.json();
    						}
    					})
						.then((myJson) => {
							if (score > myJson.aantal){
								let fetchoptions2 = {
						    			method: 'PUT',
						    			headers: {
						    				'Authorization': 'Bearer ' + window.sessionStorage.getItem("sessionToken")
						    			}
						    		}
						    		
						    		fetch('restservices/stuff/updateScore/' + sessionStorage.getItem("email") + "/" + rank + "/" + score, fetchoptions2)
						    		.then((response) => {
						    			console.log(response.status);
						    		});
							}
						});
    				}
    			});
            }
            
            else{
            	document.getElementById('scoreAdd').style.display = "none";
            }
        }
    };

    /**
     * Prepare the board
     */
    var prepareBoard = function() {

        board = new Array(tilesY);
        for (var y = tilesY; y--; ) {
            board[y] = new Array(tilesX);
        }

        topY = new Array(tilesX);
        for (var i = tilesX; i--; ) {
            topY[i] = tilesY;
        }

        canvas.width = tileBorder + tilesX * (tileBorder + tileSize);
        canvas.height = tileBorder + tilesY * (tileBorder + tileSize);

    };


    /**
     * Prepare the pieces and caches some values
     * 
     * @param {Array} pieces The array of pieces
     */
    var preparePieces = function(pieces) {

        var sum = 0;
        var opacity = 0.2;

        for (var i = pieces.length; i--; ) {

            // Pre-compute tile colors
            var color = pieces[i][PIECE_COLOR];

            color[0]|= 0;
            color[1]|= 0;
            color[2]|= 0;

            pieces[i][PIECE_COLOR] = [
                // Normal color
                "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")",
                // Dark color
                "rgb(" + Math.round(color[0] - color[0] * opacity) + "," + Math.round(color[1] - color[1] * opacity) + "," + Math.round(color[2] - color[2] * opacity) + ")",
                // Light color
                "rgb(" + Math.round(color[0] + (255 - color[0]) * opacity) + "," + Math.round(color[1] + (255 - color[1]) * opacity) + "," + Math.round(color[2] + (255 - color[2]) * opacity) + ")"
            ];

            // Add rotations
            for (var j = PIECE_SHAPE; j < 4 - 1 + PIECE_SHAPE; j++) {

                if (pieces[i][PIECE_ROTATABLE])
                    pieces[i][j + 1] = getRotatedPiece(pieces[i][j]);
                else
                    pieces[i][j + 1] = pieces[i][PIECE_SHAPE].slice(0);
            }

            // Calculate weight sum
            sum+= pieces[i][PIECE_PROBABILITY];
        }
    };


    /**
     * Set the actual rendered favicon
     */
    var setFavicon = function() {
        fav['href'] = favicon['toDataURL']('image/png');
    };


    /**
     * A simple animation loop
     * 
     * @param {number} duration The animation duration in ms
     * @param {Function} fn The callback for every animation step
     * @param {Function=} done The finish callback
     * @param {number=} speed The speed of the animation 
     */
    var animate = function(duration, fn, done, speed) {

        var start = NOW();
        var loop;

        // We could use the requestAni shim, but yea...it's just fine
        (loop = function() {

            var now = NOW();

            var pct = (now - start) / duration;
            if (pct > 1)
                pct = 1;

            fn(pct);

            if (pct === 1) {
                done();
            } else {
                window.setTimeout(loop, speed || /* 1000 / 60*/ 16);
            }
        })();
    };


    /**
     * Attach a new event listener
     * 
     * @param {Object} obj DOM node
     * @param {string} type The event type
     * @param {Function} fn The Callback
     */
    var addEvent = function(obj, type, fn) {

        if (obj.addEventListener) {
            return obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            return obj.attachEvent("on" + type, fn);
        }
    };

    
    /**
     * Set the game mode to expelled, means highscore participation is disabled (because of custom game)
     * 
     * @param {boolean=} diag Prevent the dialogue
     */
    var setExpelled = function(diag) {

        if (!expelled && !diag) {
            alert("This disables highscore participation.");
        }
        expelled = true;
        displayHomeLink();
    };
    
    /*
     * Display the home link when needed
     */
    var displayHomeLink = function() {
        document.getElementById('home').style.display = 'block';
    };


    // Set the click handler for menu opening
    var evTabOpen = function(ev) {

        var elm = ev.target.parentNode;

        if (elm === divEdit) {
            divEdit.style.zIndex = 4;
            divBest.style.zIndex = 2;
        } else {
            divEdit.style.zIndex = 2;
            divBest.style.zIndex = 4;
        }

        animate(600, function(k) {
            /*
             var pos = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
             
             pos = editClosed + pos * (1 - 2 * editClosed);
             
             edit.style.right = (-pos * 420 | 0) + 'px';
             */
            elm.style.right = (420 * ((k === 1 ? 1 : 1 - Math.pow(2, -10 * k)) * (1 - 2 * menuOpen) + menuOpen - 1) | 0) + 'px';
        }, function() {
            menuOpen = !menuOpen;
        });
    };
    //addEvent(divOpen, 'click', evTabOpen);
   // addEvent(divOpenScore, 'click', evTabOpen);

    // Set keydown event listener
    addEvent(window, "keydown", function(ev) {

        if (gameStatus !== STATUS_PLAY && ev.keyCode !== 80 && ev.keyCode !== 9)
            return;

        switch (ev.keyCode) {
            case 37: // left
                tryMove(curX - 1, direction);
                draw();
                break;
            case 39: // right
                tryMove(curX + 1, direction);
                draw();
                break;
            case 38: // up
                tryMove(curX, PIECE_SHAPE + (direction - PIECE_SHAPE + 1) % 4);
                draw();
                break;
            case 40: // down
                if (!tryDown(curY + 1))
                    integratePiece();
                draw();
                break;
            case 32: // space
                while (tryDown(curY + 1)) {
                }
                integratePiece();
                draw();
                break;
            case 65: // a
                autoMode = !autoMode;
                document.getElementById('Cauto').checked = autoMode;
                setExpelled();
                return;
            case 83: // s
                showShadow = !showShadow;
                document.getElementById('Cshadow').checked = showShadow;
                return;
            case 9:
                // fall to preventDefault, as we forbid tab selection (we have hidden input fields. chrome scrolls to them)
                break;
            default:
                return;
        }
        ev.preventDefault();
    });

    // Set window leave listener
    addEvent(window, 'blur', function() {

        if (gameStatus !== STATUS_PLAY)
            return;

        gameStatus = STATUS_PAUSE;

        leftWindow = true;

        pauseLoop();

        draw();
    });

    // Set comeback listener
    addEvent(window, 'focus', function() {

        if (!leftWindow || gameStatus !== STATUS_PAUSE) {
            return;
        }

        gameStatus = STATUS_PLAY;

        leftWindow = false;

        loop();
    });

    if (window['performance'] !== undefined && window['performance']['now'] !== undefined) {
        NOW = function() {
            return window.performance.now();
        };
    } else if (Date.now !== undefined) {
        NOW = Date.now;
    } else {
        NOW = function() {
            return new Date().valueOf();
        };
    }

    // Display the open buttons for the menus
    window.setTimeout(function() {

        animate(400, function(pos) {

            var start = -442;
            var end = -420;

            var p1 = Math.min(1, pos / 0.5);
            var p2 = Math.max(0, (pos - 0.5) / 0.5);
        }, function() { });

    }, 800);

    // Overwrite a custom setting with the defaults
    prepareUrlHash(location['hash']);
    
    // Prepare the pieces and pre-calculate some caches
    preparePieces(pieces);
    
    if (location['hash']) {
        // If a URL was given, update social links
        updateSocialLinks();
    }
    
    // Prepare the board
    prepareBoard();
    
    // Initialize the game
    init();
    
    document.getElementById('diff').innerHTML = diff;
    
})(this);
