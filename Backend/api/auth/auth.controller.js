const { generateJWT } = require("../../helpers/generateJWT");
const { StatusCodes } = require("http-status-codes");
const { googleVerify } = require("../../helpers/googleVerify");
const auth = require("./auth.database");
const responseHandler = require("../../helpers/responseHandler");
const messages = require("../../config/messages");

class AuthController {
  static login = async (req, res) => {
    const { email, password } = req.body;

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
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR , StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static googleSignIn = async (req, res) => {
    const idToken = req.body.id_token;

    try {
      const googleUser = await googleVerify(idToken);
      const user = await auth.emailExists(googleUser.email);

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

        responseHandler.success(res, messages.GOOGLE_AUTH_SUCCESS, { token: generateJWT({ user_id: userId, roles: [2] }) });
      } else {
        const userId = user.dataValues.user_id;
        const roles = await this.getRoles(userId);
        const token = generateJWT({ user_id: userId, roles });

        responseHandler.success(res, messages.GOOGLE_AUTH_SUCCESS, { token });
      }
    } catch (error) {
      console.error("Error interno:", error);
      responseHandler.error(res, messages.GOOGLE_AUTH_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
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
      const roleUser = await this.createRoleUser(user, 2);
      responseHandler.success(res, messages.CREATE_SUCCESS, roleUser);
    } catch (error) {
      responseHandler.error(res, messages.CREATE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static createRoleUser = async (userId, roleId) => {
    try {
      return await auth.createRoleUser(userId, roleId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AuthController;
