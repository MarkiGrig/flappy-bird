let oldRandom = Math.random;
Math.random = function(min, max) {
    if ( max ) {
        if ( typeof( min ) == "number" && typeof( max ) == "number" ) {
            return Math.floor(oldRandom.call(this) * (max - min + 1)) + min;
        } else {
            return false;
        }
    } else if ( typeof( min ) == "number" ) {
        return Math.floor(oldRandom.call(this) * (min - 1 + 1)) + 1;
    } else {
        return false;
    }
};

//получение Y при подставлении в уравнение прямой по двум точкам соответствующего X
const solveY = (pointOne, pointTwo, x) => {
    return (((x - pointOne.x) * (pointTwo.y - pointOne.y)
        + pointOne.y * (pointTwo.x - pointOne.x)) / (pointTwo.x - pointOne.x));
};

const canvas = document.getElementById("canvasMain");
const context = canvas.getContext("2d");
const canvasBird = document.getElementById("canvasBird");
const contextBird = canvasBird.getContext("2d");

let pipeCeiling = new Image();
pipeCeiling.src = '../img/flappy_bird_pipeUp.png';

let pipeFloor = new Image();
pipeFloor.src = '../img/flappy_bird_pipeBottom.png';

let background = new Image();
background.src = '../img/bg.png';

let foreground = new Image();
foreground.src = "../img/flappy_bird_fg.png";

let birdRotated = new Image();
birdRotated.src = '../img/flappy_bird_bird.png';
birdRotated.X = 40;
birdRotated.Y = 150;
birdRotated.velocityY = 0; //was equal to 10


let bird = new Image();
bird.src = '../img/flappy_bird_bird.png';

contextBird.translate(5, 9);
contextBird.drawImage(bird, 0, 0);
contextBird.translate(-5, -9);

class BirdRotatedHitBox {
    constructor() {
        this.dotHead = {
            x: birdRotated.X + 17,
            y: birdRotated.Y + 10,
            radius: 0,
            angle: 0
        };
        this.dotTail = {
            x: birdRotated.X + 7,
            y: birdRotated.Y + 24,
            radius: 0,
            angle: 0
        };
        this.dotStomach = {
            x: birdRotated.X + 16,
            y: birdRotated.Y + 33,
            radius: 0,
            angle: 0
        };
        this.dotThroat = {
            x: birdRotated.X + 36,
            y: birdRotated.Y + 31,
            radius: 0,
            angle: 0
        };
        this.dotMouth = {
            x: birdRotated.X + 41,
            y: birdRotated.Y + 28,
            radius: 0,
            angle: 0
        };
        this.dotEye = {
            x: birdRotated.X + 32,
            y: birdRotated.Y + 10,
            radius: 0,
            angle: 0
        };
        this.dotCenter = {
            x: birdRotated.X + canvasBird.width / 2,
            y: birdRotated.Y + canvasBird.height / 2,
            radius: 0,
            angle: 0
        };
        this.setAngle().setRadius();
    }
        setRadius() {
            for (let dot in this) {
                this[dot].radius = Math.sqrt((this.dotCenter.x - this[dot].x) ** 2 +
                    (this.dotCenter.y - this[dot].y) ** 2);
            }
            this.dotCenter.radius = 0;
            return this;
        }
        setAngle() {
            for (let dot in this) {
                const x = this[dot].x - this.dotCenter.x;
                const y = this[dot].y - this.dotCenter.y;
                this[dot].angle = Math.atan(-y/x) *180/Math.PI;
                if (x < 0 && y < 0) {
                    this[dot].angle = 180 - this[dot].angle;
                }
                if (this[dot].angle > 180) {
                    this[dot].angle = 360 - this[dot].angle;
                }
                if (x < 0 && y > 0) {
                    this[dot].angle =  - 180 + this[dot].angle;
                }
            }
            this.dotCenter.angle = 0;
            return this;
        }
        print() {
            context.beginPath();
            context.moveTo(this.dotHead.x, this.dotHead.y);
            context.lineTo(this.dotTail.x, this.dotTail.y);
            context.lineTo(this.dotStomach.x, this.dotStomach.y);
            context.lineTo(this.dotThroat.x, this.dotThroat.y);
            context.lineTo(this.dotMouth.x, this.dotMouth.y);
            context.lineTo(this.dotEye.x,this.dotEye.y);
            context.lineTo(this.dotHead.x, this.dotHead.y);
            context.lineWidth = 1;
            context.stroke();
            context.fillStyle = "green";
            context.fillRect(this.dotCenter.x, this.dotCenter.y, 1, 1);
            return this;
        }
}

//rotating bird
let angle = 0;
let angleCurrent = 0;

