const bcrypt = require('bcryptjs');
const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
/*
 * Schema describing fields of a user object.
 */
const CourseSchema = {
    id: { required: false },
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructor_id: { required: true }
  };
  exports.CourseSchema = CourseSchema;

/*
 * Schema describing fields of a user object
 * specifically for patches
 */
const CourseSchemaForPatch = {
    id: { required: false },
    subject: { required: false },
    number: { required: false },
    title: { required: false },
    term: { required: false },
    instructor_id: { required: false }
  };
  exports.CourseSchemaForPatch = CourseSchemaForPatch;

/*
 * Queries our db to get the number of courses.
 */
 function getCoursesCount(specifiedSubject, specifiedCourseNumber, specifiedTerm) {
   return new Promise((resolve, reject) => {
     mysqlPool.query(
       'SELECT COUNT(*) AS count FROM courses WHERE (subject = COALESCE(?,subject)) AND (number = COALESCE(?,number)) AND (term = COALESCE(?,term))',
       [ specifiedSubject, specifiedCourseNumber, specifiedTerm],
       (err, results) => {
         if(err) {
           reject(err);
         } else {
           resolve(results[0].count);
         }
       }
     );
   });
 }

/*
 * Function that returns an array of courses based on query params. Implements pagination.
 */
 function getCoursesPage(page, specifiedSubject, specifiedCourseNumber, specifiedTerm) {
   return new Promise(async (resolve, reject) => {
       const count = await getCoursesCount(specifiedSubject, specifiedCourseNumber, specifiedTerm);
       const pageSize = 10;
       const lastPage = Math.ceil(count / pageSize);
       page = page > lastPage ? lastPage : page;
       page = page < 1 ? 1 : page;
       const offset = (page - 1) * pageSize;

       mysqlPool.query(
         'SELECT * FROM courses WHERE (subject = COALESCE(?,subject)) AND (number = COALESCE(?,number)) AND (term = COALESCE(?,term)) ORDER BY id LIMIT ?,?',
         [ specifiedSubject, specifiedCourseNumber, specifiedTerm, offset, pageSize ],
         (err, results) => {
           if (err) {
             reject(err);
           } else {
             resolve({
               courses: results,
               page: page,
               totalPages: lastPage,
               pageSize: pageSize,
               count: count
             });
           }
         }
       );
   });
 }
 exports.getCoursesPage = getCoursesPage;

/*
* Function that inserts a new course into the db.
*/
function insertNewCourse(course) {
  return new Promise((resolve, reject) => {
    course = extractValidFields(course, CourseSchema);
    course.id = null;
    mysqlPool.query(
      'INSERT INTO courses SET ?',
      course,
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
exports.insertNewCourse = insertNewCourse;

/*
 * Executes a SQL query that returns a course by id
 */
function getCourseById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT * FROM courses WHERE id = ?',
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
exports.getCourseById = getCourseById;

/*
 * Updates course db entry
 */
function patchCourseById(id, course) {
  return new Promise((resolve, reject) => {
    course = extractValidFields(course, CourseSchema);
    mysqlPool.query(
      'UPDATE courses SET subject = COALESCE(?,subject), number = COALESCE(?,number), title = COALESCE(?,title), term = COALESCE(?,term), instructor_id = COALESCE(?,instructor_id) WHERE id = ?',
      [ course.subject, course.number, course.title, course.term, course.instructor_id, id ],
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
exports.patchCourseById = patchCourseById;

/*
 * Executes a SQL query that deltes a course by id
 */
function deleteCourseById(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'DELETE FROM courses WHERE id = ?',
      [ id ],
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
exports.deleteCourseById = deleteCourseById;

function getStudentsByCourseId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT users.id FROM users INNER JOIN course_enrollment ON users.id = course_enrollment.student_id WHERE course_id = ?',
      [ id ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            students: results
          });
        }
      }
    );
  });
};
exports.getStudentsByCourseId = getStudentsByCourseId;

function unenrollStudentsFromCourseById(studentId) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'DELETE FROM course_enrollment WHERE student_id = ?',
      [ studentId ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
};
exports.unenrollStudentsFromCourseById = unenrollStudentsFromCourseById;

function enrollStudentsToCourseById(studentId, courseId) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'INSERT INTO course_enrollment SET student_id = ?, course_id = ?',
      [ studentId, courseId ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      }
    );
  });
};
exports.enrollStudentsToCourseById = enrollStudentsToCourseById;

function getStudentRosterByCourseId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT users.name, users.id, users.email FROM users INNER JOIN course_enrollment ON course_enrollment.student_id = users.id INNER JOIN courses ON courses.id = course_enrollment.course_id WHERE courses.id = ?',
      [ id ],
      (err, results) => {
        if(err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};
exports.getStudentRosterByCourseId = getStudentRosterByCourseId;

function getAssignmentsByCourseId(id) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(
      'SELECT assignments.id FROM assignments INNER JOIN courses on courses.id = assignments.course_id WHERE course_id = ?',
      [ id ],
      (err, results) => {
        if(err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};
exports.getAssignmentsByCourseId = getAssignmentsByCourseId;
