const models = require("../../../models");

class UserInterest {
  static getUserInterests = async (userId) => {
    try {
      const userPreferences = await models.UserInterest.findAll({
        where: {
          user_id: userId,
        },
      });

      return userPreferences;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

module.exports = UserInterest;
