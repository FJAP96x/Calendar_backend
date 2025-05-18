const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name")//.populate("user", "email");

  res.json({
    ok: true,
    events,
  });
}
const createEvent = async (req, res = response) => {

  console.log(req.body);

  const event = new Event(req.body);
  try {
    event.user = req.uid
    const savedEvent = await event.save();
    res.status(201).json({
      ok: true,
      event: savedEvent
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error creating event"
    });
  }

  // delete after
  res.json({
    ok: true,
    msg: "Event created successfully",
  });
}
const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event not found"
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You are not authorized to update this event"
      });
    }
    const newEvent = {
      ...req.body,
      user: uid
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
    res.json({
      ok: true,
      event: updatedEvent
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error updating event"
    });

  }


}
const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event not found"
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You are not authorized to delete this event"
      });
    }

    await Event.findByIdAndDelete(eventId);
    res.json({
      ok: true,
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Deleting event"
    });

  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}