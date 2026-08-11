const jwt = require('jsonwebtoken');


// If a valid token is present, req.user is populated. If not, req.user is just null.
module.exports = function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    req.user = err ? null : decoded;
    next();
  });
};