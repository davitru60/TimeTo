require('dotenv').config()
const { Sequelize, Op } = require('sequelize');

class Connection {
    constructor() {
        this.db = new Sequelize(process.env.DB_DEV, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT, 
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        })

    }

    connect = () =>{
        this.db.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });
    }

    disconnect = () =>{
        process.on('SIGINT', () => conn.close())
    }
}

module.exports = Connection