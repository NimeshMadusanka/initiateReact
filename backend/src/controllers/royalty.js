const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const router = express.Router();
const Royalty = require("../models/Royalty");
const Counters = require("../models/Counters");
const User = require("../models/User");
const { RoyaltySchema } = require("../validations/RoyaltyValidations");
const checkAuth = require("../middleware/auth");
const { validateInput } = require("../utils/common-functions");

// @route   POST api/royality
// @desc    Create royality
// @access  Private
router.post("/", checkAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const checkValidation = validateInput(RoyaltySchema, req.body);
    if (!checkValidation.value) {
      return res.sendStatus(400);
    }
    // Start session
    session.startTransaction();
    /*eslint-disable */
    const { scheme_Name, royalty_Percentage } = checkValidation.value;

    const counter = await Counters.find().session(session);

    const royality = new Royalty({
      schemeID: `SA00${counter[0].seq_value}`,
      scheme_Name,
      royalty_Percentage,
    });
    /* eslint-enable */
    await royality.save({ session });
    await Counters.findByIdAndUpdate(
      counter[0]._id,
      {
        $inc: {
          seq_value: 1,
        },
      },
      { new: true, session }
    );
    // end session
    // finish transcation
    await session.commitTransaction();
    session.endSession();

    return res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.sendStatus(500);
  }
});

// @route    PUT api/update-status
// @desc    Update royality Status by id
// @access  Private
router.put("/update-status", checkAuth, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.body.royaltyId)) {
      return res.status(400).json({
        message: "Invalid royaltyID id",
      });
    }
    const { royaltyId, status } = req.body;
    const franchisee = await User.findOne({
      royaltyScheme: royaltyId,
    });
    if (franchisee && !status) {
      return res.sendStatus(422);
    }
    await Royalty.findByIdAndUpdate(
      { _id: royaltyId },
      { status },
      { new: true }
    );
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

// @route   GET api/royality
// @desc    Get all royality
// @access  Private
router.get("/", checkAuth, async (req, res) => {
  try {
    const royality = await Royalty.find().populate({
      path: "franchisee_List",
    });
    const royaltyList = royality.map((royalty) => {
      /* eslint-disable */
      const {
        id,
        schemeID,
        scheme_Name,
        royalty_Percentage,
        status,
        franchisee_List,
      } = royalty;
      return {
        id,
        schemeID,
        scheme_Name,
        royalty_Percentage,
        status,
        franchisee_List: franchisee_List.map((franchisee) => {
          const { firstName } = franchisee;
          return {
            franchiseeName: firstName,
          };
        }),
      };
      /* eslint-enable */
    });
    res.status(200).json(royaltyList);
  } catch (err) {
    res.sendStatus(500);
  }
});

// @route   GET api/royality/payments
// @desc    Get all royality payments
// @access  Private
router.get("/payments", checkAuth, async (req, res) => {
  try {
    const payments = [
      {
        id: 1,
        franchisee_ID: "FID001",
        franchisee_Name: "NY",
        balance: "22500",
        paymentAndDate: "2000/=     21/12/2021 ",
        status: "Paid",
      },
      {
        id: 2,
        franchisee_ID: "FID005",
        franchisee_Name: "BOSTON",
        balance: "33000",
        paymentAndDate: "3500/=     10/1/2022 ",
        status: "Paid",
      },
    ];
    res.status(200).json(payments);
  } catch (err) {
    res.sendStatus(500);
  }
});

