const models = require('../models')

const emailExists = async(email) =>{
    
    const user = await models.User.findOne({
        where:{
            email: email
        }
    })
    if(user){
        throw new Error('Email already exists')
    }
}

module.exports = emailExists