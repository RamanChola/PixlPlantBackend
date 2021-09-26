const bcrypt = require("bcrypt");
const User = require("../models/User");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    res.status(500).json("Fetching users failed, please try again");
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res) => {
  let user;
  let userId = req.params.uid;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    res.status(500).json("Fetching user failed, please try again");
  }
  res.status(200).json(user);
};

const getuserplants = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ username: req.params.username });
  } catch (err) {
    res.status(500).json(err);
  }
  try {
    let plants = existingUser.plants;
    res.json({plants});
  } catch (error) {
    res.send("No plants found!")  
  }
};
const addplant = async (req, res) => {
  let existingUser;
  const plant = req.body.plantname;
  try {
    existingUser = await User.findOne({ username: req.body.username });
  } catch (err) {
    res.status(500).json(err);
  }
  try {
    existingUser.plants.push(plant);
    existingUser.save();
    res.json({existingUser});
  } catch (error) {
    res.send("Could not add the plant")  
  }
};

const signup = async (req, res) => {
  const { username, lastname, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json(err);
  }
  if (existingUser) {
    return res.status(422).json("User exists already, please login instead");
  }
  let EncPass;
  try {
    EncPass = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
  }
  const createdUser = new User({
    username:username.toLowerCase(),
    lastname,
    email,
    password: EncPass,
  });
  try {
    await createdUser.save();
    res.status(201).json({ user: createdUser });
  } catch (err) {
    res.status(500).json(err);
  }

};
const login = async (req, res) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ username: req.body.username });
    if (!existingUser) {
      return res.status(400).json("wrong credentials");
    }

    const validated = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!validated) {
      return res.status(400).json("wrong credentials");
    }

    res.json({ user: existingUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getuserplants = getuserplants;
exports.getUserById = getUserById;
exports.addplant = addplant;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
