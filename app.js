const express = require("express");
const connectionMDB = require("./src/connection/mongoDb.js").connectionMDB;
const { dirname } = require("path");
const { fileURLToPath } = require("url");
const engine = require("express-handlebars").engine;
const Router = require("express").Router;
const Server = require("socket.io").Server;
const http = require("http");
const productos = require("./src/controllers/products.js").productos;
const mensajes = require("./src/controllers/products.js").mensajes;
const { normalize, schema } = require("normalizr");
const faker = require("@faker-js/faker");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const Usuarios = require("./src/models/userSchema.js");
const bcrypt = require("bcrypt");
const routes = require("./src/routes/routes.js");
const minimist = require("minimist");
const { fork } = require("child_process");

const { product, price, image } = faker;

const args = minimist(process.argv.slice(2));
const app = express();
const port = args.p || 8080;
// const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const io = new Server(server);

/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

server.listen(port, async () => {
  await connectionMDB;
  console.log("Server on: http://localhost:" + port);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/src/public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Koenig:24042503@coderhouse.haylz8i.mongodb.net/usuario?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),

    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "hbs");
app.set("views", "./src/views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/src/views/layouts",
    partialsDir: __dirname + "/src/views/partials",
  })
);
app.enable("trust proxy");

app.use("/api/productos", Router);

app.use("/api/productos-test", (req, res) => {
  let prodFaker = [];
  for (let i = 0; i < 5; i++) {
    prodFaker.push({
      producto: faker.commerce.product(),
      precio: faker.commerce.price(1000, 4000, 0, "$"),
      image: faker.image.abstract(150, 150),
    });
  }
  res.json(prodFaker);
});

app.use("/api/nombre", (req, res) => {
  res.json(req.session.username);
});

/* -------------------------------------------------------------------------- */
/*                                    Fork                                    */
/* -------------------------------------------------------------------------- */

let visitas = 0;

app.get("/api/randoms/", (req, res) => {
  const computo = fork("./computo.js");

  computo.send({
    mensaje: "start",
    cantidad: 100000000,
  });

  computo.on("message", (msg) => {
    res.json(msg);
  });
});

app.get("/", (req, res) => {
  res.end("Ok " + ++visitas);
});

app.get("/api/randoms/:cant", (req, res) => {
  const { cant } = req.params;
  const computo = fork("./computo.js");

  computo.send({
    mensaje: "start",
    cantidad: cant,
  });

  computo.on("message", (msg) => {
    res.json(msg);
  });
});

/* -------------------------------------------------------------------------- */
/*                                    Rutas                                   */
/* -------------------------------------------------------------------------- */
// app.get("/", routes.home);
app.get("/login", routes.getLogin);
app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failureLogin" }),
  routes.postLogin
);
app.get("/logout", routes.renderizar, routes.logout);
app.get("/signup", routes.getSignIn);
app.post(
  "/signup",
  passport.authenticate("signup", { failureRedirect: "/failureSignin" }),
  routes.postSignIn
);
app.get("/failureLogin", (req, res) => {
  res.render("failureLogin");
});
app.get("/failureSignin", (req, res) => {
  res.render("failureSignin");
});

app.get("/info", (req, res) => {
  res.json({
    "Nombre de la plataforma": process.platform,
    "Argumentos de entrada": process.argv,
    "Carpeta del proyecto": process.execPath,
    "Process id": process.pid,
    "Path de ejecución": process.cwd(),
    "Memoria total reservada": process.memoryUsage().rss,
    "Versión de node.js": process.version,
  });
});
/* -------------------------------------------------------------------------- */
/*                                  Passport                                  */
/* -------------------------------------------------------------------------- */

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

passport.use(
  "login",
  new Strategy((username, password, done) => {
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }

      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new Strategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log("Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          console.log("User already exists");
          return done(null, false);
        }

        const newUser = {
          username: username,
          password: createHash(password),
        };
        console.log(newUser);
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }
          console.log(user);
          console.log("User Registration succesful");
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});

/* -------------------------------------------------------------------------- */
/*                                Normalización                               */
/* -------------------------------------------------------------------------- */

const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email" });
const messageSchema = new schema.Entity("messages", { author: authorSchema });
const chatSchema = new schema.Entity("chats", { messages: [messageSchema] });
const normalizarData = (data) => {
  const dataNormalizada = normalize(
    { id: "chatHistory", messages: data },
    chatSchema
  );
  return dataNormalizada;
};
const normalizarMensajes = async () => {
  const messages = await mensajes.getAll();
  console.log(messages);
  const normalizedMessages = normalizarData(messages);
  console.log(JSON.stringify(normalizedMessages, null, 4));

  return normalizedMessages;
};

/* -------------------------------------------------------------------------- */
/*                                  Socket.io                                 */
/* -------------------------------------------------------------------------- */

io.on("connection", async (socket) => {
  const products = await productos.getAll();
  socket.emit("allProducts", products);
  socket.on("msg", async (data) => {
    const today = new Date();
    const now = today.toLocaleString();
    await mensajes.save({ timestamp: now, ...data });
    io.sockets.emit("msg-list", await mensajes.getAll());
    io.sockets.emit("msg-list2", await normalizarMensajes());
  });

  socket.on("productoEnviado", saveProduct);
});

async function saveProduct(data) {
  await productos.save(data);
  productos.getAll().then((element) => io.sockets.emit("allProducts", element));
}
