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
        status: `success`,
        success: `assignment successfully created.`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "error",
        error: "Unable to create assignment"
      });
    }
});

/*
 * Fetch data about a specific assignment
 */
router.get('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `Data successfully fetched.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      error: "Could not fetch data"
    });
  }
});

/*
 * Patch data about specific assignment
 */
router.patch('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `Data successfully updated.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      error: `Unable to patch data.`
    });
  }
});

/*
 * deletes an assignment
 */
router.delete('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `Assignment successfully deleted.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to deleted specified assignment"
    });
  }
});

/*
 * returns all submissions of a given assignment
 */
router.post('/:id/submissions', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `All submissions successfully fetched.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to fetch all submissions"
    });
  }
});

/*
 * creates a new submission for an assignment
 */
router.post('/:id/submissions', async (req, res) => {
  try {
    res.status(201).send({
      status: `success`,
      success: `New submission submitted.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      error: `Unable to submit new submission.`
    });
  }
});
module.exports = router;
