const router = require('express').Router();

/*
 * Route ex to get all users
 */
router.get('/', async (req, res, next) => {
        res.status(200).send({ ex: "stuff here" });
  });