require('dotenv').config();
const User = require("../models/User");
const Course = require("../models/Course");
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

const getAllUsers = (req, res) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const signupUser = async (req, res) => {
  const { name, email, password, tel, userType, studentId, instructorId, courseCodes, department } = req.body;

  try {
    const user = await User.signup(name, email, password, tel, userType, studentId, instructorId, courseCodes, department);

    // Populate courses based on course codes
    const courses = await Course.find({ code: { $in: user.courseCodes } });

    // Create a token
    const token = createToken(user._id);
    res.status(200).json({ user: { ...user._doc, courses }, token, message: "Sign Up Successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const loginUser = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    // Populate courses based on course codes
    const courses = await Course.find({ code: { $in: user.courseCodes } });

    // Create a token
    const token = createToken(user._id);
    console.log(user)
    res.status(200).json({ user: { ...user._doc, courses }, token });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
}

const updateProfile = async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw Error('User not found');
    }

    // If course codes are being updated, validate them
    if (updates.courseCodes) {
      for (let code of updates.courseCodes) {
        const course = await Course.findOne({ code });
        if (!course) throw Error(`Course with code ${code} does not exist`);
      }
    }

    Object.assign(user, updates);
    await user.save();

    // Populate courses based on course codes
    const courses = await Course.find({ code: { $in: user.courseCodes } });

    res.status(200).json({ message: 'Profile updated successfully', user: { ...user._doc, courses } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getAllUsers, loginUser, signupUser, updateProfile };
