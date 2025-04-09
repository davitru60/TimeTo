const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "No token provided in the request header." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRETPRIVATEKEY);
    req.tokenId = decodedToken.uid;
    req.roles = decodedToken.roles;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Token expired. Please log in again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid token. Please log in again." });
    } else {
      console.error("Error verifying JWT:", error.message);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Internal server error." });
    }
  }
};

module.exports = {
  validateJWT,
};
