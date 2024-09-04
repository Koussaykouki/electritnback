// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Create a new product (with image and fichetechnique upload)
  router.post('/', upload.fields([{ name: 'image' }, { name: 'fichetechnique' }]), productController.createProduct);
  

// Get all products
router.get('/', productController.getAllProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID (with image and fichetechnique upload)
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'fichetechnique' }]), productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
