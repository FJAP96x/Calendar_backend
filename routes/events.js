// event routes /api/event 

// all the routes need the jwt validation
const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate-jwt")
const { check } = require("express-validator")
const { validateFields } = require("../middlewares/validate-fields")
const { isDate } = require("../helpers/isDate")
const router = Router();

const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");

router.use(validateJWT);

// get events
router.get("/", getEvents);

router.post("/", [
  check("title", "Title is required").not().isEmpty(),
  check("start", "Start date is required").custom(isDate),
  check("end", "End date is required").custom(isDate),
  validateFields
], createEvent);
router.put("/:id",[], updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router