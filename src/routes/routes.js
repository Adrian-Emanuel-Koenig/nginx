const Usuarios = require("../models/userSchema.js");

const home = (req, res) => {
  if (req.session?.username) {
    res.render("home", { username: req.session?.username });
  } else {
    res.redirect("/login");
  }
};

const getLogin = (req, res) => {
  res.render("login", { login: true });
};

const postLogin = (req, res) => {
  req.session.username = req.body.username;
  res.redirect("/");
};

const renderizar = (req, res, next) => {
  res.render("logout");
  next();
};

const logout = (req, res) => {
  const nombre = req.session.nombre;
  setTimeout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error al desloguear");
      } else {
        console.log(nombre + " deslogueado");
      }
    });
  }, 2000);
};

const getSignIn = (req, res) => {
  res.render("signup");
};

const postSignIn = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  res.render("login", { username, password });
};

module.exports = {
  home,
  getLogin,
  postLogin,
  renderizar,
  logout,
  getSignIn,
  postSignIn,
};
