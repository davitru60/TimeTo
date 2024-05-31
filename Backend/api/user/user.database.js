const models = require("../../models");

class User {
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

  static addUserInterest = async (userId, body) => {
    try {
      const newUserInterest = await models.UserInterest.create({
        user_id: userId,
        category_id: body.category_id,
      });

      return newUserInterest;
    } catch (error) {
      console.error("Error adding user interest:", error);
      throw new Error("Failed to add user interest");
    }
  };

  static deleteUserInterest = async (userIntId) => {
    try {
      let result = false;

      const interest = await models.UserInterest.findByPk(userIntId);

      if (interest) {
        await interest.destroy();
        result = true;
      } else {
        result = false;
      }

      return result;
    } catch (error) {}
  };
}

module.exports = User;
