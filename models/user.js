const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("User", userSchema, "users");
