const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
    let imageUrl = bodyImageUrl || "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image is required (upload an 'image' file or provide 'imageUrl' in body)",
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl,
    });

    const saveProduct = await product.save();
    res.status(201).json(saveProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message || "server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      if (bodyImageUrl) {
        product.imageUrl = bodyImageUrl;
      }
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
      }
      const updateProduct = await product.save();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message || "server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "product removed" });
    } else {
      res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
