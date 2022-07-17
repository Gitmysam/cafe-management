const mongoose = require("mongoose");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const uuid = require("uuid");
const billModel = require("../model/bill");
const idNameService = require("../services/id-service");

module.exports.generateReport = async (req, res) => {
  try {
    const generateUuid = uuid.v1();
    var productDetailsReport = JSON.parse(req.body.productDetails);
    if (!req.body.name) {
      throw new Error("Name must need for category!");
    }
    const id = await idNameService.idService(req.body.name);
    if (!["online", "ofline"].includes(req.body.paymentMethod)) {
      throw new Error("Payment method must be online or ofline!");
    }
    const data = await billModel.create({
      id: id,
      name: req.body.name,
      uuid: generateUuid,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      paymentMethod: req.body.paymentMethod,
      productDetails: req.body.productDetails,
      total: req.body.total,
      // createdBy: req.locals.email,
      // updatedBy: req.locals.email,
    });
    if (data) {
      ejs.renderFile(
        path.join(__dirname, "", "report.ejs"),
        {
          productDetails: productDetailsReport,
          name: req.body.name,
          email: req.body.email,
          paymentMethod: req.body.paymentMethod,
          total: req.body.total,
          contactNumber: req.body.contactNumber,
          total: req.body.total,
        },
        (err, str) => {
          if (err) {
            console.log(err);
          } else {
            pdf
              .create(str)
              .toFile(
                "./generated_pdf/" + generateUuid + ".pdf",
                (err, data) => {
                  if (err) {
                    throw new Error("There is a error!");
                  }
                }
              );
          }
        }
      );
    }
    return res.status(200).json({
      msg: "Report created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};
