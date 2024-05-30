const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const validateJWT = (req,res,next) =>{
    const token = req.header('x-token');
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 'msg': 'There is no token in the request.' });
    }

    try{
        const {uid, roles} = jwt.verify(token, process.env.SECRETPRIVATEKEY)
        req.tokenId = uid
        req.roles = roles
        next()

    }catch(error){
        return res.status(StatusCodes.UNAUTHORIZED).json({ 'msg': 'Token not valid.' });
    }
}

module.exports = {
    validateJWT
}