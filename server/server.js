const http = require('http');
const app = require('./App');
const dotenv = require('dotenv').config();
const {initializesocket} = require("./src/socket/socket")

const server = http.createServer(app);
const PORT = process.env.PORT;

initializesocket(server);


server.listen(PORT, (req,res)=>{
    console.log(`server is running on port ${PORT}`);
});

