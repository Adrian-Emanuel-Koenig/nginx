const ProductosDaoMongoDB = require("./super/ProductosDaoMongoDb.js");
const MensajesDaoMongoDB = require("./super/MensajesDaoMongoDB.js");

const instancias = [
  {
    nombre: ProductosDaoMongoDB,
    id: "mongo",
    descripcion: "productos",
    class: "Producto"
  },
  {
    nombre: MensajesDaoMongoDB,
    id: "mongo",
    descripcion: "mensajes",
  },
];

const resultado = {
  [instancias[0].descripcion]: instancias[0].nombre,
  [instancias[1].descripcion]: instancias[1].nombre,
};
export default resultado;