const rotate = (angle) => {
    contextBird.save();
    contextBird.setTransform(1, 0, 0, 1, 0, 0);
    contextBird.clearRect(0, 0, canvasBird.width, canvasBird.height);
    contextBird.restore();

    contextBird.translate(5, 9);
    contextBird.drawImage(bird, 0, 0);
    contextBird.translate(-5, -9);

    contextBird.translate(canvasBird.width / 2, canvasBird.height / 2);
    contextBird.rotate((angle - angleCurrent) * Math.PI / 180);
    contextBird.translate(-canvasBird.width / 2, -canvasBird.height / 2);

    angleCurrent = angle;
};

//------Control events-----//
let isKeyPressed = false;
const moveUp = () => {
    if (isKeyPressed) return false;
    if (birdRotated.velocityY > 0) {
        birdRotated.velocityY = -30 ;
    } else {
        birdRotated.velocityY -= 30;
    }
    isKeyPressed = true;
    return true;
};

const keyUp = () => isKeyPressed = false;

document.addEventListener("keypress", moveUp);
document.addEventListener("keyup", keyUp);
//-------------------------//

let isAlive = true;

let update = {
    birdImg() {
        birdRotated.src = canvasBird.toDataURL();
        return this;
    },
    birdY() {
        const timeUnit = 0.14;
        birdRotated.velocityY += 14 * timeUnit;
        const delta = birdRotated.velocityY * timeUnit;
        birdHitBox.dotCenter.y = Math.round(birdHitBox.dotCenter.y +  delta);
        birdRotated.Y += Math.round(birdRotated.y +  delta);
        return this;
    },
    newFrame() {
        requestAnimationFrame(draw);
        return this;
    },
    hitBox() {
        for (let dot in birdHitBox) {
            birdHitBox[dot].x = Math.round(birdHitBox.dotCenter.x +
                Math.cos((-angle-birdHitBox[dot].angle) * Math.PI / 180) * birdHitBox[dot].radius);
            const newY = Math.round(birdHitBox.dotCenter.y +
                Math.sin((-angle-birdHitBox[dot].angle) * Math.PI / 180) * birdHitBox[dot].radius);
            if (birdHitBox[dot].y < 0 || birdHitBox[dot].y > canvas.height - foreground.height + 5) {
                isAlive = false;
                location.reload();
            } else {
                birdHitBox[dot].y = newY;
            }
        }
        return this;
    },
    angle() {
        angle = 0 - birdRotated.velocityY*0.8;
        angle = angle < -90 ? -90 : angle > 90 ? 90 : angle;
    }
};

let pipes = [{
    x: canvas.width,
    y: -Math.floor(pipeCeiling.height / 30 * Math.random(1,28)) //28 ways to draw pipes
}];
let pipeActive = pipes[0];

const isTouchFloor = () => {
    const floorHeight = canvas.height - foreground.height + 5;
    for (let dot in birdHitBox) {
        if (birdHitBox[dot].y !== undefined) {
            if (birdHitBox[dot].y >= floorHeight) {
                return true;
            }
        }
    }
};

const isTouchCeiling = () => {
    for (let dot in birdHitBox) {
        if (birdHitBox[dot].y !== undefined) {
            if (birdHitBox[dot].y <= 0) {
                return true;
            }
        }
    }
};

const isTouchPipe = () => {
    const gap = 80;
    let pipeCeilingDots = {
        dotLeftDown: {
            x: pipeActive.x,
            y: pipeActive.y + pipeCeiling.height
        },
        dotRightDown: {
            x: pipeActive.x + pipeCeiling.width,
            y: pipeActive.y + pipeCeiling.height
        }
    };
    let pipeFloorDots = {
        dotLeftUp: {
            x: pipeActive.x,
            y: pipeActive.y + pipeCeiling.height + gap
        },
        dotRightUp: {
            x: pipeActive.x + pipeCeiling.width,
            y: pipeActive.y + pipeCeiling.height + gap
        }
    };
    for (let dot in birdHitBox) {
        if (birdHitBox[dot].x !== undefined) {
            if (birdHitBox[dot].x >= pipeCeilingDots.dotLeftDown.x
                && birdHitBox[dot].x <= pipeCeilingDots.dotRightDown.x
                && birdHitBox[dot].y <= pipeCeilingDots.dotRightDown.y) {
                return true;
            }
            if (birdHitBox[dot].x >= pipeFloorDots.dotLeftUp.x && birdHitBox[dot].x <= pipeFloorDots.dotRightUp.x
                && birdHitBox[dot].y >= pipeFloorDots.dotRightUp.y) {
                return true;
            }
        }
    }
    //тут должа быть проверка на вход угла через прямую на хитбоксе, но ее нет))0)
    /*const yForLineOne = solveY(birdHitBox.dotHead, birdHitBox.dotTail, dot.x);
    const yForLineTwo = solveY(birdHitBox.dotTail, birdHitBox.dotStomach, dot.x);
    const yForForLineThree = solveY(birdHitBox.dotStomach, birdHitBox.dotThroat, dot.x);
    const yForForLineFour = solveY(birdHitBox.dotThroat, birdHitBox.dotMouth, dot.x);
    const yForForLineFive = solveY(birdHitBox.dotMouth, birdHitBox.dotEye, dot.x);
    const yForForLineSix = solveY(birdHitBox.dotEye, birdHitBox.dotHead, dot.x);*/
    /*for (let dot in pipeFloorDots) {
        if (dot.y < )
    }*/
};

