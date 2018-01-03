// direction enums (in clockwise order)
var DIR_UP = 0;
var DIR_RIGHT = 1;
var DIR_DOWN = 2;
var DIR_LEFT = 3;

// get direction enum from a direction vector
var getEnumFromDir = function(dir) {
    if (dir.x==-1) return DIR_LEFT;
    if (dir.x==1) return DIR_RIGHT;
    if (dir.y==-1) return DIR_UP;
    if (dir.y==1) return DIR_DOWN;
};

// set direction vector from a direction enum
var setDirFromEnum = function(dir,dirEnum) {
    if (dirEnum == DIR_UP)         { dir.x = 0; dir.y =-1; }
    else if (dirEnum == DIR_RIGHT)  { dir.x =1; dir.y = 0; }
    else if (dirEnum == DIR_DOWN)  { dir.x = 0; dir.y = 1; }
    else if (dirEnum == DIR_LEFT) { dir.x = -1; dir.y = 0; }
};

// size of a square tile in pixels
var tileSize = 8;

/////////////////////////////////////////////////
//
// actor starting states

midTile = {x:3,y:4};

var blinky = {};
blinky.color = "#FF0000";

var pinky = {};
pinky.color = "#FFB8FF";

var inky = {};
inky.color = "#00FFFF";

var clyde = {};
clyde.color = "#FFB851";

var pacman = {};
pacman.color = "#FFFF00";

var itile = function() {

    var dx = Math.round(this.ftile.x);
    var dy = Math.round(this.ftile.y);

    return {x: dx, y: dy};
}

var pixeloc = function() {

    var px = this.ftile.x*tileSize + midTile.x;
    var py = this.ftile.y*tileSize + midTile.y;

    return {x: px, y: py};
};

var ghosts = [blinky,inky,pinky,clyde];

blinky.dirEnum = DIR_LEFT;
blinky.itile = itile
blinky.ftile = {
    x: 14,
    y: 14
}
blinky.pixel = pixeloc;

pinky.dirEnum = DIR_DOWN;
pinky.itile = itile
pinky.ftile = {
    x: 14, 
    y: 17
}
pinky.pixel = pixeloc;

inky.dirEnum = DIR_UP;
inky.itile = itile
inky.ftile = {
    x: 12,
    y: 17
} 
inky.pixel = pixeloc;

clyde.dirEnum = DIR_UP;
clyde.itile = itile
clyde.ftile = {
    x: 16,
    y: 17
}
clyde.pixel = pixeloc;

pacman.dirEnum = DIR_LEFT;
pacman.itile = itile
pacman.ftile = {
    x: 14,
    y: 26
}
pacman.pixel = pixeloc;
pacman.score = 0;

//////////////////////////////////////////////////////////////
// Sprites
// (sprites are created using canvas paths)

