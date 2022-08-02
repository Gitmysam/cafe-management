const productModel = require("../model/product");
const categoryModel = require("../model/category");
const idNameService = require("../services/id-service");
const mongoose = require("mongoose");

module.exports.createProducts = async (req, res) => {
  try {
    if (!req.body.name) {
      throw new Error("Name must present in product!");
    }
    const id = await idNameService.idService(req.body.name);
    if (req.body.categoryId) {
      if (!(await mongoose.isValidObjectId(req.body.categoryId))) {
        throw new Error("Invalid Category id!");
      }
      const categoryData = await categoryModel.findById(req.body.categoryId);
      if (!categoryData) {
        throw new Error("category is not present!");
      }
    }

    if (!req.body.price && !req.body.status) {
      throw new Error("Price and status must present in product!");
    }

    const data = await productModel.create({
      id: id,
      name: req.body.name,
      categoryId: req.body.categoryId,
      price: req.body.price,
      description: req.body.description,
      status: req.body.status,
    });
    return res.status(200).json({
      msg: "Product created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    const data = await productModel.find({});
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    if (!(await mongoose.isValidObjectId(req.params.id))) {
      throw new Error("Invalid Product id!");
    }

    const data = await productModel.findByIdAndDelete(req.params.id);
    if (!data) {
      throw new Error("Product is not exists!");
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
