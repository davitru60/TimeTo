const { StatusCodes } = require("http-status-codes");

class ResponseHandler {
    static success = (res,message=null,data=null,statusCode=StatusCodes.OK)=>{
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
            statusCode:statusCode,
            error: error
        })
    }

}

module.exports = ResponseHandler