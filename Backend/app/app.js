require('dotenv').config()

const Server = require('./server');

//Launching the server
const server = new Server();
server.listen();

