const API = "http://localhost:8080";
const socket = io();

/* ------------------------------- Get Element ------------------------------ */

const containerProducto = document.getElementById("containerProducto");
const containerFaker = document.getElementById("containerFaker");
const sendForm = document.getElementById("sendForm");
const username = document.getElementById("username");
/* -------------------------------- Functions ------------------------------- */
function renderUser() {
  fetch(`${API}/api/nombre`)
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
      username.innerHTML = res;
    });
}
renderUser();

function addProduct(e) {
  e.preventDefault();
  const { nombre, precio, img, stock } = e.target;
  const productToSend = {
    nombre: nombre.value,
    precio: precio.value,
    img: img.value,
    stock: stock.value,
  };
  socket.emit("productoEnviado", productToSend);
}

function renderProducts(data) {
  console.log(data);
  fetch(`${API}/productsList.handlebars`)
    .then((res) => res.text())
    .then((res) => {
      const template = Handlebars.compile(res);
      containerProducto.innerHTML = template({ products: data });
    });
}
function renderFaker(data) {
  fetch(`${API}/api/productos-test`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      let html = "";
      res.forEach((element) => {
        html += `
        <div>
        <p>${element.producto}</p>
        <p>${element.precio}</p>
        <p>${element.image}</p>
        </div>
        `;
      });
      const template = Handlebars.compile(html);
      containerFaker.innerHTML = template(html);
    });
}

renderFaker();
function enviarMsg() {
  const email = document.getElementById("input-email").value;
  const nombre = document.getElementById("input-nombre").value;
  const apellido = document.getElementById("input-apellido").value;
  const edad = document.getElementById("input-edad").value;
  const alias = document.getElementById("input-alias").value;
  const avatar = document.getElementById("input-avatar").value;
  const msgParaEnvio = document.getElementById("input-msg").value;
  socket.emit("msg", {
    author: {
      email: email,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      alias: alias,
      avatar: avatar,
    },
    text: msgParaEnvio,
  });
}
/* ------------------------------ Normalización ----------------------------- */
const authorSchema = new normalizr.schema.Entity(
  "authors",
  {},
  { idAttribute: "email" }
);
const messageSchema = new normalizr.schema.Entity("messages", {
  author: authorSchema,
});
const chatSchema = new normalizr.schema.Entity("chats", {
  messages: [messageSchema],
});
/* --------------------------------- Sockets -------------------------------- */

socket.on("connect", () => {
  console.log("On");
});

socket.on("msg", (data) => {
  console.log(data);
});

socket.on("allProducts", renderProducts);

socket.on("msg-list", (data) => {
  console.log(JSON.stringify(data, null, 4).length);
  console.log(data);
  let html = "";
  data.forEach((element) => {
    html += `
    <div>
    <span id="emailForm">${element.author.alias}</span>
    <span id="fecha">${element.timestamp}</span>
    <span id="mensajeForm">${element.text}</span>
    </div>
    `;
  });
  document.getElementById("div-list-msgs").innerHTML = html;
});

socket.on("msg-list2", (data) => {
  console.log(JSON.stringify(data, null, 4).length);
  console.log(data);
  const msgsNorm = normalizr.denormalize(
    data.result,
    chatSchema,
    data.entities
  );
  console.log("data", msgsNorm);
  let html = "";
  msgsNorm.messages.forEach((element) => {
    html += `
    <div>
    <span id="emailForm">${element._doc.author.alias}</span>
    <span id="fecha">${element._doc.timestamp}</span>
    <span id="mensajeForm">${element._doc.text}</span>
    </div>
    `;
  });
  document.getElementById("div-list-msgs2").innerHTML = html;
});
socket.on("listaProductos", (data) => {
  console.log("Productos" + data);
});

/* --------------------------- Add Event Listener --------------------------- */

sendForm.addEventListener("submit", addProduct);
