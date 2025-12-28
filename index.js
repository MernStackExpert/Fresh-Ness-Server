// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/products" , productRoutes)

app.get("/", (req, res) => {
  res.send("E-commerce server running 🚀");
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});