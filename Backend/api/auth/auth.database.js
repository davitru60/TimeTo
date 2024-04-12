const models = require('../models/index.js')
const { Sequelize, QueryTypes } = require('sequelize')
const bcrypt = require('bcrypt')

class Auth {
    static getLoggedUser = async (email,pass) => {
        let result = null

        try {
            result = await models.User.findOne({
                where: { email: email},
                attributes: ['user_id', 'name', 'password']
            })
            

            if (result && (await bcrypt.compare(pass, result.password))) {
                console.log("Acceso permitido")
            } else {
                console.log("Usuario no encontrado o contraseña incorrecta")
                result = null
            }

        } catch (error) {
            console.error("Error finding the user:", error)
            throw error
        }

        return result
    }
}

module.exports = Auth