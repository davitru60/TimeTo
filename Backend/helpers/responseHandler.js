const { StatusCodes } = require("http-status-codes");

class ResponseHandler {
    static success = (res,message,data=null,statusCode=StatusCodes.OK)=>{
        res.status(statusCode).json({
            success: true,
            msg: message,
            data: data
        })
    }


    static error = (res, message, error = null, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) =>{
        res.status(statusCode).json({
            success: false,
            msg: message,
            error: error
        })
    }

}

module.exports = ResponseHandler