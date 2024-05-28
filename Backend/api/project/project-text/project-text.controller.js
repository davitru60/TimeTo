const { StatusCodes } = require("http-status-codes");
const projectText = require("./project-text.database")

class ProjectTextController{
    static getProjectTexts = async (req, res) => {
        try {
          const projectId = req.params.id;
    
          const texts = await projectText.getProjectTexts(projectId);
    
          const response = {
            success: true,
            data: {
              texts: texts,
            },
          };
          res.status(StatusCodes.OK).json(response);
        } catch (error) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Error getting project texts", detail: error });
        }
      };
    
      static addProjectTexts = async (req, res) => {
        try {
          const projectId = req.params.id;
          const texts = await projectText.addProjectTexts(projectId, req.body);
    
          if (texts) {
            res.status(StatusCodes.OK).json({
              success: true,
              message: "Project texts added successfully.",
            });
          } else {
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ success: false, message: "Failed to add project texts" });
          }
        } catch (error) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Error adding project texts", detail: error });
        }
      };
    
      static updateProjectTexts = async (req, res) => {
        try {
          const updatedText = projectText.updateProjectTexts(req.body);
    
          if (updatedText) {
            const response = {
              success: true,
              msg: "Text has been successfully updated",
            };
    
            res.status(StatusCodes.OK).json(response);
          } else {
            const response = {
              success: false,
              msg: "Failed to update text",
            };
            res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        } catch (error) {
          console.error("Error updating", error);
          const response = {
            success: false,
            msg: "Failed to update text",
          };
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
        }
      };
    
      static deleteProjectTexts = async (req, res) => {
        try {
          const projTextId = req.params.id;
    
          const isDeleted = await projectText.deleteProjectTexts(projTextId);
    
          if (isDeleted) {
            const response = {
              success: true,
              msg: "Text has been successfully deleted",
            };
            res.status(StatusCodes.OK).json(response);
          } else {
            const response = {
              success: false,
              msg: "Failed to delete text",
            };
            res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        } catch (error) {
          console.error("Error deleting", error);
          const response = {
            success: false,
            msg: "Failed to delete text",
          };
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
        }
      };
}


module.exports=ProjectTextController