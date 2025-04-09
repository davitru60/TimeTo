const { StatusCodes } = require("http-status-codes");
const user = require("./user.database");
const responseHandler = require("../../helpers/responseHandler");
const messages = require("../../config/messages");

class UserController {
  static getUserInterests = async (req, res) => {
    try {
      const userId = req.tokenId;
      const userInterests = await user.getUserInterests(userId);

      responseHandler.success(res, messages.SUCCESS, { userInterests });

    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static addUserInterest = async (req, res) => {
    try {
      const userId = req.tokenId;
      const userInterestAdd = await user.addUserInterest(userId, req.body);

      if (userInterestAdd) {
        responseHandler.success(res, messages.CREATE_SUCCESS, { userInterestAdd });
      } else {
        responseHandler.error(res, messages.CREATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }

    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static deleteUserInterest = async (req, res) => {
    try {
      const userIntId = req.params.id;
      const userInterestDelete = await user.deleteUserInterest(userIntId);

      if (userInterestDelete) {
        responseHandler.success(res, messages.DELETE_SUCCESS, { userInterestDelete });
      } else {
        responseHandler.error(res, messages.DELETE_FAILED, null, StatusCodes.BAD_REQUEST);
      }

    } catch (error) {
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = UserController;
