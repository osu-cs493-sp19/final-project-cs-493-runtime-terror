const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {AssignmentSchema, insertNewAssignment, getAssignmentById, updateAssignmentById, deleteAssignmentById} = require('../models/assignment');
const {SubmissionSchema} = require('../models/submission');

/*
 * creates a new assignment
 *!!!!!NEed to check if user is instructor of the course
 */
router.post('/', requireAuthentication, async (req, res) => {   
    if(req.role === "admin" || req.role === "instructor"){
        if (validateAgainstSchema(req.body, AssignmentSchema)) {
            try {
                const instructID = 0;
                const id = await insertNewAssignment(req.body);
              res.status(201).send({
                id: id,
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
        } else {
            res.status(400).send({
            error: "Request body is not a valid assignment object."
        });
      }
    } else {
        res.status(403).send({
            error: "Unauthorized to access this content."
        });
    }
});

/*
 * Fetch data about a specific assignment
 */
router.get('/:id', async (req, res) => {
  try {
      const assignment = await getAssignmentById(parseInt(req.params.id));
      if(assignment){
        res.status(200).send({
          status: `success`,
          assignment: assignment,
          success: `Data successfully fetched.`
        });
      }
      else{
          res.status(404).send({
              status: `Failure`,
              error: "Requested assignment does not exist."
          });
      }
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
 * !!Need to check if user is instructor of the course
 */
router.patch('/:id', requireAuthentication, async (req, res) => {
    try{
        if(validateAgainstSchema(req.body, AssignmentSchema)) {
            //const userDetails = await getUserById(req.user);
            if(req.role === "admin" || req.role === "instructor"){
              try {
                  const updateSuccess = await updateAssignmentById(parseInt(req.params.id), req.body);
                res.status(201).send({
                  status: `success`,
                  updateStatus: updateSuccess,
                  success: `Data successfully updated.`
                });
              } catch (err) {
                console.error(err);
                res.status(500).send({
                  status: "error",
                  error: `Unable to patch data.`
                });
              }
            }
            else{
                res.status(400).send({
                    error: "The request body did not include required fields."
                });
            }
        }
        else{
            res.status(403).send({
                status: "error",
                error: "Unauthorized to access this page."
            });
        }
    } catch(err){
        console.error(err);
        res.status(500).send({
            status: "error",
            error: "Unable to access user"
        });
    }
});

/*
 * deletes an assignment
 *!!!!Need to check if user is instructor of the course
 */
router.delete('/:id', requireAuthentication, async (req, res) => {
    if(req.role === "admin" || req.role === "instructor"){
      try {
          const deleteDetails = await deleteAssignmentById(parseInt(req.params.id));
        res.status(201).send({
          status: `success`,
          details: `deleteDetails`,
          success: `Assignment successfully deleted.`
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          status: `error`,
          error: "Unable to deleted specified assignment"
        });
      }
    }
    else{
        res.status(403).send({
            error: "Unauthorized to access this page"
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
