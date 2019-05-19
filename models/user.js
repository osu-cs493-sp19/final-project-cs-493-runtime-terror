const bcrypt = require('bcryptjs');
const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing fields of a user object.
 */
const UserSchema = {
    id: { required: false },
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true }
  };
  exports.UserSchema = UserSchema;

  function insertNewUser(user) {
    return new Promise((resolve, reject) => {
      user = extractValidFields(user, UserSchema);
      bcrypt.hash(user.password, 8, function(err, hash) {
        if (err) {
           throw err;
        }
        user.password = hash;
        user.id = null;
        mysqlPool.query('INSERT INTO users SET ?', user,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
    });
  }
  exports.insertNewUser = insertNewUser;