// @route GET api/royalty/payment-report
// @desc Get royalyty payment report
// @access Private
router.get("/payment-report", checkAuth, async (req, res) => {
  try {
    const paymentReport= [
      {
        id: 1,
        franchiseeID: "FID001",
        franchiseeName: "NY",
        balance: 22500,
        lastPayment: "12/12/2021 "
      },
      {
        id: 2,
        franchiseeID: "FID005",
        franchiseeName: "BOSTON",
        balance: 33000,
        lastPayment: "1/10/2022",
      },
    ];
    // Append Payment Age and percantage
    let totalBalance = 0;
    // eslint-disable-next-line
    paymentReport.map((payment) => {
      const { balance , lastPayment } = payment;
      totalBalance += parseInt(balance);
      const lastPaymentDateObj = new Date(lastPayment);
      const currentDate = new Date();
      const diff = currentDate.getTime() - lastPaymentDateObj.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      payment.paymentAge = days;
      return payment;
    });
    // eslint-disable-next-line
    paymentReport.map((payment) => {
      const { balance } = payment;
      payment.precentage = ((balance / totalBalance) * 100).toFixed();
      return payment;
    });
    res.status(200).json(paymentReport);

  } catch (err) {
    res.sendStatus(500);
  }
});

// @route   GET api/royality/:id
// @desc    Get royality by ID
// @access  Private
router.get("/:id", checkAuth, async (req, res) => {
  try {
    const royality = await Royalty.findById(req.params.id);
    // .populate({
    //   path: "franchisee_List",
    //   select: "name",
    // });
    res.send(200).json(royality);
  } catch (err) {
    res.sendStatus(500);
  }
});

// @route   GET api/royality/payments/:frId
// @desc    Get all royality payments by ID
// @access  Private
router.get("/payments/:frId", checkAuth, async (req, res) => {
  try {
    const paymentData = [
      {
        id: 1,
        franchisee_ID: "FID001",
        date: "21/12/2021",
        payment: "20500",
        status: "Paid",
        reference: "Credit",
        description: "",
      },
      {
        id: 2,
        franchisee_ID: "FID005",
        date: "9/1/2022",
        payment: "30000",
        status: "Paid",
        reference: "Cash",
        description: "",
      },
      {
        id: 3,
        franchisee_ID: "FID001",
        date: "21/1/2022",
        payment: "2000",
        status: "Paid",
        reference: "Credit",
        description: "",
      },
      {
        id: 4,
        franchisee_ID: "FID005",
        date: "10/1/2022",
        payment: "3300",
        status: "Paid",
        reference: "Cash",
        description: "",
      },
    ];

    const paymentList = paymentData.filter(
      (p) => p.franchisee_ID === req.params.frId
    );
    res.status(200).json(paymentList);
  } catch (err) {
    res.sendStatus(500);
  }
});

// @route   GET api/royality/royalty-payment-history/:frId
// @desc    Get all royality payments by ID
// @access  Private
router.get("/royalty-payment-history/:frId", checkAuth, async (req, res) => {
  try {
    const franchisee = await User.findById(req.params.frId);
    if (!franchisee) {
      return res.sendStatus(404);
    }
    const paymentData = [
      {
        id: 1,
        salesMonth: "2021 Dec",
        sales: "22500",
        royalty_Fees: "2000",
        royalty_Balance: "0",
        status: true,
      },
      {
        id: 2,
        salesMonth: "2022 Jan",
        sales: "30000",
        royalty_Fees: "3500",
        royalty_Balance: "3000",
        status: false,
      },
      {
        id: 3,
        salesMonth: "2021 Feb",
        sales: "15000",
        royalty_Fees: "1500",
        royalty_Balance: "1500",
        status: false,
      },
    ];
    res.status(200).json(paymentData);
  } catch (err) {
    res.sendStatus(500);
  }
});


// @route   PUT api/royality/:id
// @desc    Update royality by ID
// @access  Private
router.put("/:id", checkAuth, async (req, res) => {
  const { error } = validateInput(RoyaltySchema, req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // eslint-disable-next-line camelcase
  const { scheme_Name, royalty_Percentage } = req.body;

  try {
    await Royalty.findByIdAndUpdate(
      req.params.id,
      {
        scheme_Name,
        royalty_Percentage,
      },
      { new: true }
    );
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});
module.exports = router;
