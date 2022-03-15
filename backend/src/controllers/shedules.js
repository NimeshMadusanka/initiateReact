const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
const User = require("../models/User"); // import relevant model from models
const TimeSlots = require("../models/TimeSlots");
const ScheduleMaster = require("../models/ScheduleMaster");
const checkAuth = require("../middleware/auth");
const { validateInput } = require("../utils/common-functions");
const {
  scheduleCreateValidation,
  timeSlotCreateValidation,
  scheduleUpdateValidation,
} = require("../validations/SchedulesValidations");

// @route   POST api/schedules
// @desc    Create a schedule
// @access  Private
router.post("/", checkAuth, async (req, res) => {
  try {
    const checkValidation = validateInput(scheduleCreateValidation, req.body);
    if (!checkValidation.value) {
      return res.sendStatus(400);
    }
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }

    const {
      zone,
      startDate,
      endDate,
      timeSlots,
      unattendedLimit,
      isPublished,
    } = checkValidation.value;

    // timeslots array check
    for (const timeslot of timeSlots) {
      const slot = await TimeSlots.findById(timeslot.id);
      if (!slot) {
        return res.sendStatus(400);
      }
    }
    // date range
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate ? endDate : startDate);

    if (startDateObj > endDateObj) {
      return res.sendStatus(400);
    }

    // check dates and zone exists
    const scheduleExists = await ScheduleMaster.find({
      $and: [
        {
          date: {
            $gte: startDateObj,
            $lte: endDate ? endDateObj : startDateObj,
          },
        },
        { zone: checkValidation.value.zone },
        { franchisee: req.user.userId },
      ],
    });
    if (scheduleExists.length > 0) {
      return res.status(401).json({
        message: `schedule overlap from ${startDate} to ${
          endDate ? endDate : startDate
        }`,
      });
    }
    // date range to a array
    const dateRange = [];
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      dateRange.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }

    for (const day of dateRange) {
      const newSchedule = new ScheduleMaster({
        franchiseeID: franchisee.id,
        zone,
        startDate,
        date: day,
        endDate,
        timeSlots: timeSlots.map((e) => {
          return { _id: ObjectId(e.id), limit: e.limit };
        }),
        unattendedLimit,
        isPublished,
      });
      newSchedule.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route GET api/schedules
// @desc get all schedules
// @access Private
router.get("/", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const schedules = await ScheduleMaster.find({
      franchiseeID: franchisee.id,
    }).populate("timeSlots");
    return res.json(schedules);
  } catch (error) {
    return res.sendStatus(500);
  }
});
// @route GET api/schedules
// @desc get all schedules
// @access Private
router.get("/available", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const schedulesByDate = await ScheduleMaster.aggregate([
      {
        $match: {
          franchiseeID: franchisee.id,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json(schedules);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route   GET api/schedules/timeslot
// @desc    Get all timeslots
// @access Private
router.get("/timeslot", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const timeSlot = await TimeSlots.find({ franchiseeID: franchisee.id })
      .populate("zone")
      .select({
        id: 1,
        limit: 1,
        startTime: 1,
        endTime: 1,
        zoneName: 1,
        isPublished: 1,
      });
    return res.json(timeSlot);
  } catch (err) {
    return res.sendStatus(500);
  }
});

// @route GET api/schedules/:date
// @desc get all by date schedules
// @access Private
router.get("/:date", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const schedules = await ScheduleMaster.find({
      franchiseeID: franchisee.id,
      date: req.params.date,
    })
      .populate({
        path: "timeSlots._id",
        model: "TimeSlots",
        select: "timeSlots startTime endTime zoneName zone",
      })
      .populate({
        path: "zone",
        model: "Zones",
        select: "zoneName",
      });

    const result = schedules.map((e) => {
      return {
        id: e._id,
        zoneName: e.zone.zoneName,
        zone: e.zone._id,
        startDate: e.startDate,
        date: e.date,
        endDate: e.endDate,
        timeSlotsNew: e.timeSlots.map((e) => {
          return { timeSlots: e._id.timeSlots };
        }),
        limit: e.timeSlots.map((e) => {
          return { limit: e.limit };
        }),
        unattendedLimit: e.unattendedLimit,
        isPublished: e.isPublished,
      };
    });

    return res.json(result);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route GET api/schedules/:id
// @desc get schedule by id
// @access Private
router.get("/edit/:id", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    if (!ObjectId.isValid(req.params.id)) {
      return res.sendStatus(400);
    }
    const schedule = await ScheduleMaster.findById(req.params.id)
      .populate({
        path: "timeSlots._id",
        model: "TimeSlots",
        select: "timeSlots startTime endTime zoneName zone",
      })
      .populate({
        path: "zone",
        model: "Zones",
        select: "zoneName",
      });

    const result = schedule.timeSlots.map((e) => {
      return {
        timeSlot: `${e._id.timeSlots} (${schedule.zone.zoneName})`,
        limit: e.limit,
        id: e._id.id,
      };
    });
    return res.json(result);
  } catch (error) {
    return res.sendStatus(500);
  }
});

// @route   POST api/schedules/timeslot
// @desc    Create a timeslot
// @access  Private
router.post("/timeslot", checkAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const checkValidation = validateInput(timeSlotCreateValidation, req.body);
    if (!checkValidation.value) {
      return res.sendStatus(400);
    }
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    // Start session
    session.startTransaction();

    const { zone, limit, startTime, endTime, isPublished } =
      checkValidation.value;

    const convertToInt = (time) => {
      const [hour, minutes] = time.split(":");
      const newInt = parseInt(hour.concat(hour, minutes));
      return newInt;
    };
    // convert to 24 hour format
    const startTime24 = convertToInt(startTime);
    const endTime24 = convertToInt(endTime);

    // check time slots exist
    const timeSlotExists = await TimeSlots.find({
      zone: zone,
    }).select({
      id: 1,
      startTime: 1,
      endTime: 1,
    });

    if (timeSlotExists) {
      for (const e of timeSlotExists) {
        const stTime = convertToInt(e.startTime);
        const enTime = convertToInt(e.endTime);
        if (
          (stTime >= startTime24 && stTime <= endTime24) ||
          (enTime >= startTime24 && enTime <= endTime24)
        ) {
          return res.status(401).json({
            message: "Time slot already exists",
          });
        }
      }
    }

    // Create new TimeSlot
    const timeSlot = new TimeSlots({
      franchiseeID: franchisee.id,
      zone,
      limit,
      startTime,
      endTime,
      isPublished,
    });
    await timeSlot.save({ session });
    // end session
    // finish transcation
    await session.commitTransaction();
    session.endSession();
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return res.sendStatus(500);
  }
});

