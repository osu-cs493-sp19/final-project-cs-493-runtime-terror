/*
 * Schema describing fields of a user object.
 */
const CourseSchema = {
    id: { required: false },
    subject: { required: true },
    number: { required: true },
    title: { required: true },
    term: { required: true },
    instructor_id: { required: true }
  };
  exports.CourseSchema = CourseSchema;