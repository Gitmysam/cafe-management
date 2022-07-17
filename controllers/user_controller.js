const userModel = require("../model/userTable");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

module.exports.signupUser = async (req, res) => {
  try {
    const user = req.body;
    if (!["admin", "user"].includes(user.role)) {
      throw new Error("Role must be admin or user!");
    }
    //creating id
    const userId = await md5(`${user.name}${user.email}`);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const userFind = await userModel.findOne({ email: user.email, id: userId });
    if (!userFind) {
      const createUser = await userModel.create({
        id: userId,
        name: user.name,
        email: user.email,
        status: false,
        role: user.role,
        password: hashPassword,
        contactNumber: user.contactNumber,
      });

      return res.status(200).json({
        msg: "Successfully signup",
        data: createUser,
      });
    } else {
      return res.status(200).json({
        msg: "User already exists!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: error,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const user = req.body;
    const userFind = await userModel.findOne({ email: user.email });
    if (userFind) {
      if (!(await bcrypt.compare(user.password, userFind.password))) {
        return res.status(400).json({
          msg: "Wrong password!",
        });
      } else if (userFind.status === false) {
        return res.status(400).json({
          msg: "User is not active!",
        });
      } else if (await bcrypt.compare(user.password, userFind.password)) {
        const response = { email: userFind.email, role: userFind.role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        return res.status(200).json({ token: accessToken });
      }
    } else {
      return res.status(401).json({
        msg: "User not exists!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: error,
    });
  }
};

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports.forgotPassword = async (req, res) => {
  try {
    const user = req.body;
    const userFind = await userModel.findOne({ email: user.email });
    if (userFind) {
      var mailOptions = {
        from: process.env.EMAIL,
        to: userFind.email,
        subject: "Password by cafe management system",
        html: `<p><b>Your Login datails for cafe management system</b><br>
        <b>Email:</b>${userFind.email}<br>
        <b>Password:</b>${userFind.password}<br>
        <a href="http://localhost:4200">Click here</a></p>`,
      };
      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        }
        // console.log("Email sent" + info.response);
      });
      return res.status(200).json({
        msg: "Password sent to your email.",
      });
    } else {
      return res.status(401).json({
        msg: "Entered email address is not registered!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: error,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const userFind = await userModel.find({ role: "user" });
    return res.status(200).json({
      msg: userFind,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: error,
    });
  }
};
