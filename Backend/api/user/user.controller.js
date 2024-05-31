const { StatusCodes } = require("http-status-codes");
const user = require("./user.database");

class UserController {
  static getUserInterests = async (req, res) => {
    try {
      const userId = req.tokenId;
      const userInterests = await user.getUserInterests(userId);

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

  static addUserInterest = async (req,res)=>{
    try {
      const userId = req.tokenId;
      const userInterestAdd = await user.addUserInterest(userId,req.body)

      if(userInterestAdd){
        const response = {
          success: true,
          msg: "User interest has been successfully added",
          data: userInterestAdd
        }

        res.status(StatusCodes.OK).json(response);
      }else{
        const response = {
          success: false,
          msg: "Failed to update project user interest",
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

    }catch(error){
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error adding user interest", detail: error });
    }
  }

  static deleteUserInterest = async(req,res) =>{
    try {
      const userIntId = req.params.id;
      const userInterestDelete = await user.deleteUserInterest(userIntId)

      if(userInterestDelete){
        const response = {
          success: true,
          msg: "User interest has been successfully deleted",
          data: userInterestDelete
        }

        res.status(StatusCodes.OK).json(response);
      }else{
        const response = {
          success: false,
          msg: "Failed to delete user interest",
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

    }catch(error){
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error deleting user interest", detail: error });
    }
  }

}

module.exports = UserController;