var drawGhostSprite = (function(){

    // add top of the ghost head to the current canvas path
    var addHead = (function() {

        // pixel coordinates for the top of the head
        // on the original arcade ghost sprite
        var coords = [
            0,6,
            1,3,
            2,2,
            3,1,
            4,1,
            5,0,
            8,0,
            9,1,
            10,1,
            11,2,
            12,3,
            13,6,
        ];

        return function(ctx) {
            var i;
            ctx.save();

            // translate by half a pixel to the right
            // to try to force centering
            ctx.translate(0.5,0);

            ctx.moveTo(0,6);
            ctx.quadraticCurveTo(1.5,0,6.5,0);
            ctx.quadraticCurveTo(11.5,0,13,6);

            // draw lines between pixel coordinates
            /*
            ctx.moveTo(coords[0],coords[1]);
            for (i=2; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);
            */

            ctx.restore();
        };
    })();

    // add first ghost animation frame feet to the current canvas path
    var addFeet1 = (function(){

        // pixel coordinates for the first feet animation
        // on the original arcade ghost sprite
        var coords = [
            13,13,
            11,11,
            9,13,
            8,13,
            8,11,
            5,11,
            5,13,
            4,13,
            2,11,
            0,13,
        ];

        return function(ctx) {
            var i;
            ctx.save();

            // translate half a pixel right and down
            // to try to force centering and proper height
            ctx.translate(0.5,0.5);

            // continue previous path (assuming ghost head)
            // by drawing lines to each of the pixel coordinates
            for (i=0; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);

            ctx.restore();
        };

    })();

    // add second ghost animation frame feet to the current canvas path
    var addFeet2 = (function(){

        // pixel coordinates for the second feet animation
        // on the original arcade ghost sprite
        var coords = [
            13,12,
            12,13,
            11,13,
            9,11,
            7,13,
            6,13,
            4,11,
            2,13,
            1,13,
            0,12,
        ];

        return function(ctx) {
            var i;
            ctx.save();

            // translate half a pixel right and down
            // to try to force centering and proper height
            ctx.translate(0.5,0.5);

            // continue previous path (assuming ghost head)
            // by drawing lines to each of the pixel coordinates
            for (i=0; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);

            ctx.restore();
        };

    })();

    // draw regular ghost eyes
    var addEyes = function(ctx,dirEnum){
        var i;

        ctx.save();
        ctx.translate(2,3);

        var coords = [
            0,1,
            1,0,
            2,0,
            3,1,
            3,3,
            2,4,
            1,4,
            0,3
        ];

        var drawEyeball = function() {
            ctx.translate(0.5,0.5);
            ctx.beginPath();
            ctx.moveTo(coords[0],coords[1]);
            for (i=2; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.translate(-0.5,-0.5);
            //ctx.fillRect(1,0,2,5); // left
            //ctx.fillRect(0,1,4,3);
        };

        // translate eye balls to correct position
        if (dirEnum == DIR_LEFT) ctx.translate(-1,0);
        else if (dirEnum == DIR_RIGHT) ctx.translate(1,0);
        else if (dirEnum == DIR_UP) ctx.translate(0,-1);
        else if (dirEnum == DIR_DOWN) ctx.translate(0,1);

        // draw eye balls
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 1.0;
        drawEyeball();
        ctx.translate(6,0);
        drawEyeball();

        // translate pupils to correct position
        if (dirEnum == DIR_LEFT) ctx.translate(0,2);
        else if (dirEnum == DIR_RIGHT) ctx.translate(2,2);
        else if (dirEnum == DIR_UP) ctx.translate(1,0);
        else if (dirEnum == DIR_DOWN) ctx.translate(1,3);

        // draw pupils
        ctx.fillStyle = "#00F";
        ctx.fillRect(0,0,2,2); // right
        ctx.translate(-6,0);
        ctx.fillRect(0,0,2,2); // left

        ctx.restore();
    };

    // draw scared ghost face
    var addScaredFace = function(ctx,flash){
        ctx.strokeStyle = ctx.fillStyle = flash ? "#F00" : "#FF0";

        // eyes
        ctx.fillRect(4,5,2,2);
        ctx.fillRect(8,5,2,2);

        // mouth
        var coords = [
            1,10,
            2,9,
            3,9,
            4,10,
            5,10,
            6,9,
            7,9,
            8,10,
            9,10,
            10,9,
            11,9,
            12,10,
        ];
        ctx.translate(0.5,0.5);
        ctx.beginPath();
        ctx.moveTo(coords[0],coords[1]);
        for (i=2; i<coords.length; i+=2)
            ctx.lineTo(coords[i],coords[i+1]);
        ctx.lineWidth = 1.0;
        ctx.stroke();
        ctx.translate(-0.5,-0.5);
        /*
        ctx.fillRect(1,10,1,1);
        ctx.fillRect(12,10,1,1);
        ctx.fillRect(2,9,2,1);
        ctx.fillRect(6,9,2,1);
        ctx.fillRect(10,9,2,1);
        ctx.fillRect(4,10,2,1);
        ctx.fillRect(8,10,2,1);
        */
    };


    return function(ctx,frame,dirEnum,scared,flash,eyes_only,color) {
        if (scared)
            color = energizer.isFlash() ? "#FFF" : "#2121ff";

        if (!eyes_only) {
            // draw body
            ctx.beginPath();
            addHead(ctx);
            if (frame == 0)
                addFeet1(ctx);
            else
                addFeet2(ctx);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        // draw face
        if (scared)
            addScaredFace(ctx, flash);
        else
            addEyes(ctx,dirEnum);
    };
})();

// draw pacman body
var drawPacmanSprite = function(ctx,dirEnum,angle,mouthShift,scale,centerShift,alpha) {

    if (centerShift == undefined) centerShift = 0;
    if (mouthShift == undefined) mouthShift = 0;
    if (scale == undefined) scale = 1;
    if (alpha == undefined) alpha = 1;

    ctx.save();

    // rotate to current heading direction
    var d90 = Math.PI/2;
    if (dirEnum == DIR_UP) ctx.rotate(3*d90);
    else if (dirEnum == DIR_RIGHT) ctx.rotate(0);
    else if (dirEnum == DIR_DOWN) ctx.rotate(d90);
    else if (dirEnum == DIR_LEFT) ctx.rotate(2*d90);

    // plant corner of mouth
    ctx.beginPath();
    ctx.moveTo(-3+mouthShift,0);

    // draw head outline
    ctx.arc(centerShift,0,6.5*scale,angle,2*Math.PI-angle);
    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,0," + alpha + ")";
    ctx.fill();

    ctx.restore();
};

var drawGhosts = function(ctx) {
    var i=0;
    var actorSize = (tileSize-1)*2;
    for (i=0;i<4;i++) {
        var g = ghosts[i];
        ctx.save();
        var pixg = g.pixel();
        ctx.translate(pixg.x-actorSize/2+1, pixg.y-actorSize/2);
        var frame = 0;
        drawGhostSprite(ctx,frame,g.dirEnum,g.scared,false,false,g.color);
        ctx.restore();
    }
};

var mouthFrame = 0;
var drawPlayer = function(ctx) {
    ctx.save();
    pacp = pacman.pixel(); 
    ctx.translate(pacp.x+1, pacp.y);
    var ratio = Math.pow(Math.sin(mouthFrame), 2);
    drawPacmanSprite(ctx, pacman.dirEnum, ratio*Math.PI/6);
    mouthFrame++;
    ctx.restore();
};

var drawActors = function(ctx) {
    drawGhosts(ctx);
    drawPlayer(ctx);
};
