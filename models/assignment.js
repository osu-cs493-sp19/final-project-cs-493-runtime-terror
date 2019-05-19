/*
 * Schema describing fields of a user object.
 */
const AssignmentSchema = {
    id: { required: false },
    course_id: { required: true },
    title: { required: true },
    points: { required: true },
    due_date: { required: true }
  };
  exports.AssignmentSchema = AssignmentSchema;