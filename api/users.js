const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {UsersSchema} = require('../models/user');

/*
 * Route to create a new user
 */
router.post('/', async (req, res) => {
    try {
      res.status(201).send({
        status: `Route will create a new user`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error"
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
