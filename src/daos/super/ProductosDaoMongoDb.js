const ContenedorMongo = require("../../container/ContenedorMongo.js");
const productosSchema = require("../../models/prodSchema.js");

class ProductosDaoMongoDB extends ContenedorMongo {
  constructor() {
    super(productosSchema);
  }
}

module.exports = ProductosDaoMongoDB;