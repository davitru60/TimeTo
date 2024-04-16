const models = require("../../models");
const { Sequelize, QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

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

  static getRoles = async (userId) => {
    const result = await models.sequelize.query(
      `
        SELECT DISTINCT r.name 
        FROM roles r
        JOIN user_role ur ON r.role_id = ur.role_id
        WHERE ur.user_id = ${userId}
    `,
      { type: QueryTypes.SELECT }
    );
    return result;
  };
}

module.exports = Auth;
