const router = require('express').Router();
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const { validateAgainstSchema, validateFieldsForPatch } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { CourseSchema,
        CourseSchemaForPatch,
        getCoursesPage,
        insertNewCourse,
        getCourseById,
        patchCourseById,
        getStudentsByCourseId,
        enrollStudentsToCourseById,
        unenrollStudentsFromCourseById,
        getStudentRosterByCourseId,
        getAssignmentsByCourseId,
        deleteCourseById } = require('../models/course');

/*
 * Gets a list of all courses - must be paginated
 */
router.get('/', async (req, res) => {
    try {
      const coursesPage = await getCoursesPage(parseInt(req.query.page || 1), req.query.subject || null, req.query.number || null, req.query.term || null);
      if (coursesPage.page < coursesPage.totalPages) {
        coursesPage.links.nextPage = `/courses?page=${coursesPage.page + 1}`;
        coursesPage.links.lastPage = `/courses?page=${coursesPage.totalPages}`;
      }
      if (coursesPage.page > 1) {
        coursesPage.links.prevPage = `/courses?page=${coursesPage.page - 1}`;
        coursesPage.links.firstPage = '/courses?page=1';
      }
      res.status(200).send(coursesPage);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: "error",
        error: `Unable to fetch all courses.`
      });
    }
});

/*
 * Creates a new course - only admins can perform this action
 */
router.post('/', requireAuthentication, async (req, res) => {
  if(validateAgainstSchema(req.body, CourseSchema)) {
    if (req.role == 'admin') {
      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({
          _id: id,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          status: `error`,
          error: "Unable to create new course."
        });
      }
    } else {
      res.status(403).send({
            error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
      });
    }
  } else {
    res.status(400).send({
      error: "The request body was either not present or did not contain a valid Course object."
    })
  }
});

/*
 * Fetch data about a specific course
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await getCourseById(parseInt(req.params.id));
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to fetch course data. Please try again later."
    });
  }
});

/*
 * Patch course infromation given the id in params and information to change in body.
 * TODO: write a validateAgainstSchema function for patches since they may
 * not contain all required fields of a course.
 */
router.patch('/:id', requireAuthentication, async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await getCourseById(id);
  if (course != null) {
    if (course.instructor_id == req.user || req.role == 'admin') {
      if (validateAgainstSchema(req.body, CourseSchemaForPatch)) {
        try {
          const updateSuccessful = await patchCourseById(id, req.body);
          if (updateSuccessful) {
            res.status(200).send({
              links: {
                status: `success`,
                success: `successfully patched course information.`,
                course: `/courses/${id}`
              }
            });
          } else {
            next();
          }
        } catch (err) {
          console.error(err);
          res.status(500).send({
            status:  `error`,
            error: "Unable to patch course information."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid course object."
        });
      }
    } else {
      res.status(403).send({
            error: "Unauthorized to patch the resource."
      });
    }
  } else {
    res.status(404).send({
          error: "Course not found."
    });
  }

});

/*
 * Deletes a course given its id.
 */
router.delete('/:id', requireAuthentication, async (req, res) => {
  if (req.role == 'admin') {
    try {
      const deleteSuccessful = await deleteCourseById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).send({
          status: `success`,
          success: `Course successfully deleted`
        });
      } else {
        res.status(500).send({
          status: `error`,
          error: "Unable to delete course."
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: `error`,
        error: "Unable to delete course."
      });
    }
  } else {
    res.status(403).send({
          error: "Unauthorized to delete the resource."
    });
  }
});

/*
 * fetch a list of students enrolled in a given course by its id.
 */
router.get('/:id/students', requireAuthentication, async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await getCourseById(id);
  if (course != null) {
    if (course.instructor_id == req.user || req.role == 'admin') {
      try {
        const studentList = await getStudentsByCourseId(id);
        res.status(200).send(studentList);
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "error",
          error: `Unable to fetch enrolled students.`
        });
      }
    } else {
      res.status(403).send({
            error: "Unauthorized to view resource."
      });
    }
  } else {
    res.status(404).send({
      error: "error",
      error: `Specified course not found.`
    });
  }

});

/*
 * update enrollment for a course (should be a post req).
 */
router.post('/:id/students', requireAuthentication, async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await getCourseById(id);
  if (course != null) {
    if (course.instructor_id == req.user || req.role == 'admin') {
      if (req.body && (req.body.add || req.body.remove)) {
        try {
          var enrollmentSuccessful;
          var unenrollmentSuccessful;
          if (req.body.add) {
            const studentsToEnroll = req.body.add;
            for (var i = 0; i < studentsToEnroll.length; i++) {
              enrollmentSuccessful = await enrollStudentsToCourseById(studentsToEnroll[i], id);
            }
            if (enrollmentSuccessful) {
              var enrollmentStatus = "successfully enrolled students";
            }
          }
          if (req.body.remove) {
            const studentsToUnenroll = req.body.remove;
            for (var i = 0; i < studentsToUnenroll.length; i++) {
              unenrollmentSuccessful = await unenrollStudentsFromCourseById(studentsToUnenroll[i]);
            }
            if (enrollmentSuccessful) {
              var unenrollmentStatus = "successfully unenrolled students";
            }
          }
          if(enrollmentSuccessful || unenrollmentSuccessful) {
            res.status(201).send({
              status: `success`,
              success: `Enrollment successfully updated.`
            });
          } else {
            res.status(500).send({
              status: `error`,
              error: "Enrollment status update failed."
            });
          }
          } catch (err) {
            console.error(err);
            res.status(500).send({
              status: `error`,
              error: "Enrollment status update failed."
            });
          }
        } else {
          res.status(400).send({
            error: "Request body does not contain the required fields."
          });
        }
      } else {
        res.status(403).send({
              error: "Unauthorized to resource."
        });
      }
  } else {
    res.status(404).send({
      error: "error",
      error: `Specified course not found.`
    });
  }
});

/*
 * fetch a csv file containing a list of students enrolled in the course.
 */
router.get('/:id/roster', requireAuthentication, async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await getCourseById(id);
  if (course != null) {
    if (course.instructor_id == req.user || req.role == 'admin') {
      try {
        const getRoster = await getStudentRosterByCourseId(id);
        if (getRoster) {
          const csv = convertArrayToCSV(getRoster);
          csv.replace(/\n/g, ","); // replace newlines with commas
          csv.replace('""', " "); // replace quotes with spaces
          res.status(201).send(csv);
        } else {
          res.status(500).send({
            status: `error`,
            error: "Unable to fetch CSV file."
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          status: `error`,
          error: "Unable to fetch CSV file."
        });
      }
    } else {
      res.status(403).send({
            error: "Unauthorized to access resource."
      });
    }
  } else {
    res.status(404).send({
      error: "error",
      error: `Specified course not found.`
    });
  }
});

/*
 * Get a list of assignments for a given course
 */
router.get('/:id/assignments', async (req, res) => {
  const id = parseInt(req.params.id);
  const course = await getCourseById(id);
  if (course != null) {
    try {
      const assignments = await getAssignmentsByCourseId(id);
      if (assignments) {
        res.status(201).send({
          assignments: assignments
        });
      } else {
        res.status(500).send({
          status: `error`,
          error: "Unable to fetch assignment list"
        });
    }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: `error`,
        error: "Unable to fetch assignment list"
      });
    }
  } else {
    res.status(404).send({
      error: "error",
      error: `Specified course not found.`
    });
  }
});
module.exports = router;
