const bcrypt = require('bcryptjs');
const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
/*
 * Schema describing fields of a user object.
 */
const SubmissionSchema = {
    id: { required: false },
    assignment_id: { required: true },
    timestamp: { required: true },
    file: { required: true },
  };
  exports.SubmissionSchema = SubmissionSchema;