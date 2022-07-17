const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_controller");
const authorization = require("../services/authorization");
const categoryController = require("../controllers/category_controller");
const productController = require("../controllers/product_controller");
const billController = require("../controllers/bill_controller");

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.post(
  "/forgot",
  authorization.authenticateToken,
  userController.forgotPassword
);
router.get("/all", authorization.authenticateToken, userController.getAllUsers);

//for category
router.post(
  "/category/create",
  authorization.authenticateToken,
  categoryController.createCategory
);

router.get(
  "/category/all",
  authorization.authenticateToken,
  categoryController.getCategory
);

router.put(
  "/category/:id",
  authorization.authenticateToken,
  categoryController.updateCategory
);
router.delete(
  "/category/:id",
  authorization.authenticateToken,
  categoryController.deleteCategory
);

//for product
router.post(
  "/product/create",
  authorization.authenticateToken,
  productController.createProducts
);

router.get(
  "/product/all",
  authorization.authenticateToken,
  productController.getProduct
);

//for report generate
router.post(
  "/generate-report",
  authorization.authenticateToken,
  billController.generateReport
);

module.exports = router;
