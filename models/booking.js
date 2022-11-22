const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  created_date: { type: String, required: true },
  created_time: { type: String, required: true },
  email: { type: String, required: true },
  end_date: { type: String, required: true },
  place: { type: Schema.Types.ObjectId, required: true },
  start_date: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  totalCost: { type: Number, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
  host: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema, "booking");
