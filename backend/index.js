const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/r-b-admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const User = mongoose.model("User", UserSchema);

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});
const Product = mongoose.model("Product", ProductSchema);

const OrderSchema = new mongoose.Schema({
  customerName: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "Delivered", "Cancelled"], default: "Pending" },
});
const Order = mongoose.model("Order", OrderSchema);

// Middleware for role-based access
const auth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.sendStatus(403);
  }
};

// Auth routes
app.post("/register", async (req, res) => {
  const { name, email, password, role, manager } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role, manager });
  await user.save();
  res.json(user);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Team management
app.get("/team", auth, async (req, res) => {
  if (req.user.role === "Admin") {
    const users = await User.find();
    res.json(users);
  } else if (req.user.role === "Manager") {
    const team = await User.find({ manager: req.user._id });
    res.json(team);
  } else {
    res.sendStatus(403);
  }
});

// Product routes
app.post("/products", auth, async (req, res) => {
  if (["Admin", "Manager"].includes(req.user.role)) {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } else {
    res.sendStatus(403);
  }
});

app.get("/products", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Order routes
app.post("/orders", auth, async (req, res) => {
  if (req.user.role === "Employee") {
    const { customerName, product } = req.body;
    const order = new Order({ customerName, product, employee: req.user._id });
    await order.save();
    res.json(order);
  } else {
    res.sendStatus(403);
  }
});

app.get("/orders", auth, async (req, res) => {
  if (req.user.role === "Manager") {
    const orders = await Order.find()
      .populate("product")
      .populate("employee");

    res.json({ success: true, orders });
  } else {
    res.sendStatus(403); 
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));
