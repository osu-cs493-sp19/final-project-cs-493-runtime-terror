/*
 * Schema describing fields of a user object.
 */
const UserSchema = {
    id: { required: false },
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: true }
  };
  exports.UserSchema = UserSchema;