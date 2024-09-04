// controllers/productController.js
const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    // Validate the inputs
    if (!name || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if files are uploaded
    const image = req.files['image'] ? req.files['image'][0].path : null;
    const fichetechnique = req.files['fichetechnique'] ? req.files['fichetechnique'][0].path : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      type,
      image,
      fichetechnique
    });

    // Save the product to the database
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Received update product request:', req.body);
    
    const { name, description, type } = req.body;

    // Log incoming file details
    console.log('Received files:', req.files);

    // Retrieve the current product from the database
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn(`Product with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only update the image if a new one is provided
    const image = req.files && req.files['image'] ? req.files['image'][0].path : product.image;
    const fichetechnique = req.files && req.files['fichetechnique'] ? req.files['fichetechnique'][0].path : product.fichetechnique;

    console.log('Update details:', { name, image, description, type, fichetechnique });

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        type,
        image,
        fichetechnique
      },
      { new: true }
    );

    console.log('Product successfully updated:', updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error.message);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
