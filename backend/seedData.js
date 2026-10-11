const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Existing data cleared.");

    // Create Admin and Regular Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: adminPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: userPassword,
        role: "user",
        verified: true,
      },
    ]);

    console.log("Users seeded successfully!");

    // Create Products
    const products = await Product.insertMany([
      {
        name: "Wireless Noise Cancelling Headphones",
        description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
        price: 14999,
        category: "Electronics",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: "Smart Fitness Watch",
        description: "Waterproof fitness tracker with heart rate monitor, sleep tracking, and GPS.",
        price: 4999,
        category: "Electronics",
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        rating: 4.2,
        numReviews: 8,
      },
      {
        name: "Premium Leather Wallet",
        description: "Handcrafted genuine leather wallet with RFID blocking technology.",
        price: 1299,
        category: "Accessories",
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1627124718515-47f9931b37e7?w=500",
        rating: 4.7,
        numReviews: 25,
      },
      {
        name: "Ergonomic Office Chair",
        description: "Adjustable high-back mesh chair with lumbar support and 3D armrests.",
        price: 11999,
        category: "Furniture",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",
        rating: 4.4,
        numReviews: 15,
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Double-walled vacuum insulated bottle that keeps drinks cold for 24 hours.",
        price: 999,
        category: "Home & Kitchen",
        stock: 150,
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
        rating: 4.6,
        numReviews: 30,
      },
    ]);

    console.log("Products seeded successfully!");

    // Create Orders
    await Order.insertMany([
      {
        user: users[1]._id, // John Doe
        items: [
          {
            productId: products[0]._id,
            qty: 1,
            price: products[0].price,
          },
          {
            productId: products[2]._id,
            qty: 2,
            price: products[2].price,
          },
        ],
        totalAmount: products[0].price + products[2].price * 2,
        address: {
          fullName: "John Doe",
          street: "123 Main St",
          city: "Mumbai",
          postalCode: "400001",
          country: "India",
        },
        status: "delivered",
      },
      {
        user: users[2]._id, // Jane Smith
        items: [
          {
            productId: products[1]._id,
            qty: 1,
            price: products[1].price,
          },
        ],
        totalAmount: products[1].price,
        address: {
          fullName: "Jane Smith",
          street: "456 Park Ave",
          city: "Delhi",
          postalCode: "110001",
          country: "India",
        },
        status: "pending",
      },
    ]);

    console.log("Orders seeded successfully!");
    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
