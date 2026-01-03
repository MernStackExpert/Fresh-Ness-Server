const { connectDB } = require("../config/db");

const verifyAdminOrManager = async (req, res, next) => {
  const db = await connectDB();
  const users = db.collection("users");

  const user = await users.findOne({ email: req.user.email });

  if (!user || !["admin", "manager"].includes(user.role)) {
    return res
      .status(403)
      .send({ message: "Admin or Manager only" });
  }

  next();
};

module.exports = verifyAdminOrManager;
