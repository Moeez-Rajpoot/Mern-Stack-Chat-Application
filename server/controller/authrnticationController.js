const asynchandler = require("express-async-handler");
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');




const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'agnes23@ethereal.email',
      pass: 'vhtys3fmSMv69SYhXM'
  }
});


const sendVerificationEmail = async (email, verificationLink) => {
  const templatePath = path.join(__dirname, '../template/emailtemplate.html');
  let emailTemplate = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders with actual values
  emailTemplate = emailTemplate.replace('{{verificationLink}}', verificationLink);

  await transporter.sendMail({
    to: email,
    subject: 'Email Verification',
    html: emailTemplate,
  });
};


const VerifyUser = asynchandler(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired verification token." });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.redirect("http://localhost:5173/login");
  // res.redirect("http://localhost:5173/login"); for react project

});



const RegisterUser = asynchandler(async (req, res) => {
  console.log("User Register");
  console.log("Request Body:", req.body);

  try {
    let { Username, Email, Password, Phone, Cnic, Dob, Gender } = req.body;
    console.log("Parsed Body:", { Username, Email, Password, Phone, Cnic, Dob, Gender});

    if (!Username || !Email || !Password || !Phone || !Cnic || !Dob || !Gender) {
      console.error("Missing fields:", { Username, Email, Password, Phone, Cnic, Dob, Gender });
      return res.status(400).json({ message: "Please provide all the fields" });
    }

    const AvatarImage = `https://avatar.iran.liara.run/public/boy?username=${Username}`;

    const userexists = await User.findOne({ Email });
    if (userexists) {
      console.error("User already exists with email:", Email);
      return res.status(400).json({ message: "Account Already Exists Please Login" });
    }

    const userexists2 = await User.findOne({ Username });
    if (userexists2) {
      console.error("User already exists with username:", Username);
      return res.status(400).json({ message: "Username Already Exists Please Login" });
    }

    const hashpassword = await bcrypt.hash(Password, 10);
    console.log("Password hashed successfully");

    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Verification token generated:", verificationToken);

    const user = await User.create({
      Username,
      Email: Email.toLowerCase(),
      Password: hashpassword,
      Phone,
      Cnic,
      Dob,
      Gender,
      Image:AvatarImage ,
      verificationToken,
    });

    console.log("User created successfully:", user);

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(Email, verificationLink);
    console.log("Verification email sent to:", Email);

    if (user) {
      res.status(201).json({ message: "User Created Successfully" });
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "User Not Registered Internal Server Error" });
  }
});

// Login User
// api/user/login
// Public
const LoginUser = asynchandler(async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const UserExists = await bcrypt.compare(Password, user.Password);
    if (!UserExists) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email address before logging in." });
    }

    
    const token = jwt.sign(
      {
        id: user._id,
        Email: user.Email,
        iat: Math.floor(Date.now() / 1000),
        Image: user.Image,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
 
    res.status(200).json({ accesstoken: token , 
      id: user._id,
      Image: user.Image,
     });
  } catch (error) {
  
    res
      .status(500)
      .json({ message: "User Not Logged In Internal Server Error" });
  }
});

// Login User
// api/user/current
// Public
const CurrentUser = asynchandler(async (req, res) => {
  try {
   
    const userId = req.user.id;
    const user = await User.findById(userId);

    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return the user data in the response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Login User
// api/user/Getallusers
// Public
const GetAllUsers = asynchandler(async (req, res) => {
  const id = req.user.id;
  try {
    const users = await User.find({ _id: { $ne: id } }).select("-Password");
    if (!users) {
      return res.status(404).json({ message: "No Users Found" });
      
    }
   

    res.json(users);
  } catch (error) {

    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update User
// api/user/updateuser
// Public
const UpdateUser = asynchandler(async (req, res) => {
  try {
    const { id, username, email, phone, cnic, dateOfBirth, gender } = req.body;

    if (!id || !username || !email || !phone || !cnic || !dateOfBirth || !gender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        Username: username,
        Email: email,
        Phone: phone,
        Cnic: cnic,
        Dob: dateOfBirth,
        Gender: gender,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
   
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const sendResetPasswordEmail = async (email, resetLink) => {
  const templatePath = path.join(__dirname, '../template/resetemail.html');
  let emailTemplate = fs.readFileSync(templatePath, 'utf8');

  emailTemplate = emailTemplate.replace('{{resetLink}}', resetLink);

  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    html: emailTemplate,
  });
};


const ResetPassword = asynchandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ Email: email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("The reset Token Generated is : ", resetToken);
  user.resetToken = resetToken;
  await user.save();

  const resetLink = `${process.env.BASE_URL}/api/auth/verify-reset-password?token=${resetToken}`;
  await sendResetPasswordEmail(email, resetLink);

  res.status(200).json({ message: "Password reset link sent to your email." });
});


const VerifyResetPassword = asynchandler(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ resetToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token." });
  }

  const templatePath = path.join(__dirname, '../template/changePasswordTemplate.html');
  let changePasswordTemplate = fs.readFileSync(templatePath, 'utf8');

  changePasswordTemplate = changePasswordTemplate.replace('{{resetToken}}', token);

  res.status(200).send(changePasswordTemplate);
});


const UpdatePassword = asynchandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  console.log("The token is : ", token);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const user = await User.findOne({ resetToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token." });
  }

  user.Password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  await user.save();

  res.redirect("http://localhost:5173");
  // res.redirect("http://localhost:3000/login");
});


const DeleteUser = asynchandler(async (req, res) => {
  try {
    
    const { id } = req.body;
    

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
     
      return res.status(404).json({ message: 'User not found' });
    }
 
   
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
   
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = {
  RegisterUser,
  LoginUser,
  CurrentUser,
  GetAllUsers,
  UpdateUser,
  VerifyUser,
  ResetPassword,
  VerifyResetPassword,
  UpdatePassword,
  DeleteUser,
};
