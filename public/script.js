//canvas and signature codes here
// console.log("sanity check");

const myCanvas = $("#myCanvas");
const hidden = $("#hidden");

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
        const dataURL = myCanvas[0].toDataURL();
        hidden.val(dataURL);
        console.log(dataURL);
    }
});

function drawMyCanvas(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "magenta";
    context.font = "bold";
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    0;
    context.closePath();
}

console.log("sannity check");
