const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
dotenv.config({ path: path.resolve(__dirname, ".env") });

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => {
  res.send("ShopNest backend is working properly");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
