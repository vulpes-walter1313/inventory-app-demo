const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: Schema.Types.Decimal128,
  inStock: { type: Number, min: 0, max: 1000 },
  slug: { type: String, unique: true, required: true },
});

InstrumentSchema.virtual("url").get(function () {
  return `/product/${this.slug}`;
});

module.exports = mongoose.model("Instrument", InstrumentSchema);
