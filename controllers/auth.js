//const express = require('express'); opcion 1 
const { response } = require('express'); // opcion 2
const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "user already exists with this email"
      })
    }

    user = new User(req.body);
    //encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    //generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "please contact the administrator",
    })
  }


}
const loginUser = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "user not exist with this email"
      })
    }
    //confirm password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "password not valid"
      })
    }
    //generate token
    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "please contact the administrator",
    })
  }

}

const renewToken = (req, res) => {

  res.json({
    ok: true,
    msg: "renewToken"
  })
}

module.exports = {
  createUser,
  loginUser,
  renewToken
}