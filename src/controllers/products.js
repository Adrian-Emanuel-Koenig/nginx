const ProductosDaoMongoDB = require("../daos/super/ProductosDaoMongoDb.js");
const MensajesDaoMongoDB = require("../daos/super/MensajesDaoMongoDB.js");

const productos = new ProductosDaoMongoDB();
const mensajes = new MensajesDaoMongoDB();

module.exports = { productos, mensajes };