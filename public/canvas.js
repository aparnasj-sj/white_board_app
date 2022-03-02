let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;// The Window innerHeight property is used for returning the height of a 
context = canvas.getContext("2d");   
//window’s content area. It is a read-only property and returns a number which represents the height of the browser window’s content area in pixels
var imageData = context.getImageData(0, 0, canvas.width, canvas.height);  
// for transparent pixels need to set them back to white explicit else black backgroun will come  
//getImageData ---> returns an ImageData object representing the underlying pixel data for a specified portion of the canvas.
for(var i = 0; i < imageData.data.length; i += 4) {   
    //When the pixel is transparent, it is set to white  
    if(imageData.data[i + 3] == 0) {   
        imageData.data[i] = 255;   
        imageData.data[i + 1] = 255;   
        imageData.data[i + 2] = 255;   
        imageData.data[i + 3] = 255;    
    }   
}   
context.putImageData(imageData, 0, 0); 
let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
let mouseDown = false; // without this the mouse move event listener will /
// keep drwing wenevr u move wheter down or not 
let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;// from the input tag
let eraserWidth = eraserWidthElem.value;
// api 
let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;

tool.lineWidth = penWidth;
let undoRedoTracker=[];// data
let track=0;// action 

// path of graphics --> thro mouse listeners
//  mouse down--> start new path 
//  mouse move --> fill the path
// event listener over ? full canvas
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
   // beginPath({ x: e.clientX, y: e.clientY });
   // insated of calling fun from here 
   // we pass the fun name and parameters to server and server will
   // send them thro socket to evry connceted client
   // when client get it he can just cann the fun using name and parameter
   let data={
    x: e.clientX, y: e.clientY
   };
   // emit send data to server 
   // parameters : name , 
   socket.emit("beginPath",data);
})
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;// not dragging now 
    // when mouse up one graphic over -> track it 
    let url=canvas.toDataURL();
    undoRedoTracker.push(url);// curr state 
    track=undoRedoTracker.length-1;


})
undo.addEventListener('click',e=>{
// undo means [ g1, g2 ,g3 ] if curr set of graphics 
// for undo (track now at g3) track needd to move one step back 
if(track>0) {track--;
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
}
else if(track==0){
    track--;
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("here clearing");
}


})
redo.addEventListener('click',e=>{
    // track ++
    if (track < undoRedoTracker.length-1) {track++;
        let data = {
            trackValue: track,
            undoRedoTracker
        }
        socket.emit("redoUndo", data);
    }

})
 function undoRedoCanvas(trackObj){
     track=trackObj.trackValue;
     undoRedoTracker=trackObj.undoRedoTracker;
     let url=undoRedoTracker[track];
    let img=new Image();// new img refernce elm
    img.src=url;
    img.onload = (e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);// using out tool draw this new img 
    }



 }
function beginPath(strokeObj) {
    tool.beginPath();//beginPath()---> start drawing a path at the point where the pen currently is on the canvas
    tool.moveTo(strokeObj.x, strokeObj.y); //The clientX property returns the horizontal coordinate (according to the client area) of the mouse pointer when a mouse event was triggered.

}
function drawStroke(strokeObj) {
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    console.log("drawing");
    tool.stroke();

}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0]; // actual color is stored in clsname 
        console.log(color);
        penColor = color;
        tool.strokeStyle = penColor;
        console.log(tool.strokeStyle);
    })

})
pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener('click', (e) => {
    if (eraserFlag) {// flag from tool.js
        tool.strokeStyle = eraserColor;//white
        tool.lineWidth = eraserWidth;
    } else {

        tool.strokeStyle = penColor;//go back to pens last value 
        tool.lineWidth = penWidth;
    }
})
download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    //It converts the drawing (canvas) into a64 bit encoded PNG URL.

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.png";//naming 
    a.click();
})
// check if data from server came
socket.on("beginPath",(data)=>{
// data reprsent data from server
// this is front end again
   beginPath(data);

})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})