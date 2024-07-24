const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for handling multipart/form-data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Save uploaded files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4(); // Generate unique file name using UUID
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware to authenticate user based on JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://192.168.10.245:${port}`);
});

//
const userDataFile = path.join(__dirname, 'userData.json');
const categoryDataFile = path.join(__dirname, 'categoryData.json');
const productDataFile = path.join(__dirname, 'productData.json');
const variantDataFile = path.join(__dirname, 'variantData.json');
const variantValueDataFile = path.join(__dirname, 'variantValueData.json');
const combinationDataFile = path.join(__dirname, 'combinationData.json');
const combinationValueDataFile = path.join(__dirname, 'combinationValueData.json');
const cartDataFile = path.join(__dirname, 'cartData.json');
const cartVariantDataFile = path.join(__dirname, 'cartVariantData.json');
const billDataFile = path.join(__dirname, 'billData.json');
const billDetailDataFile = path.join(__dirname, 'billDetailData.json');
const secretKey = '1312Phuoc'; // Use an environment variable in production


// Auth routes
const AuthController = require('./controller/authController');
const authController = new AuthController(userDataFile, secretKey);

app.post('/api/Auth/signUp', upload.none(), (req, res) => authController.signUp(req, res));

app.post('/api/Auth/signIn', upload.none(), (req, res) => authController.signIn(req, res));

app.get('/api/Auth/current', upload.none(), (req, res) => authController.getCurrentUser(req, res));

app.post('/api/Auth/updateProfile', upload.none(), (req, res) => authController.updateProfile(req, res));

app.post('/api/Auth/changePassword', upload.none(), (req, res) => authController.changePassword(req, res));

// app.put('/api/Auth/forgetPass', upload.none(), (req, res) => authController.forgetPass(req, res));



// Category routes
const CategoryController = require('./controller/categoryController');
const categoryController = new CategoryController(categoryDataFile, secretKey);

app.post('/api/Category/addCategory', upload.none(), (req, res) => categoryController.addCategory(req, res));

app.get('/api/Category/getListAll', upload.none(), (req, res) => categoryController.getListAll(req, res));

app.delete('/api/Category/removeCategory', upload.none(), (req, res) => categoryController.removeCategoryById(req, res));


// Product routes
const ProductController = require('./controller/productController');
const productController = new ProductController(productDataFile, categoryDataFile, secretKey);

app.post('/api/Product/addProduct', upload.none(), (req, res) => productController.addProduct(req, res));

app.get('/api/Product/getListAll', upload.none(), (req, res) => productController.getListAll(req, res));

app.delete('/api/Product/removeProduct', upload.none(), (req, res) => productController.removeProductByID(req, res));

app.get('/api/Product/getListByCategory', upload.none(), (req, res) => productController.getListByCategoryName(req, res));

app.post('/api/Product/updateProduct', upload.none(), (req, res) => productController.updateProductByID(req, res));


// Variant routes
const VariantController = require('./controller/variantController');
const variantController = new VariantController(variantDataFile, secretKey);

app.post('/api/Variant/addVariant', upload.none(), (req, res) => variantController.addVariant(req, res));

app.get('/api/Variant/getListVariant', upload.none(), (req, res) => variantController.getListAll(req, res));

app.delete('/api/Variant/removeVariant', upload.none(), (req, res) => variantController.removeVariantByName(req, res));


// VariantValue routes
const VariantValueController = require('./controller/variantValueController');
const variantValueController = new VariantValueController(variantValueDataFile, variantDataFile, secretKey);

app.post('/api/VariantValue/addVariantValue', upload.none(), (req, res) => variantValueController.addVariantValue(req, res));

app.get('/api/VariantValue/getListVariantValue', upload.none(), (req, res) => variantValueController.getListAll(req, res));

app.get('/api/VariantValue/getListVariantValueByVariantName', upload.none(), (req, res) => variantValueController.getListValueByVariantName(req, res));

app.post('/api/VariantValue/updateVariantValue', upload.none(), (req, res) => variantValueController.updateVariantValue(req, res));

