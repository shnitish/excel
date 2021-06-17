const express = require("express");
const {Server} = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let userList = [];

// default template in public directory
app.use(express.static("public"));

io.on("connection", function(socket){
    console.log(socket.id + " connected !!!");

    socket.on("userConnected", function(username)
    {
        let userObject = {id: socket.id, username: username};
        userList.push(userObject);
        console.log(userList);
    })

    socket.on("cellClicked", function(cellCoordinates)
    {
        let username;
        for(let i = 0; i < userList.length; i++)
        {
            if(userList[i].id == socket.id)
            {
                username = userList[i].username;
            }
        }
        socket.broadcast.emit("setRealTimeCell", {username, ...cellCoordinates});
    })

    socket.on("cellValue", function(cellValue)
    {
        socket.broadcast.emit("setCellValue", cellValue);
    })
})

server.listen(5500, function(){
    console.log("Server started at port 5500 !!");
})