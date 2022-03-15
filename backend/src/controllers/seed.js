const express = require("express");

const router = express.Router();
const User = require("../models/User"); // import relevant model from models

router.post("/admin", async (req, res) => {
  try {
    const allUsers = [
      "chirath.ange@gmail.com",
      "nadika.s.bandara@gmail.com",
      "dinanjaleena@gmail.com",
      "madusankasampath2@gmail.com",
      "charukatharindhu@gmail.com",
      "lhrsupun@gmail.com",
      "h.githmin@gmail.com",
      "pathumsimpson@gmail.com",
      "madusankan909@gmail.com",
    ];

    for (const email of allUsers) {
      const existsUser = await User.findOne({ email });
      if (existsUser) {
        continue;
      }

      const NewUser = new User({
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        password:
          "$2a$10$l0rofJeJ93lEWVDFGijnVOyndYrFP9N/6wSg/TgW1krxiAQtLqD2e",
        role: "admin",
        email,
      });
      await NewUser.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get("/admin", async (req, res) => {
  try {
    const allUsers = [
      {
        username: "lwl@gmail.com",
        firstName: "LWL",
        lastName: "Company",
        role: "franchisor",
      },
      {
        username: "lwl.franchisee@gmail.com",
        firstName: "LWL",
        lastName: "Company",
        role: "franchisee",
      },

      {
        username: "chirath.ange@gmail.com",
        firstName: "Chirath",
        lastName: "Ange",
        role: "franchisor",
      },
      {
        username: "chirath.ange.franchisee@gmail.com",
        firstName: "Chirath",
        lastName: "Ange",
        role: "franchisee",
      },

      {
        username: "nadika.s.bandara@gmail.com",
        firstName: "Nadika",
        lastName: "Bandara",
        role: "franchisor",
      },
      {
        username: "nadika.s.bandara.franchisee@gmail.com",
        firstName: "Nadika",
        lastName: "Bandara",
        role: "franchisee",
      },

      {
        username: "developers@eis.com",
        firstName: "EIS",
        lastName: "DEV",
        role: "franchisor",
      },
      {
        username: "developers.franchisee@eis.com",
        firstName: "EIS",
        lastName: "DEV",
        role: "franchisee",
      },
    ];

    for (const user of allUsers) {
      const existsUser = await User.findOne({ email: user.username });
      if (existsUser) {
        continue;
      }

      const NewUser = new User({
        title: "Mr",
        firstName: user.firstName,
        lastName: user.lastName,
        password:
          "$2a$10$l0rofJeJ93lEWVDFGijnVOyndYrFP9N/6wSg/TgW1krxiAQtLqD2e",
        role: user.role,
        email: user.username,
      });
      await NewUser.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
