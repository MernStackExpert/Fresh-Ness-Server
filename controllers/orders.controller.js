const { connectDB, ObjectId } = require("../config/db");
const sendOrderEmail = require("../utils/sendOrderEmail");

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
    res.status(500).send({ 
      message: "Failed to fetch orders", 
      error: error.message 
    });
  }
};

const getSingleOrder = async (req , res) => {
  try {
    const ordersCollection = await collection();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid orders id" });
    }
    const orders = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!orders) {
      return res.status(404).send({ message: "orders not found" });
    }

    res.send(orders);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch orders",
      error,
    });
  }
}

const createOrders = async (req, res) => {
  try {
    const ordersCollection = await collection();

    const {
      email,
      products,
      total,
      paymentMethod,
      shippingAddress,
      transactionId,
    } = req.body;

    if (!email || !products || products.length === 0 || !total) {
      return res.status(400).send({ message: "Invalid order data" });
    }

    const order = {
      userId: req.user ? req.user._id : null,
      email,
      products,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      transactionId: paymentMethod !== "COD" ? transactionId : null,
      orderStatus: "pending",
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Thanks for your order!</h2>
        <p><b>Order ID:</b> ${result.insertedId}</p>
        ${transactionId ? `<p style="background: #f4f4f4; padding: 10px;"><b>Transaction ID:</b> ${transactionId}</p>` : ""}
        <p><b>Total Amount:</b> $${total}</p>
        <hr />
        <h3>Product Details:</h3>
        <ul>
          ${products.map((p) => `<li>${p.name} × ${p.quantity} = $${p.price * p.quantity}</li>`).join("")}
        </ul>
        <p>Status: <b>${paymentMethod === "COD" ? "To be paid on delivery" : "Paid"}</b></p>
      </div>
    `;

    try {
      await sendOrderEmail({
        to: email,
        subject: "Order Confirmation",
        html,
      });
    } catch (emailError) {
      console.error("Email Service Error:", emailError.message);
    }

    res.status(201).send({
      message: "Order created successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).send({ message: "Failed to create order" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const id = req.params.id;
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Order Not Found" });
    }

    res.send({ message: "Order updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update order", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const id = req.params.id;
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Order Not Found" });
    }

    res.send({ message: "Order deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete order", error });
  }
};

module.exports = { getOrders, createOrders, updateOrder, deleteOrder , getSingleOrder };