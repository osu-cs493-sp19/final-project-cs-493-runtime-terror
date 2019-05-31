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
          resolve(result.insertId);
        }
      }
    );
  });
}
exports.saveNewSubmissionInfo = saveNewSubmissionInfo;

function getSubmissionsCount(id, studentid) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT COUNT(*) AS count FROM submissions WHERE assignment_id = ? AND (user_id = COALESCE(?,user_id))',
      [ id, studentid],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
            console.log(results[0].count);
          resolve(results[0].count);
        }
      }
    );
  });
}

exports.getSubmissionInfoById = async function (id, studentid, page) {
    return new Promise(async(resolve, reject) => {
        const count = await getSubmissionsCount(id, studentid);
        const pageSize = 10;
       const lastPage = Math.ceil(count / pageSize);
       page = page > lastPage ? lastPage : page;
       page = page < 1 ? 1 : page;
       const offset = (page - 1) * pageSize;
        mysqlPool.query(
            'SELECT * FROM submissions WHERE assignment_id = ? AND (user_id = COALESCE(?,user_id)) ORDER BY id LIMIT ?,?',
            [ id, studentid,  offset, pageSize ],
            (err, result) => {
                if(err) {
                    reject(err);
                }
                else{
                    resolve({
                        submissions: result,
                        page: page,
                        totalPages: lastPage,
                        pageSize: pageSize,
                        count: count
                    });
                }
            }
            );
    });
};