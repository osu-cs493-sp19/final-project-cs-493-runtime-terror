const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const moment = require('moment');

const { validateAgainstSchema } = require('../lib/validation');
const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {AssignmentSchema, insertNewAssignment, getAssignmentById, updateAssignmentById, deleteAssignmentById} = require('../models/assignment');
const {SubmissionSchema, saveNewSubmissionInfo, getSubmissionInfoById, getSubmissionsPage} = require('../models/submission');
const { getCourseById } = require('../models/course');

const fileTypes = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/csv': 'csv',
  'text/plain': 'txt',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const basename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = fileTypes[file.mimetype];
      callback(null, `${basename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype])
  }
});

/*
 * creates a new assignment
 *!!!!!Done
 */
router.post('/', requireAuthentication, async (req, res) => {    
    if (validateAgainstSchema(req.body, AssignmentSchema)) {
        try {
            const isInstruct = await getCourseById(req.body.course_id);
            if(req.role === "admin" || req.user === isInstruct.instructor_id){
                const instructID = 0;
                const id = await insertNewAssignment(req.body);
                res.status(201).send({
                    id: id,
                    status: `success`,
                    success: `assignment successfully created.`
                });
            } else {
                res.status(403).send({
                    error: "Unauthorized to access this content."
                });
            }          
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
            const isInstruct = await getCourseById(req.body.course_id);
            if(req.role === "admin" || req.user === isInstruct.instructor_id){
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
 *!!!!Done
 */
router.delete('/:id', requireAuthentication, async (req, res) => {    
  try {
      const assignInfo = await getAssignmentById(parseInt(req.params.id));
      const isInstruct = await getCourseById(assignInfo.course_id);
      if(req.role === "admin" || req.user === isInstruct.instructor_id){
        const deleteDetails = await deleteAssignmentById(parseInt(req.params.id));
            res.status(201).send({
                status: `success`,
                details: `deleteDetails`,
                success: `Assignment successfully deleted.`
            });
      } else{
        res.status(403).send({
            error: "Unauthorized to access this page"
        });
    }   
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: `error`,
      error: "Unable to deleted specified assignment"
    });
  }
    
});

/*
 * returns all submissions of a given assignment, paginated, can search by student id
 * example query: http://localhost:8000/assignments/1/submissions?studentid=12&page=1
 */
router.get('/:id/submissions', requireAuthentication, async (req, res) => {  
    const studentid = parseInt(req.query.studentid) || null;
    const submissionsPage = parseInt(req.query.page) || 1;
  try {
      const assignInfo = await getAssignmentById(parseInt(req.params.id));
      const isInstruct = await getCourseById(assignInfo.course_id);
      if(req.role === "admin" || req.user === isInstruct.instructor_id){
        const allAssignSubmissions = await getSubmissionInfoById(parseInt(req.params.id), studentid, submissionsPage);
        res.status(201).send({
          status: `success`,
          allAssignSubmissions,
          success: `All submissions successfully fetched.`
        });
      
      }
      else{
          res.status(403).send({
                error: "Unauthorized to access this page"
            });
      }
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
router.post('/:id/submissions', requireAuthentication, upload.single('submission'), async (req, res, next) => {
  
  console.log("== req.file:", req.file);
  console.log("== req.body:", req.body);
  if (req.file && req.body && req.body.assignment_id) {
      console.log("req.file.path", req.file.path, "req.file.name", req.file.filename);
    try {
      const time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      const submission = {
        file: `/courses/assignments/submissions/${req.file.filename}`,
        timestamp: time,
        user_id: req.user,
        //contentType: req.file.mimetype,
        assignment_id: req.body.assignment_id
      };
      const id = await saveNewSubmissionInfo(submission);
      res.status(200).send({ id: id });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).send({
      err: "Request body was invalid."
    });
  }
});
module.exports = router;
