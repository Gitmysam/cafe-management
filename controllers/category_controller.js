const categoryModel = require("../model/category");
const idNameService = require("../services/id-service");
const mongoose = require("mongoose");

module.exports.createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      throw new Error("Name must need for category!");
    }

    const id = await idNameService.idService(req.body.name);
    const data = await categoryModel.create({
      id,
      name: req.body.name,
    });
    return res.status(200).json({
      msg: "Category successfully created",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const data = await categoryModel.find({});
    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const data = await categoryModel.findByIdAndDelete(req.params.id);
    if (!data) {
      throw new Error("Category is not present!");
    }
    return res.status(200).json({
      msg: "Category delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    //check if id is valid
    if (!(await mongoose.isValidObjectId(req.params.id))) {
      throw new Error("Invalid Category id!");
    }

    const data = await categoryModel.findById(req.params.id);
    if (!data) {
      throw new Error("category is not present!");
    }
    const updateObj = {};
    if (req.body.name) {
      updateObj.name = req.body.name;
    }
    const update = await categoryModel.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    return res.status(200).json({
      data: update,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error,
    });
  }
};
