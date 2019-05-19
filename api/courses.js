const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {CourseSchema} = require('../models/course');
/*
 * Gets a list of all courses
 */
router.get('/', async (req, res) => {
    try {
      res.status(201).send({
        status: `list courses here`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error"
      });
    }
});

/*
 * Creates a new course
 */
router.post('/', async (req, res) => {
  try {
    res.status(201).send({
      status: `should create a course here`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Fetch data about a specific course
 */
router.get('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should fetch data about a specific course`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Patch course infromation given the id in params and information to change in body.
 */
router.patch('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should patch course info`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Deletes a course given its id.
 */
router.delete('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should delete course by its id`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * fetch a list of students enrolled in a given course by its id.
 */
router.get('/:id/students', async (req, res) => {
  try {
    res.status(201).send({
      status: `list studens enrolled in a given course`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * update enrollment for a course (should be a post req).
 */
router.post('/:id/students', async (req, res) => {
  try {
    res.status(201).send({
      status: `should update student enrollment`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * fetch a csv file containing a list of students enrolled in the course.
 */
router.get('/:id/roster', async (req, res) => {
  try {
    res.status(201).send({
      status: `returns a csv of students enrolled in a given course`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Get a list of assignments for a given course
 */
router.get('/:id/assignments', async (req, res) => {
  try {
    res.status(201).send({
      status: `returns a list of assignments for a given course`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});
module.exports = router;
