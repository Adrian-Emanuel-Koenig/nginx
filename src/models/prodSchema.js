const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productosSchema = new Schema({
  nombre: { type: String, required: true, max: 100 },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  img: { type: String, required: true },
});

module.exports = mongoose.model("productos", productosSchema);