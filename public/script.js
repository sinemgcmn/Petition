//canvas and signature codes here
// console.log("sanity check");

const myCanvas = $("#myCanvas");

const context = myCanvas[0].getContext("2d");

let isMoving = false;
let x = 0;
let y = 0;

myCanvas.on("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isMoving = true;
});

myCanvas.on("mousemove", (e) => {
    if (isMoving === true) {
        drawMyCanvas(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

$(window).on("mouseup", (e) => {
    if (isMoving === true) {
        drawMyCanvas(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isMoving = false;
    }
});

function drawMyCanvas(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

const dataURL = myCanvas[0].toDataURL();
console.log(dataURL);

console.log("blaaaaa");