app.delete('/api/VariantValue/removeVariantValueByVariantName', upload.none(), (req, res) => variantValueController.removeVariantValueByVariantName(req, res));

app.delete('/api/VariantValue/removeVariantValue', upload.none(), (req, res) => variantValueController.removeVariantValueByID(req, res));


// Combination routes
const CombinationController = require('./controller/combinationController');
const combinationController = new CombinationController(combinationDataFile, variantDataFile, productDataFile, secretKey);

app.post('/api/Combination/addCombination', upload.none(), (req, res) => combinationController.addCombination(req, res));

app.post('/api/Combination/updateCombination', upload.none(), (req, res) => combinationController.updateCombination(req, res));

app.get('/api/Combination/getListCombination', upload.none(), (req, res) => combinationController.getListAll(req, res));

app.delete('/api/Combination/removeCombinationByProductID', upload.none(), (req, res) => combinationController.removeCombinationByProductID(req, res));

app.delete('/api/Combination/removeCombinationByVariantID', upload.none(), (req, res) => combinationController.removeCombinationByVariantID(req, res));

app.delete('/api/Combination/removeCombinationByID', upload.none(), (req, res) => combinationController.removeCombinationByCombinationID(req, res));


// CombinationValue routes
const CombinationValueController = require('./controller/combinationValueController');
const combinationValueController = new CombinationValueController(combinationValueDataFile, combinationDataFile, variantDataFile, productDataFile, secretKey);

app.post('/api/CombinationValue/addCombinationValue', upload.none(), (req, res) => combinationValueController.addCombinationValue(req, res));

app.post('/api/CombinationValue/updateCombinationValue', upload.none(), (req, res) => combinationValueController.updateCombinationValue(req, res));

app.delete('/api/CombinationValue/removeCombinationValue', upload.none(), (req, res) => combinationValueController.removeCombinationValueByID(req, res));

app.get('/api/CombinationValue/getListCombinationValue', upload.none(), (req, res) => combinationValueController.getListAll(req, res));


// Cart routes
const CartController = require('./controller/cartController');
const cartController = new CartController(cartDataFile, secretKey);

app.post('/api/Cart/addCart', upload.none(), (req, res) => cartController.addCart(req, res));

app.get('/api/Cart/getListCartByBillID', upload.none(), (req, res) => cartController.getListByBillID(req, res))

app.delete('/api/Cart/removeCart', upload.none(), (req, res) => cartController.removeCartByID(req, res))

// Cart Variant routes
const CartVariantController = require('./controller/cartVariantController');
const cartVariantController = new CartVariantController(cartVariantDataFile, secretKey);

app.post('/api/CartVariant/addCartVariant', upload.none(), (req, res) => cartVariantController.addCartVariant(req, res));

app.get('/api/CartVariant/getListCartVariantByCartID', upload.none(), (req, res) => cartVariantController.getCartVariantByCartID(req, res));

app.delete('/api/CartVariant/removeCartVariant', upload.none(), (req, res) => cartVariantController.removeCartVariant(req, res));


// Bill routes
const BillController = require('./controller/billController');
const billController = new BillController(billDataFile, secretKey);

app.post('/api/Bill/addBill', upload.none(), (req, res) => billController.addBill(req, res));

app.get('/api/Bill/getBillByUserID', upload.none(), (req, res) => billController.getBillByUserID(req, res));

app.get('/api/Bill/getAllBill', upload.none(), (req, res) => billController.getListAll(req, res));

app.delete('/api/Bill/removeBillByID', upload.none(), (req, res) => billController.removeBillByID(req, res));


// BillDetail routes
const BillDetailController = require('./controller/billDetailController');
const billDetailController = new BillDetailController(billDetailDataFile, secretKey);

app.post('/api/BillDetail/addBillDetail', upload.none(), (req, res) => billDetailController.addBillDetail(req, res));

app.get('/api/BillDetail/getListBillDetailByBillID', upload.none(), (req, res) => billDetailController.getBillDetailByBillID(req,res));

