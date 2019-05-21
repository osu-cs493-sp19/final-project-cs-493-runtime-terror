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
