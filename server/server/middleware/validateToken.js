const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.redirect('./').end();
  } else {

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      try {
        if (err) {
          console.log(err)
          res.status(403).json('Authentication Error').end();
        } else {
          req.user = user
          next()
        }
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
    }
  };
  
  module.exports = verifyToken;