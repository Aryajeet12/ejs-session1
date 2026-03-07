import express from "express";
import session from "express-session";
import expressLayouts from "express-ejs-layouts";
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
const users = [
  {
    id: 1,
    name: "John",
    email: "john@gmail.com",
    password: "1234",
    role: "admin",
  },
  {
    id: 2,
    name: "Cathy",
    email: "cathy@gmail.com",
    password: "1234",
    role: "user",
  },
];

const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 150 },
];

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => user.email === email && user.password === password,
  );
  if (user) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.render("login");
  }
});

app.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { users });
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/products", (req, res) => {
  if (req.session.user.role === "admin") {
    res.render("products", { products });
  } else res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server started");
});