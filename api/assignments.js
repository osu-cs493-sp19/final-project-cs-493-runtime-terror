const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {AssignmentSchema} = require('../models/assignment');
const {SubmissionSchema} = require('../models/submission');

/*
 * creates a new assignment
 */
router.post('/', async (req, res) => {
    try {
      res.status(201).send({
        status: `should create a new assignment`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error"
      });
    }
});

/*
 * Fetch data about a specific assignment
 */
router.get('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should return assignment data`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Patch data about specific assignment
 */
router.patch('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should pach info about specific assignment`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * deletes an assignment
 */
router.delete('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `should delte assignment`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * returns all submissions of a given assignment
 */
router.post('/:id/submissions', async (req, res) => {
  try {
    res.status(201).send({
      status: `should return list of submissions given an assignment`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * creates a new submission for an assignment
 */
router.post('/:id/submissions', async (req, res) => {
  try {
    res.status(201).send({
      status: `should create a new submission for an assignment`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});
module.exports = router;
