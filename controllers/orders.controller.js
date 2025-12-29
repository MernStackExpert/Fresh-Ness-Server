const { connectDB, ObjectId } = require("../config/db");

const collection = async () => {
  const db = await connectDB();
  return db.collection("orders");
};

const getOrders = async (req, res) => {
  try {
    const ordersCollection = await collection();

    let query = {};
    if (req.query.email) {
      query.email = req.query.email;
    }

    // Ensure page and limit are numbers
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrder = await ordersCollection.countDocuments(query);

    const orders = await ordersCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      totalOrder,
      currentPage: page,
      totalPages: Math.ceil(totalOrder / limit),
      orders,
    });
  } catch (error) {
    // Logging the error is helpful for debugging
    res
      .status(500)
      .send({ message: "Failed to fetch orders", error: error.message });
  }
};

const createOrders = async (req, res) => {
  try {
    const ordersCollection = await collection();

    const orders = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(orders);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create Order", error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const ordersCollection = await collection();

    const id = req.params.id;
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body }, updatedAt: new Date() }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Product Not Found" });
    }

    res.send({ message: "Product updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update product", error });
  }
};

const deleteOrder = async (req , res) => {
  try {
      const ordersCollection = await collection();
      const id = req.params.id;
      const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Orders Not Found" });
      }
  
      res.send({ message: "Orders deleted successfully", result });
    } catch (error) {
      res.status(500).send({ message: "Failed to delete Orders", error });
    }
}

module.exports = { getOrders, createOrders , updateOrder , deleteOrder};
