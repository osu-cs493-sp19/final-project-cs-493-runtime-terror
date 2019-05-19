const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {CourseSchema} = require('../models/course');
/*
 * test route
 */
router.get('/', async (req, res) => {
    try {
      res.status(201).send({
        status: `EXAMPLEROUTE`
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error"
      });
    }
});

module.exports = router;
