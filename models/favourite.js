const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
  place: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  host: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Favourite", favouriteSchema, "favourite");
