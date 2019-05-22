const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const { CourseSchema, getCoursesPage, insertNewCourse, getCourseById } = require('../models/course');

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
      res.status(400).send({
        error: "The request body was either not present or did not contain a valid Course object."
      })
    }
  } else {
    res.status(403).send({
          error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
    });
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
 */
router.patch('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `successfully patched course information.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status:  `error`,
      error: "Unable to patch course information."
    });
  }
});

/*
 * Deletes a course given its id.
 */
router.delete('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `Course successfully deleted`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to delete course."
    });
  }
});

/*
 * fetch a list of students enrolled in a given course by its id.
 */
router.get('/:id/students', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `successfully fetched enrolled students.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "error",
      error: `Unable to fetch enrolled students.`
    });
  }
});

/*
 * update enrollment for a course (should be a post req).
 */
router.post('/:id/students', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `Enrollment successfully updated.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Enrollment status update failed."
    });
  }
});

/*
 * fetch a csv file containing a list of students enrolled in the course.
 */
router.get('/:id/roster', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `CSV file successfully fetched.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to fetch CSV file."
    });
  }
});

/*
 * Get a list of assignments for a given course
 */
router.get('/:id/assignments', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `List of assignments successfully fetched.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to fetch assignment list"
    });
  }
});
module.exports = router;
