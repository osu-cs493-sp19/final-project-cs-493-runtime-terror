const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {UserSchema, insertNewUser, validateUser, getUserByEmail, getUserById, getCoursesById} = require('../models/user');

/*
 * Route to create a new student.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    try {
      if(req.body.role == 'admin' || req.body.role == 'instructor')
        res.status(403).send({
          status: `error`,
          error: `The request was not made by an authenticated User. Please use /user/admin and supply admin credentials.`
        });
      const id = await insertNewUser(req.body);
      res.status(201).send({
        status: `success`,
        success: `New user successfully added.`,
        id: id
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: `error`,
        error: "Error inserting user into DB. Please try again later."
      });
    }
  } else {
    res.status(400).send({
      status: `error`,
      error: "The request body was either not present or did not contain a valid User object."
    });
  }
});

/*
 * Route to create a user from admin/instructor authentication.
 */
router.post('/admin',requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    try { 
      const user = await getUserById(req.user);
      if (user.role == "admin"){
        const id = await insertNewUser(req.body);
        res.status(201).send({
          status: `success`,
          success: `New user successfully added.`,
          id: id
        });
      }
      else{
        res.status(403).send({
          status: `error`,
          error: `The request was not made by an authenticated User. Please use /user/admin and supply admin credentials.`
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: `error`,
        error: "Error inserting user into DB. Please try again later."
      });
    }
  } else {
    res.status(400).send({
      status: `error`,
      error: "The request body was either not present or did not contain a valid User object."
    });
  }
});

/*
 * User Login
 */

router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.email, req.body.password);
      const user = await getUserByEmail(req.body.email);
      if (authenticated) {
        const token = generateAuthToken(user.id, user.role);
        res.status(200).send({
          status: "success",
          success: "Login was successful",
          token: token
        });
      } else {
        res.status(401).send({
          status: "error",
          error: "Invalid credentials were supplied."
        });
      }
    } catch (err) {
      res.status(500).send({
        status: "error",
        error: "Error validating user. Try again later."
      });
    }
  } else {
    res.status(400).send({
      status:  `error`,
      error: "The request body was either not present or did not contain a valid email and password."
    });
  }
});

/*
 * Route to fetch info about a specific user.
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  if (req.params.id == req.user) {
    try {
      const user = await getUserById(req.params.id);
      var coursesEnrolled;
      if(req.role == "student")
        coursesEnrolled = await getCoursesById(req.params.id, "student");
      else
        coursesEnrolled = await getCoursesById(req.params.id, "instructor");
      if (user) {
        res.status(200).send({
          status: "success",
          success: "User information was successfully fetched.",
          name: user.name,
          email: user.email,
          role: user.role,
          user_id: user.id,
          course_ids: coursesEnrolled
        });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send({
        status: "error",
        error: "Error fetching user. Try again later."
      });
    }
  } else {
    res.status(403).send({
      status: "error",
      error: "The request was not made by an authenticated User satisfying the authorization criteria described above."
    });
  }
});

module.exports = router;
