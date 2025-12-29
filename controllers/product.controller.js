const { connectDB, ObjectId } = require("../config/db");

const collection = async () => {
  const db = await connectDB();
  return db.collection("products");
};

const getAllProducts = async (req, res) => {
  try {
    const productCollection = await collection();
    const query = {};

    //Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    //Search filter
    if (req.query.search) {
      query.name = { $regex: req.query.search, $option: "i" };
    }

    //Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    //rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    //pagination skip + limit
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //total product count
    const totalProducts = await productCollection.countDocuments(query);

    //sort asc + desc

    let sort = {};
    if (req.query.sortBy) {
      const order = req.query.order === "desc" ? -1 : 1;
      sort[req.query.sortBy] = order;
    }

    const products = await productCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch products", error });
  }
};

const singleProduct = async (req, res) => {
  try {
    const productCollection = await collection();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid product id" });
    }
    const product = await productCollection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch product",
      error,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const productCollection = await collection();

    const product = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productCollection.insertOne(product);

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productCollection = await collection();

    const id = req.params.id;

    const result = await productCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Product Not Found" });
    }

    res.send({ message: "Product updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update product", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productCollection = await collection();
    const id = req.params.id;

    const result = await productCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Product Not Found" });
    }

    res.send({ message: "Product deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete product", error });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
};
