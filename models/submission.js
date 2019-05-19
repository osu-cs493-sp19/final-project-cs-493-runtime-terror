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