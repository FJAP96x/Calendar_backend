/* 
Routes of users / Auth
host + "/api/auth"

*/

//const express = require("express");
const { Router } = require("express");
const { check } = require("express-validator")
const router = Router();
const { validateFields } = require("../middlewares/validate-fields")
const { createUser, loginUser, renewToken } = require("../controllers/auth")


router.post("/new", [
  // middlewares
  // validateJWT,
  // validateFields
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "Password  must be at least 6 characters").isLength({ min: 6 }), validateFields
], createUser)
router.post("/", [
  //middlewares 
  check("email", "Email is required").isEmail(),
  check("password", "Password  must be at least 6 characters").isLength({ min: 6 }), validateFields
], loginUser)
router.get("/renew", renewToken)


module.exports = router