const jwt = require("jsonwebtoken");

module.exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
      if (err) {
        return res.sendStatus(401);
      }
      res.locals = response;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error,
    });
  }
};
