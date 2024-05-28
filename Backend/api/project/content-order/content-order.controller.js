const { StatusCodes } = require("http-status-codes");
const contentOrder = require ("./content-order.database")

class ContentOrderController{
    static updateImageOrder = async (req, res) => {
        try {
          const projectId = req.params.id;
    
          const updatedOrder = contentOrder.updateImageOrder(projectId, req.body);
    
          if (updatedOrder) {
            const response = {
              success: true,
              msg: "Images order has been successfully updated",
            };
    
            res.status(StatusCodes.OK).json(response);
          } else {
            const response = {
              success: false,
              msg: "Failed to update image order",
            };
            res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        } catch (error) {
          console.error("Error updating", error);
          const response = {
            success: false,
            msg: "Failed to update image order",
          };
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
        }
      };
    
      static updateEditorOrder = async (req, res) => {
        try {
          const projectId = req.params.id;
    
          const updatedOrder = contentOrder.updateEditorOrder(projectId, req.body);
    
          if (updatedOrder) {
            const response = {
              success: true,
              msg: "Editor order has been successfully updated",
            };
    
            res.status(StatusCodes.OK).json(response);
          } else {
            const response = {
              success: false,
              msg: "Failed to update editor order",
            };
            res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        } catch (error) {
          console.error("Error updating", error);
          const response = {
            success: false,
            msg: "Failed to update editor order",
          };
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
        }
      };
}

module.exports = ContentOrderController