// @route GET api/schedules/timeslot/:zoneId
// @desc Get all timeslots by zone
// @access Private
router.get("/timeslots/:zoneId", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const timeSlot = await TimeSlots.find({
      zone: req.params.zoneId,
      franchiseeID: franchisee.id,
      isPublished: true,
    })
      .populate("zone")
      .select({
        id: 1,
        limit: 1,
        timeSlots: 1,
        startTime: 1,
        endTime: 1,
        zoneName: 1,
      });
    return res.json(timeSlot);
  } catch (err) {
    return res.sendStatus(500);
  }
});

// @route PUT api/shedules/:id
// @desc update shedule
// @access private
router.put("/:id", checkAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const checkValidation = validateInput(scheduleUpdateValidation, req.body);
    if (!checkValidation.value) {
      return res.sendStatus(400);
    }
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const { timeSlots, unattendedLimit, isPublished } = checkValidation.value;
    session.startTransaction();
    const schedule = await ScheduleMaster.findById(req.params.id).session(
      session
    );
    if (!schedule) {
      session.abortTransaction();
      return res.sendStatus(404);
    }
    const convertToInt = (time) => {
      const [hour, minutes] = time.split(":");
      const newInt = parseInt(hour.concat(hour, minutes));
      return newInt;
    };

    const updateSchedule = {
      timeSlots: timeSlots.map((e) => {
        return { _id: ObjectId(e.id), limit: e.limit };
      }),
      unattendedLimit,
      isPublished,
    };

    await ScheduleMaster.findByIdAndUpdate(schedule.id, {
      $set: {
        unattendedLimit: updateSchedule.unattendedLimit,
        isPublished: updateSchedule.isPublished,
      },
    }).session(session);
    for (const e of updateSchedule.timeSlots) {
      await ScheduleMaster.findByIdAndUpdate(
        schedule.id,
        {
          $set: {
            "timeSlots.$[elem].limit": e.limit,
          },
        },
        {
          arrayFilters: [{ "elem._id": e._id }],
        }
      ).session(session);
    }
    await session.commitTransaction();
    session.endSession();
    return res.sendStatus(200);
  } catch (err) {
    session.endSession();
    return res.sendStatus(500);
  }
});

// @route PUT api/shedules/timeslot/:id
// @desc update timeslot
// @access private
router.put("/timeslot/:id", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const timeSlot = await TimeSlots.find({
      zone: req.params.id,
      franchiseeID: franchisee.id,
    });

    if (!timeSlot) {
      return res.sendStatus(404);
    }
    const { zone, limit, startTime, endTime, isPublished } = req.body;
    const updateTimeSlot = {
      zone,
      limit,
      startTime,
      endTime,
      isPublished,
    };
    // HH:MM format
    const convertToInt = (time) => {
      const [hour, minutes] = time.split(":");
      const newInt = parseInt(hour.concat(hour, minutes));
      return newInt;
    };

    // convert to 24 hour format
    const startTime24 = convertToInt(startTime);
    const endTime24 = convertToInt(endTime);

    // check time slots exist
    const timeSlotExists = await TimeSlots.find({
      zone: zone,
      franchiseeID: { $ne: franchisee.id },
    }).select({
      id: 1,
      startTime: 1,
      endTime: 1,
    });

    if (timeSlotExists) {
      for (const e of timeSlotExists) {
        const stTime = convertToInt(e.startTime);
        const enTime = convertToInt(e.endTime);
        if (
          (stTime >= startTime24 && stTime <= endTime24) ||
          (enTime >= startTime24 && enTime <= endTime24)
        ) {
          return res.status(401).json({
            message: "Time slot already exists",
          });
        }
      }
    }

    await TimeSlots.findByIdAndUpdate(req.params.id, updateTimeSlot);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

// @route DELETE api/shedules/timeslot/:id
// @desc delete timeslot
// @access private

router.delete("/timeslot/:id", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const timeSlot = await TimeSlots.findById(req.params.id);
    if (!timeSlot) {
      return res.sendStatus(404);
    }
    await TimeSlots.findByIdAndDelete(timeSlot.id);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

// @route DELETE api/shedules/:id
// @desc delete shedule
// @access private

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.user.userId);
    if (!["franchisee"].includes(franchisee.role)) {
      return res.sendStatus(401);
    }
    const shedule = await ScheduleMaster.findById(req.params.id);
    if (!shedule) {
      return res.sendStatus(404);
    }
    await ScheduleMaster.findByIdAndDelete(shedule.id);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
