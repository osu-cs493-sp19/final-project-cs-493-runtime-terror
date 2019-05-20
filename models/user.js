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

  function getUserById(id) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT id, name, email, password, role  FROM users WHERE id = ?',
        [ id ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }
  exports.getUserById = getUserById;

  function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [ email ],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }
  exports.getUserByEmail = getUserByEmail;

  exports.validateUser = async function (email, password) {
    const user = await getUserByEmail(email, true);
    const authenticated = user && await bcrypt.compare(password, user.password);
    return authenticated;
  };

  function getCoursesById(id, role) {
    return new Promise((resolve, reject) => {
        if(role == "student"){
            mysqlPool.query('SELECT * FROM course_enrollment WHERE student_id = ?', [ id ],
            (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map(result => result.course_id));
            }
            });
        }
        else{
            mysqlPool.query('SELECT * FROM courses WHERE instructor_id = ?', [ id ],
            (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map(result => result.id));
            }
            });  
        }
        });
  }
  exports.getCoursesById = getCoursesById;