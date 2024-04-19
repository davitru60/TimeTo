const express = require('express');
const cors = require('cors');

class Server {
    constructor(){
        this.app = express()
        this.authPath = '/api/auth'
        this.projectsPath = '/api/projects'


        this.expressServer = require('http').createServer(this.app)

        //Middlewares
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
    }

    routes(){
        this.app.use(this.authPath, require('../api/auth/auth.routes')),
        this.app.use(this.projectsPath, require('../api/project/project.routes'))
    }

    listen() {
        this.expressServer.listen(process.env.PORT, () => {
            console.log(`Express server listening on: ${process.env.PORT}`);
        });

     
    }
}

module.exports = Server;