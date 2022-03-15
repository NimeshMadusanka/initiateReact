const express = require('express');
const Zones = require('../models/Zones');
const ScheduleMaster = require('../models/ScheduleMaster');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const router = express.Router();
const checkAuth = require('../middleware/auth');
const { validateInput } = require('../utils/common-functions');
const {
  scheduleLimitUpdateValidation,
} = require('../validations/SchedulesValidations');

// @route   put api/datepicker/:id
// @desc    update schedule limits
// @access  Private
router.put(
  '/:id',
  /*checkAuth,*/ async (req, res) => {
    const session = await mongoose.startSession();
    try {
      const checkValidation = validateInput(
        scheduleLimitUpdateValidation,
        req.body
      );
      if (!checkValidation.value) {
        return res.sendStatus(400);
      }
      const { timeSlots, unattendedCount } = checkValidation.value;
      session.startTransaction();
      const schedule = await ScheduleMaster.findById(req.params.id).session(
        session
      );
      if (!schedule) {
        session.abortTransaction();
        return res.status(400).send('Schedule not found');
      }
      // unatteneded count
      if (unattendedCount) {
        if (
          schedule.unattendedLimit <
          schedule.unattendedCount + unattendedCount
        ) {
          session.abortTransaction();
          return res.status(400).send('Unattended limit exceeded');
        }
      }
      //  // check if schedule is already filled
      if (timeSlots) {
        for (let i = 0; i < timeSlots.length; i++) {
          const { id, count } = timeSlots[i];
          const timeSlot = schedule.timeSlots.find(
            (ts) => ts._id.toString() === id.toString()
          );
          if (!timeSlot) {
            session.abortTransaction();
            return res.status(400).send('Time slot not found');
          } else if (timeSlot.limit < timeSlot.count + count) {
            session.abortTransaction();
            return res.status(400).send('Time slot limit exceeded');
          }
        }
      }
      const timeSlotId = ObjectId(timeSlots[0].id);
      // update schedule
      await ScheduleMaster.findByIdAndUpdate(
        schedule.id,
        {
          $inc: {
            'timeSlots.$[val].count': 1,
            unattendedCount: unattendedCount ? unattendedCount : 0,
          },
        },
        {
          arrayFilters: [
            {
              'val._id': timeSlotId,
            },
          ],
        }
      ).session(session);

      await session.commitTransaction();
      session.endSession();
      return res.sendStatus(200);
    } catch (err) {
      session.endSession();
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/datepicker
// @desc    get order deliver dates
// @access  Private
router.get(
  '/:zip',
  /*checkAuth, */ async (req, res) => {
    try {
      const { zip } = req.params;
      const today = new Date();
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      // const dateType = "en-US";
      // get zone
      const zone = await Zones.findOne({ zipCodes: zip });
      if (!zone) {
        return res.status(400).json({ msg: 'Zone not found' });
      }
      // get time schedules
      const schedules = await ScheduleMaster.find({
        zone: zone._id,
        isPublished: true,
        date: { $gte: day },
        $expr: {
          $lt: ['$unattendedCount', '$unattendedLimit'],
          $lt: ['$timeSlots.count', '$timeSlots.limit'],
        },
      })
        .populate({
          path: 'timeSlots._id',
          model: 'TimeSlots',
          select: 'timeSlots startTime endTime zoneName zone',
        })
        .populate({
          path: 'zone',
          model: 'Zones',
          select: 'zoneName',
        })
        .sort({ date: 1 });
      if (!schedules) {
        return res.status(400).json({ msg: 'Time schedules not found' });
      }
      // get all available dates and time slots
      const availableDates = [];
      const endDate = new Date(
        Math.max.apply(
          null,
          schedules.map((s) => s.date)
        )
      );

      // date range to a array
      const dateRange = [];
      for (let dt = today; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        dateRange.push(dt);
      }
      dateRange.push(endDate);

      // remove dates that are not available
      const days = schedules.map((s) => s.date);
      const disabledDates = dateRange.filter((el) => days.indexOf(el) < 0);

      for (const schedule of schedules) {
        availableDates.push({
          id: schedule._id,
          date: new Date(
            schedule.date.getFullYear(),
            schedule.date.getMonth(),
            schedule.date.getDate(),
            0,
            0,
            0,
            0
          ),
          unattendedLimit: schedule.unattendedLimit,
          unattendedCount: schedule.unattendedCount,
          availableTimes: schedule.timeSlots.map((timeSlot) => {
            return {
              id: timeSlot._id._id,
              timeSlot: timeSlot._id.timeSlots,
              limit: timeSlot.limit,
              count: timeSlot.count,
            };
          }),
        });
      }
      res.status(200).json({
        today: day,
        endDate: new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          0,
          0,
          0,
          0
        ),
        dateRange,
        disabledDates,
        availableDates,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
