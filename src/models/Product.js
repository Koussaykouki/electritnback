const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: false }, // Set to false if not required
  fichetechnique: { type: String, required: false } // Set to false if not required
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
