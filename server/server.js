const http = require('http');
const app = require('./App');
const dotenv = require('dotenv').config();

const server = http.createServer(app);
const PORT = process.env.PORT;


server.listen(PORT, (req,res)=>{
    console.log(`server is running on port ${PORT}`);
});

