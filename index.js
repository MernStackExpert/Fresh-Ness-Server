// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/users.routes");
const orderRoutes = require("./routes/orders.route");
const paymentRoutes = require("./routes/payment.route");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/products" , productRoutes)
app.use("/users", userRoutes);
app.use("/orders", orderRoutes)
app.use(paymentRoutes);

app.get("/", (req, res) => {
  res.send("E-commerce server running 🚀");
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});