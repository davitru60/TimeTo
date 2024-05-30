const { StatusCodes } = require("http-status-codes");
const userPreference = require("./user-preference.database");

class UserPreferenceController {
  static getUserInterests = async (req, res) => {
    try {
      const userId = req.tokenId;
      const userInterests = await userPreference.getUserInterests(userId);

      const response = {
        success: true,
        data: {
          userInterests: userInterests,
        },
      };

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting user preferences", detail: error });
    }
  };
}

module.exports = UserPreferenceController;
