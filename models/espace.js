const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  title: { type: String, required: true },
  formattedPrice: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  rating: { type: Number, required: true },
});

module.exports = mongoose.model("Espace", placeSchema);
