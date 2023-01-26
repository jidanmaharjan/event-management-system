const Event = require("../models/eventModel");
const moment = require("moment");
const axios = require("axios");
const { response } = require("express");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

exports.createEvent = async (req, res) => {
  const { title, description, startDate, endDate, category } = req.body;
  try {
    const currentDate = moment().format("YYYY-MM-DD");
    if (startDate < currentDate || endDate < currentDate) {
      res.status(400).json({
        success: false,
        message: "Event cannot be in the past",
      });
      return;
    } else if (endDate < startDate) {
      res.status(400).json({
        success: false,
        message: "End Date cannot be earlier than start",
      });
      return;
    } else {
      const internalConflicts = await Event.find({
        startDate: { $lte: startDate },
        endDate: { $gte: endDate },
      });
      const leftExternalConflicts = await Event.find({
        startDate: { $gte: startDate, $lte: endDate },
      });
      const rightExternalConflicts = await Event.find({
        endDate: { $gte: startDate, $lte: endDate },
      });
      if (
        internalConflicts.length > 0 ||
        leftExternalConflicts.length > 0 ||
        rightExternalConflicts.length > 0
      ) {
        const allConflicts = [
          ...internalConflicts,
          ...leftExternalConflicts,
          ...rightExternalConflicts,
        ];
        res.status(400).json({
          success: true,
          message: "Event already exists",
          data: allConflicts,
        });
      } else {
        const event = {
          title,
          description,
          startDate,
          endDate,
          category,
          user: req.user._id,
        };
        const result = await Event.create(event);
        res.status(200).json({
          success: true,
          message: "Event created successfully",
          data: result,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkConflict = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const currentDate = moment().format("YYYY-MM-DD");
    if (
      moment(startDate).format("YYYY-MM-DD") < currentDate ||
      moment(endDate).format("YYYY-MM-DD") < currentDate
    ) {
      res.status(400).json({
        success: false,
        message: "Event cannot be in the past",
      });
      return;
    } else if (endDate < startDate) {
      res.status(400).json({
        success: false,
        message: "End Date cannot be earlier than start",
      });
      return;
    } else {
      const internalConflicts = await Event.find({
        startDate: { $lte: startDate },
        endDate: { $gte: endDate },
      });
      const leftExternalConflicts = await Event.find({
        startDate: { $gte: startDate, $lte: endDate },
      });
      const rightExternalConflicts = await Event.find({
        endDate: { $gte: startDate, $lte: endDate },
      });
      if (
        internalConflicts.length > 0 ||
        leftExternalConflicts.length > 0 ||
        rightExternalConflicts.length > 0
      ) {
        res.status(400).json({
          success: false,
          message: "Event already exists. Pick another date",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Event can be picked",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const page = req.query.p || 1;
    const resource = 8;
    const resourceCount = await Event.countDocuments();
    const events = await Event.find()
      .sort({ _id: -1 })
      .limit(resource)
      .skip(resource * (page - 1));
    res.status(200).json({
      success: true,
      count: resourceCount,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUsersEvents = async (req, res) => {
  try {
    const page = req.query.p || 1;
    const resource = 8;
    const resourceCount = await Event.countDocuments({ user: req.user.id });
    const events = await Event.find({ user: req.user.id })
      .sort({ _id: -1 })
      .limit(resource)
      .skip(resource * (page - 1));
    res.status(200).json({
      success: true,
      count: resourceCount,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUsersEventSummary = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).select(
      "eventStatus"
    );
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserEventDates = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).select(
      "startDate endDate"
    );
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEventUserSingle = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.user.toString() === req.user.id) {
      res.status(200).json({
        success: true,
        data: event,
      });
    } else {
      res.status(401).json({
        success: false,
        message: `Cannot access other user's event`,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.khaltiPayment = async (req, res) => {
  const {
    return_url,
    website_url,
    amount,
    purchase_order_id,
    purchase_order_name,
    customer_phone,
    discount,
  } = req.body;
  const requestPayload = {
    return_url,
    website_url,
    amount,
    purchase_order_id,
    purchase_order_name,
    amount_breakdown: [
      {
        label: "Total Price",
        amount: amount + discount,
      },
      {
        label: "Discount",
        amount: -discount,
      },
    ],
  };
  try {
    const options = {
      method: "POST",
      url: "https://a.khalti.com/api/v2/epayment/initiate/",
      params: {},
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET}`,
      },
      data: requestPayload,
    };
    const khaltiResponse = await axios.request(options);
    res.status(200).json({
      success: true,
      data: khaltiResponse.data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyKhaltiPayment = async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.body;
  try {
    const options = {
      method: "POST",
      url: "https://a.khalti.com/api/v2/epayment/lookup/",
      params: {},
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET}`,
      },
      data: { pidx },
    };

    const khaltiResponse = await axios.request(options);
    if (transaction_id === khaltiResponse.data.transaction_id) {
      const paymentResponseFilter = {
        pidx: khaltiResponse.data.pidx,
        total: String(khaltiResponse.data.total_amount / 100),
        transaction_id: khaltiResponse.data.transaction_id,
        status: khaltiResponse.data.status,
        refunded: khaltiResponse.data.refunded,
      };
      //Mail details or header
      const details = {
        from: "Eve. 📧noreply@eve.com",
        to: req.user.email,
        subject: "Payment Successful",
        text: `Your payment was successful with transaction ID of ${khaltiResponse.data.transaction_id}`,
        html: `<img style="width: 150px" src='https://cdn-icons-png.flaticon.com/512/5743/5743145.png' /><br/><p>Your payment was successful with transaction ID of ${khaltiResponse.data.transaction_id}</p>`,
      };
      const paidEvent = await Event.findById(purchase_order_id);
      paidEvent.payment.status = "paid";
      paidEvent.payment.amount = khaltiResponse.data.total_amount / 100;
      paidEvent.payment.details = paymentResponseFilter;
      await paidEvent.save();
      //Send mail to user
      await mailTransporter.sendMail(details, (err) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: err.message,
          });
        }
      });
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment could not be verified",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBookedDates = async (req, res) => {
  try {
    const bookedDates = await Event.find({
      endDate: { $gte: moment().format("YYYY-MM-DD") },
    }).select("startDate endDate");
    res.status(200).json({
      success: true,
      totalBookings: bookedDates.length,
      data: bookedDates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Event.findById(req.params.id);
    booking.eventStatus = req.body.eventStatus;
    await booking.save();
    res.status(200).json({
      success: true,
      message: "Booking Status updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Event.findById(req.params.id);
    console.log(booking.user, req.user.id);
    if (booking.user.toString() === req.user.id.toString()) {
      booking.eventStatus = "cancelled";
      await booking.save();
      res.status(200).json({
        success: true,
        message: "Booking has been cancelled",
        data: booking,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Cannot cancel other's booking",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