let score = 0;

let birdHitBox = new BirdRotatedHitBox();
let pipeOvercame = false;
const draw = () => {
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0);
    const pipesSpeed = 2;
    const distance = 190;
    const gap = 80;

    for (let i = 0; i < pipes.length; i++){
        pipes[i].x -= pipesSpeed;
        context.drawImage(pipeCeiling, pipes[i].x, pipes[i].y);
        context.drawImage(pipeFloor, pipes[i].x, pipes[i].y + pipeCeiling.height + gap);
        if (pipes[pipes.length - 1].x === canvas.width - distance) {
            pipes.push({
                x: canvas.width,
                y: -Math.floor(pipeCeiling.height / 30 * Math.random(1,28))
            });
        } else if (pipeActive !== pipes[i] && 0 < pipes[i].x - birdHitBox.dotCenter.x
            && pipes[i].x - birdHitBox.dotCenter.x < distance / 2) {
                pipeActive = pipes[i];
                pipeOvercame = false;
        }
    }
    if (pipes[0].x <  -pipeCeiling.width + 5) pipes.shift();

    //+5 in order to hide a black line
    context.drawImage(foreground, 0, canvas.height - foreground.height + 5);

    update.angle();
    rotate(-angle);
    if (isAlive) {
        context.drawImage(birdRotated, birdRotated.X, birdRotated.Y);
    }
    if (isTouchPipe() || isTouchFloor() || isTouchCeiling()) {
        isAlive = false;
        location.reload();
        setDefault();
    }
    if (!pipeOvercame && birdHitBox.dotMouth.x > pipeActive.x + pipeCeiling.width) {
        score++;
        pipeOvercame = true;
    }
    context.fillStyle = '#dcffed';
    context.font = '18px Verdana';
    context.fillText(`Счет: ${score}`, 20, 30);
    //birdHitBox.print();
    update
        .birdImg()
        .birdY()
        .hitBox()
        .newFrame();
};
foreground.onload = () => draw();

const setDefault = () => {
    birdRotated.X = 40;
    birdRotated.Y = 150;
    birdRotated.velocityY = 0; //was equal to 10
    angle = 0;
    angleCurrent = 0;
    isKeyPressed = false;
    isAlive = true;
    pipes = [{
        x: canvas.width,
        y: -Math.floor(pipeCeiling.height / 30 * Math.random(1,28)) //28 ways to draw pipes
    }];
    pipeActive = pipes[0];
    score = 0;
    birdHitBox = new BirdRotatedHitBox();
    pipeOvercame = false;
};
/*
let grad = 10;
const canvasButton = document.getElementById('canvasButton');
const contextButton = canvasButton.getContext('2d');

buttonStart = {
    image: new Image(),
    x: 69,
    y: 150
};
buttonStart.image.src = canvasButton.toDataURL();

let chain = {
    gradDraw() {
        contextButton.clearRect(0,0,canvasButton.width, canvasButton.height);
        let gradient = contextButton.createLinearGradient(75, 0, 75, grad);
        gradient.addColorStop(0, '#bde9ff');
        gradient.addColorStop(1, '#3bacff');
        contextButton.fillStyle = gradient;
        //contextButton.rect(0, 0, canvasButton.width, canvasButton.height);
        contextButton.fill();
        return this;
    },
    textDraw() {
        contextButton.strokeStyle = '#399be8';
        contextButton.beginPath();
        contextButton.moveTo(0, 0);
        contextButton.lineTo(0, canvasButton.height);
        contextButton.lineTo(canvasButton.width, canvasButton.height);
        contextButton.lineTo(canvasButton.width, 0);
        contextButton.lineTo(0, 0);
        contextButton.lineWidth = 4;
        contextButton.stroke();

        contextButton.fillStyle = '#152144';
        contextButton.font = '20px Verdana';
        contextButton.fillText('Start', 50, 27);

        return this;
    }
};

//button
const buttonDraw = () => {
    contextButton.clearRect(0,0,canvasButton.width, canvasButton.height);
    let gradient = contextButton.createLinearGradient(75, 0, 75, grad);
    gradient.addColorStop(0, '#bde9ff');
    gradient.addColorStop(1, '#3bacff');
    contextButton.rect(0, 0, canvasButton.width, canvasButton.height);
    contextButton.fillStyle = gradient;
    contextButton.fill();

    contextButton.strokeStyle = '#399be8';
    contextButton.beginPath();
    contextButton.moveTo(0, 0);
    contextButton.lineTo(0, canvasButton.height);
    contextButton.lineTo(canvasButton.width, canvasButton.height);
    contextButton.lineTo(canvasButton.width, 0);
    contextButton.lineTo(0, 0);
    contextButton.lineWidth = 4;
    contextButton.stroke();

    contextButton.fillStyle = '#152144';
    contextButton.font = '20px Verdana';
    contextButton.fillText('Start', 50, 27);
};
buttonDraw();


const buttonAnimation = () => {
    if (grad > 45) {
        return true;
    }
    context.clearRect(0,0, canvas.width, canvas.height);
    startGame();
    chain.gradDraw().textDraw();
    buttonStart.image.src = canvasButton.toDataURL();
    grad = grad + 9;
    requestAnimationFrame(buttonAnimation);
};

let darkBackground = new Image();
darkBackground.src = '../img/darkBg.png';
const startGame = () => {
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(darkBackground, 0 ,0);
    context.drawImage(buttonStart.image, buttonStart.x ,buttonStart.y);
};

canvas.onmousemove = (e) => {
    let rect = canvas.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    context.beginPath();
    context.rect(buttonStart.x, buttonStart.y, buttonStart.image.width, buttonStart.image.height);
    if (context.isPointInPath(x, y)) {
        buttonAnimation();
    } else {
        grad = 10;
        chain.gradDraw().textDraw();
    }
};



darkBackground.onload = () => startGame();
if (startGame()) {
    foreground.onload = () => draw();
}

*/

