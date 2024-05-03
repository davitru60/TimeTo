require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const googleVerify = async( idToken = '' ) => {
    const ticket = await client.verifyIdToken({
        idToken:idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    
    const data = ticket.getPayload();

    return data
    
}

module.exports = {
    googleVerify
}