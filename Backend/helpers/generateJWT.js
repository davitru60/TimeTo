const jwt = require('jsonwebtoken')

const generateJWT = (uid='', roles) =>{
    let token = jwt.sign({ uid, roles }, process.env.SECRETPRIVATEKEY, {
        expiresIn: '4h'
    });
    return token;
}

module.exports = {
    generateJWT
}