/*
//photo editor
const canvasMenu = document.getElementById("canvasMenu");
canvasMenu.width = 288;
canvasMenu.height = 512;
const contextMenu = canvasMenu.getContext("2d");
contextMenu.width = 288;
contextMenu.height = 512;


let backgroundMenu = new Image();
backgroundMenu.src = '../img/bg.png';
contextMenu.drawImage(backgroundMenu,0,0);
contextMenu.drawImage(foreground, 0 ,canvas.height - foreground.height + 5);
backgroundMenu = contextMenu.getImageData(0, 0, canvasMenu.width, canvasMenu.height);
*/
/*
//opacity
const opacity = 90;
for (let i = 0; i < canvasMenu.width * canvasMenu.height * 4; i += 4) {
    backgroundMenu.data[i + 3] = Math.floor(255*opacity/100);
}
contextMenu.putImageData(backgroundMenu,0,0);
*/

/*
//black and white
for (let i = 0; i < canvasMenu.width * canvasMenu.height * 4; i += 4) {

    // First bytes are red bytes.
    // Get red value.
    let myRed = backgroundMenu.data[i];

    // Second bytes are green bytes.
    // Get green value.
    let myGreen = backgroundMenu.data[i + 1];

    // Third bytes are blue bytes.
    // Get blue value.
    let myBlue = backgroundMenu.data[i + 2];

    // Fourth bytes are alpha bytes
    // We don't care about alpha here.
    // Add the three values and divide by three.
    // Make it an integer.
    const myGray = parseInt((myRed + myGreen + myBlue) / 3);

    // Assign average to red, green, and blue.
    backgroundMenu.data[i] = myGray;
    backgroundMenu.data[i + 1] = myGray;
    backgroundMenu.data[i + 2] = myGray;
    contextMenu.putImageData(backgroundMenu,0,0);
}
*/

/*
//make picture darker but canvas could not be cleared. Try to create canvas as a new html element
//and then to copy picture from it to real canvas
const darken = 70;
const darkenValue = Math.floor(255 / 100 * (100-darken));
contextMenu.globalCompositeOperation = "multiply";
contextMenu.fillStyle = `rgb(${darkenValue},${darkenValue},${darkenValue})`;
contextMenu.fillRect(0,0,backgroundMenu.width,backgroundMenu.height);
contextMenu.globalCompositeOperation = "destination-in";
contextMenu.drawImage(backgroundMenu,0,0);
contextMenu.globalCompositeOperation = "source-over";
*/


/*
//this is how to add textures (snowflakes here) to canvas
for (let i = 0; i <= 200; i++) {
    // Get random positions for flakes.
    let x = Math.floor(Math.random(10, canvasMenu.width - 13));
    let y = Math.floor(oldRandom() * canvas.height - foreground.height);

    // Make the flakes white
    contextMenu.fillStyle = "white";

    // Draw an individual flakes.
    contextMenu.beginPath();
    contextMenu.arc(x, y, 3, 0, Math.PI * 2, true);
    contextMenu.closePath();
    contextMenu.fill();
}
*/
