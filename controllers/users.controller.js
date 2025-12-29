const { connectDB, ObjectId } = require("../config/db");

const collection = async () => {
  const db = await connectDB();
  return db.collection("users");
};

const getAllUsers = async (req, res) => {
  try {
    const userCollection = await collection();

    let query = {};

    //searchByEmail
    if (req.query.email) {
      query.email = req.query.email;
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // total users
    const totalUsers = await userCollection.countDocuments(query);

    const result = await userCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
    res.send({
      result,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed To Fetch Users Data" });
  }
};

const createUsers = async (req, res) => {
  try {
    const userCollection = await collection();

    let user = {
      ...req.body,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const exist = await userCollection.findOne({ email: req.body.email });
    if (exist) {
      return res.status(409).send({ message: "User already exists" });
    }

    const result = await userCollection.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create product", error });
  }
};

const updateUsers = async (req, res) => {
  try {
    const userCollection = await collection();

    const id = req.params.id;
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User Not Found" });
    }

    res.send({ message: "User updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update User", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userCollection = await collection();

    const id = req.params.id;
    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "User Not Found" });
    }

    res.send({ message: "User deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete User", error });
  }
};

module.exports = { getAllUsers, createUsers, updateUsers, deleteUser };
