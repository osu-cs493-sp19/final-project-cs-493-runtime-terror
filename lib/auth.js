/*
 * Auth stuff.
 */

const jwt = require('jsonwebtoken');

const secretKey = 'SuperSecret!';

const { getUserById } = require('../models/user');

exports.generateAuthToken = function (userId, role) {
  const payload = {
    sub: userId,
    userRole: role
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
  return token;
};

exports.requireAuthentication = async function (req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    req.role = payload.userRole;
    // Check if user has an admin role.
    if (req.role == "admin") {
      // If getUserById resolves, then user is admin.
      const card = await getUserById(payload.sub)
      req.user = req.params.id; // Gives the user the keys.
      req.role = "admin";
      console.log("== Admin ", payload.sub);
      console.log("=== Accessing information for user ", req.params.id);
    }

    next();
  } catch (err) {
    console.error("  -- error:", err);
    res.status(401).send({
      error: "Invalid authentication token provided."
    });
  }
};
