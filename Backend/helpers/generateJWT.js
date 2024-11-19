const jwt = require("jsonwebtoken");

const generateJWT = (userData) => {
  const payload = {
    uid: userData.user_id,
    roles: userData.roles,
  };

  let token = jwt.sign(payload, process.env.SECRETPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = {
  generateJWT,
};
