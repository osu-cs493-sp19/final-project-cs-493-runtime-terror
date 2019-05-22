const bcrypt = require('bcryptjs');
const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
/*
 * Schema describing fields of a user object.
 */
const SubmissionSchema = {
    id: { required: false },
    assignment_id: { required: true },
    timestamp: { required: true }
    //file: { required: true },
  };
  exports.SubmissionSchema = SubmissionSchema;
  
function saveNewSubmissionInfo (submission) {
    return new Promise((resolve, reject) => {
        mysqlPool.query(
      'INSERT INTO submissions SET ?',
      submission ,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
}
exports.saveNewSubmissionInfo = saveNewSubmissionInfo;