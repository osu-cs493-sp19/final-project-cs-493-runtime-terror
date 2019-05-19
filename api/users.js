const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {UserSchema, insertNewUser} = require('../models/user');

/*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    try {
      const id = await insertNewUser(req.body);
      res.status(201).send({
        id: id,
        status: `Success`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting user into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid user object."
    });
  }
});

/*
 * Route for user login
 */
router.post('/login', async (req, res) => {
  try {
    res.status(201).send({
      status: `Login will go here`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

/*
 * Fetch data about specific user
 */
router.get('/:id', async (req, res) => {
  try {
    res.status(201).send({
      status: `GetsUserData`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error"
    });
  }
});

module.exports = router;
