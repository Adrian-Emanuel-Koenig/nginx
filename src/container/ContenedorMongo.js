const model = require("../models/prodSchema.js");
const modelMsgs = require("../models/msgSchema.js");

class ContenedorMongo {
  constructor(collection) {
    this.collection = collection;
  }

  async save(obj) {
    try {
      if (this.collection == model) {
        const item = new model(obj);
        const productoNuevo = await item.save();
        return productoNuevo;
      } else {
        const item = new modelMsgs(obj);
        const author = await item.save();
        return author;
      }
    } catch (error) {
      throw console.log(error);
    }
  }

  async getAll() {
    try {
      return await this.collection.find();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ContenedorMongo;