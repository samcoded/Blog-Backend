const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
require("dotenv").config();

const jwtsecret = process.env.JWTSECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  //validate
  const loginschema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await loginschema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) return res.status(400).send("This user doesnt exist");
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      jwtsecret,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const regschema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await regschema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) return res.status(400).send("This user already exists");
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModel.create({
      email,
      password: hashedPassword,
      name: name,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, jwtsecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

module.exports = { login, register };
