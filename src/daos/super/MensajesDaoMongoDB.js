const ContenedorMongo = require("../../container/ContenedorMongo.js");
const msgSchema = require("../../models/msgSchema.js");

class MensajesDaoMongoDB extends ContenedorMongo {
  constructor() {
    super(msgSchema);
  }
}

module.exports = MensajesDaoMongoDB;