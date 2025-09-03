const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('🔐 Auth Header:', authHeader); // Debug log

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('⛔ No token found');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ JWT Verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    console.log('✅ Token verified, user:', user);
    next();
  });
}

module.exports = authenticateToken;
