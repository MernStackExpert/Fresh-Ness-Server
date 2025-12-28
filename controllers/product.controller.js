const { connectDB } = require("../config/db");

const productCollection = async () => {
  const db = await connectDB();
  return db.collection("products");
}

const getAllProducts = async (req , res) => {
  const products = await productCollection.find().toArray();
  res.send(products)
}

module.exports = {getAllProducts}