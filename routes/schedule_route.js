const express = require("express");
const ScheduleController = require("../controllers/schedule_controller");
const router = express.Router();

// Get method roure
router.get('/schedule_json', ScheduleController.getScheduleJSON);
router.get('/schedule_stream', ScheduleController.getScheduleStream);

module.exports = router;