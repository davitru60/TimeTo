const { generateJWT } = require("../../helpers/generateJWT");
const { StatusCodes } = require("http-status-codes");
const auth = require("./auth.database");
const { googleVerify } = require("../../helpers/googleVerify");

class AuthController {
  static login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.hostname)

    try {
      const user = await auth.getLoggedUser(email, password);
      if (user) {
        const roles = await this.getRoles(user.dataValues.user_id);

        const userData = {
          user_id: user.dataValues.user_id,
          roles: roles,
        };

        const token = generateJWT(userData);

        const response = {
          success: true,
          msg: "Logged succesfully",
          data: {
            token: token,
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

        const response = {
          success: true,
          msg: "Google Auth Success",
          data: {
            token: token,
          },
        };

        return res.status(StatusCodes.OK).json(response);
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
    } catch (error) {}
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
