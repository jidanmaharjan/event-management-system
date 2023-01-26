const Auth = require("../models/authModel");
const Otp = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

exports.registerUser = async (req, res, next) => {
  const { email, password, cpassword } = req.body;
  if (password !== cpassword) {
    res.status(403).json({
      success: false,
      message: "Passwords do not match",
    });
    return;
  }
  const isRegistered = await Auth.findOne({ email: email });
  if (isRegistered) {
    res.status(403).json({
      success: false,
      message: "User already registered",
    });
    return;
  }
  try {
    const salt = await bcrypt.genSalt();
    const hasedpassword = await bcrypt.hash(password, salt);
    const result = await Auth.create({
      email: email,
      password: hasedpassword,
    });
    const acctoken = jwt.sign(
      { email: result.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const secToken = jwt.sign(
      { email: result.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    );
    res.status(200).json({
      success: true,
      accessT: acctoken,
      refreshT: secToken,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Auth.findOne({ email: email });
    const isRegistered = await bcrypt.compare(password, user.password);
    if (!isRegistered) {
      res.status(403).json({
        success: false,
        message: "email or password incorrect",
      });
    } else {
      const token = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
      );
      const secToken = jwt.sign(
        { email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
      );
      res.status(200).json({
        success: true,
        message: "Login successful",
        accessT: token,
        refreshT: secToken,
      });
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const isRegistered = await Auth.findOne({ email });
    if (isRegistered && isRegistered.verified === false) {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      //Mail details or header
      const details = {
        from: "Eve. 📧noreply@eve.com",
        to: email,
        subject: "User Verification",
        text: `Code: ${otp}`,
        html: `<img style="width: 150px" src='https://cdn-icons-png.flaticon.com/512/5743/5743145.png' /><br/><p>Enter code <strong>${otp}</strong> to verify at Eve. <br/>This code will expire in 2 minutes. </p>`,
      };
      //Hash otp and save to db
      const salt = await bcrypt.genSalt();
      const hashedotp = await bcrypt.hash(otp, salt);
      await Otp.create({
        email: email,
        otp: hashedotp,
      });
      //Send mail to user
      await mailTransporter.sendMail(details, (err) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Verification Code has been sent to your email",
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User doesnot exist or is verified",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    } else {
      const foundOtp = await Otp.find({ email });
      if (foundOtp.length < 1) {
        res.status(400).json({
          success: false,
          message: "OTP has expired",
        });
      } else {
        const hashedOtp = foundOtp[foundOtp.length - 1].otp;
        const isValid = await bcrypt.compare(String(otp), hashedOtp);
        if (!isValid) {
          res.status(400).json({
            success: false,
            message: "Invalid otp entered. Check your inbox and try again",
          });
        } else {
          const user = await Auth.findOne({ email });
          user.verified = true;
          await user.save();
          await Otp.deleteMany({ email });
          res.status(200).json({
            success: true,
            message: "User verified successfully",
          });
        }
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.refreshToken = async (req, res) => {
  const refToken = req.body.token;
  if (!refToken) {
    return res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
  try {
    jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Please login again",
        });
      } else {
        const token = jwt.sign(
          { email: payload.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
        );
        res.status(200).json({
          success: true,
          token: token,
        });
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};

exports.sendResetPassword = async (req, res) => {
  const userEmail = req.body.email;
  try {
    const isRegistered = await Auth.findOne({ email: userEmail });
    if (!isRegistered) {
      res.status(404).json({
        success: false,
        message: "Error Fetching Data",
      });
      return;
    } else {
      const token = jwt.sign(
        { email: userEmail },
        process.env.RESET_PASSWORD_SECRET,
        { expiresIn: "1h" }
      );
      //Mail details or header
      const details = {
        from: "Eve. 📧noreply@eve.com",
        to: userEmail,
        subject: "Reset Password",
        text: `Link: http://localhost:3000/reset/${token}`,
        html: `<img style="width: 150px" src='https://cdn-icons-png.flaticon.com/512/5743/5743145.png' /><br/><p>Open this link to reset password for your eve account.<br /> <a href=http://localhost:3000/reset/${token}>http://localhost:3000/reset/${token}</a> <br/><br/>Please ignore this message if it does not concern you. </p>`,
      };
      //Send mail to user
      await mailTransporter.sendMail(details, (err) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Password reset Link has been sent to your email",
          });
        }
      });
    }
  } catch (error) {
    res.send(error.message);
  }
};

exports.verifyResetPassword = async (req, res) => {
  const { token, newPassword, cNewPassword } = req.body;
  try {
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_SECRET,
      async (err, payload) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "Password reset Error",
          });
        } else {
          if (newPassword.length < 6) {
            return res.status(400).json({
              success: false,
              message: "Password must be at least 6 characters",
            });
          }
          if (newPassword !== cNewPassword) {
            return res.status(400).json({
              success: false,
              message: "Passwords do not match",
            });
          }
          const userFound = await Auth.findOne({ email: payload.email });
          const salt = await bcrypt.genSalt();
          const hasedpassword = await bcrypt.hash(newPassword, salt);
          userFound.password = hasedpassword;
          await userFound.save();
          res.status(200).json({
            success: true,
            message: "Password reset successfully",
          });
        }
      }
    );
  } catch (error) {
    res.send(error.message);
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, cNewPassword } = req.body;
  if (newPassword !== cNewPassword) {
    res.status(403).json({
      success: false,
      message: "New password do not match",
    });
  } else {
    try {
      const user = req.user;
      const isSame = await bcrypt.compare(oldPassword, user.password);
      if (!isSame) {
        res.status(403).json({
          success: false,
          message: "Old password is incorrect",
        });
      } else {
        const salt = await bcrypt.genSalt();
        const hasedpassword = await bcrypt.hash(newPassword, salt);
        user.password = hasedpassword;
        await user.save();
        res.status(200).json({
          success: true,
          message: "Password changed successfully",
        });
      }
    } catch (error) {
      res.send(error.message);
    }
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.p || 1;
    const resource = 8;
    const resourceCount = await Auth.countDocuments();
    const allUsers = await Auth.find()
      .limit(resource)
      .skip(resource * (page - 1))
      .select("-password");
    res.status(200).json({
      success: true,
      count: resourceCount,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await Auth.findById(req.params.id);
    await userToDelete.remove();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
