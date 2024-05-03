const models = require("../../models");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const queries = require('./auth.queries');


class Auth {
  static getLoggedUser = async (email, pass) => {
    let result = null;

    try {
      result = await models.User.findOne({
        where: { email: email },
        attributes: ["user_id", "name", "password"],
      });

      if (result && (await bcrypt.compare(pass, result.password))) {
        console.log("Access allowed");
      } else {
        console.log("User not found or incorrect password");
        result = null;
      }
    } catch (error) {
      console.error("Error finding the user:", error);
      throw error;
    }

    return result;
  };

  static emailExists = async(email) =>{
    let result = null;

    try{
      result = await models.User.findOne({
        where: { email: email },
        attributes: { exclude: ["id"] },
      });

    }catch(error){
      console.error("Error finding the user:", error);
      throw error;
    }

    
    return result;
  }

  static getRoles = async (userId) => {
    try {
      const result = await models.sequelize.query(queries.getUsers, {
        replacements: { userId },
        type: QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static register = async(body) => {
    try {
      let hashedPass = ''; 
      if (body.password) {
        hashedPass = await bcrypt.hash(body.password, 10); 
      }
  
      const user = await models.sequelize.query(queries.registerUser, {
        replacements: {
          name: body.name,
          first_surname: body.first_surname,
          second_surname: body.second_surname,
          email: body.email,
          password: hashedPass, 
        },
        type: QueryTypes.INSERT,
      });
      
  
      return user[0]; 
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; // Lanza el error para que se maneje en otro lugar
    }
  };

  static async createRoleUser(userId, roleId) {
    try {
      await models.sequelize.query(queries.createRoleUser, {
        replacements: [roleId, userId],
        type: QueryTypes.INSERT,
      });
      return 1;
    } catch (error) {
      console.error("Error creating User-Role relationship", error);
      throw error;
    }
  }
}

module.exports = Auth;
