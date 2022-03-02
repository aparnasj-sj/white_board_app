const express = require("express");
// return a fun which can be called to ini our app
const socket= require('socket.io');
const app= express(); // intitilaised and server ready
app.use(express.static("public"));

let port=5000;
let server = app.listen(port,()=>{
    console.log("listening to port "+port);
});

let io=socket(server); // ini socket with our server
// on is event emitter
// socket instance is passed to io 
io.on("connection",(socket)=>{
    console.log("socket connection");
    //using sokcet instance can check if some data at server
    // check if data of name 'beginPath' at server
    socket.on("beginPath",(data)=>{

        // data from front end 
       // transfer data to al connected computers
       io.sockets.emit("beginPath",data);


    });
    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    });
    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    });

});



