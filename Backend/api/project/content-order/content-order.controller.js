const { StatusCodes } = require("http-status-codes");
const contentOrder = require("./content-order.database");
const responseHandler = require("../../../helpers/responseHandler");
const messages = require("../../../config/messages");

class ContentOrderController {
  static updateImageOrder = async (req, res) => {
    try {
      const projectId = req.params.id;
      const updatedOrder = await contentOrder.updateImageOrder(projectId, req.body);

      if (updatedOrder) {
        responseHandler.success(res, messages.UPDATE_SUCCESS, { updatedOrder });
      } else {
        responseHandler.error(res, messages.UPDATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error("Error updating image order:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  static updateEditorOrder = async (req, res) => {
    try {
      const projectId = req.params.id;
      const updatedOrder = await contentOrder.updateEditorOrder(projectId, req.body);

      if (updatedOrder) {
        responseHandler.success(res, messages.UPDATE_SUCCESS, { updatedOrder });
      } else {
        responseHandler.error(res, messages.UPDATE_FAILED, null, StatusCodes.BAD_REQUEST);
      }
    } catch (error) {
      console.error("Error updating editor order:", error);
      responseHandler.error(res, messages.INTERNAL_SERVER_ERROR, error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  };
}

module.exports = ContentOrderController;
