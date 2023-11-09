const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
});

CategorySchema.virtual("url").get(function () {
  return `/category/${slugify(this.name, { lower: true })}`;
});

module.exports = mongoose.model("Category", CategorySchema);
