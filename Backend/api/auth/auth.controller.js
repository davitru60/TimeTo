const { generateJWT } = require("../../helpers/generateJWT");
const { StatusCodes } = require("http-status-codes");
const { googleVerify } = require("../../helpers/googleVerify");
const auth = require("./auth.database");
const responseHandler = require("../../helpers/responseHandler");
const messages = require("../../config/messages");

class AuthController {
  static login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.hostname);

    try {
      const user = await auth.getLoggedUser(email, password);
      if (user) {
        const roles = await this.getRoles(user.dataValues.user_id);

        const userData = {
          user_id: user.dataValues.user_id,
          roles: roles,
        };

        const token = generateJWT(userData);

        responseHandler.success(res, messages.AUTH_SUCCESS, { token });

      } else {
        responseHandler.error(res, messages.AUTH_FAILED, StatusCodes.UNAUTHORIZED);
      }
    } catch (error) {
      responseHandler.error(res, "Server fail", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static googleSignIn = async (req, res) => {
    const idToken = req.body.id_token;

    try {
      const googleUser = await googleVerify(idToken);
      const user = await auth.emailExists(googleUser.email);
      console.log(user);

      if (!user) {
        const newUser = {
          name: googleUser.given_name,
          first_surname: googleUser.family_name,
          second_surname: "",
          email: googleUser.email,
          password: "",
        };
        const userId = await auth.register(newUser);
        await auth.createRoleUser(userId, 2);
      } else {
        
        const userId = user.dataValues.user_id;
        const roles = await this.getRoles(userId);
        const token = generateJWT(userId, roles);

        responseHandler.success(res, "Google Auth Success", { token });
      }
    } catch (error) {
      console.error("Error interno:", error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        msg: "Error interno al verificar el token",
      });
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
      responseHandler.error(res, "Error creating user", StatusCodes.INTERNAL_SERVER_ERROR);
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
