const { generateJWT } = require("../../helpers/generateJWT");
const { StatusCodes } = require("http-status-codes");
const auth = require("./auth.database");

class AuthController {
  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await auth.getLoggedUser(email, password);
      if (user) {
        const roles = await this.getRoles(user.dataValues.user_id);

        const token = generateJWT(user.dataValues.user_id, roles);

        const response = {
          success: true,
          msg: "Logged succesfully",
          data: {
            user_id: user.user_id,
            name: user.name,
            token: token,
            roles: roles,
          },
        };

        res.status(StatusCodes.OK).json(response);
      } else {
        const response = {
          success: false,
          msg: "Login failed",
          data: {},
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
    } catch (error) {
      console.log(error);
      const response = {
        success: false,
        msg: "Server fail",
        data: {},
      };

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  };

  static getRoles = async (userId) => {
    try {
      const roles = await auth.getRoles(userId);
      return roles;
    } catch (error) {
      throw error;
    }
  };

  static register = async (req, res) => {
    try {
      const user = await auth.register(req.body);
      const roleUserMsg = await this.createRoleUser(user, 2);

      const response = {
        success: true,
        data: {
          msg: "User created",
          roleUserMsg,
        },
      };

      res.status(StatusCodes.CREATED).json({ response });
    } catch (error) {
      
    }
  };

  static createRoleUser = async (userId, roleId) => {
    try {
      await auth.createRoleUser(userId, roleId);
      return "Role assigned successfully";
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthController;
