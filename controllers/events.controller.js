const db = require("../models");
const Event = db.event;

exports.get = (req, res) => {
  var datetime = new Date();
  let date = datetime.toISOString().slice(0, 10);
  Event.find({
    startDate: { $gt: date },
  }).exec((err, data) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res.status(200).send(data);
  });
};

exports.add = (req, res) => {
  if (typeof req.body.date == "undefined") {
    return res.status(422).send({
      date: "date is required",
    });
  }

  if (typeof req.body.name == "undefined") {
    return res.status(422).send({
      name: "name is required",
    });
  }

  if (typeof req.body.startDate == "undefined") {
    return res.status(422).send({
      startDate: "startDate is required",
    });
  }

  if (typeof req.body.endDate == "undefined") {
    return res.status(422).send({
      endDate: "endDate is required",
    });
  }

  var event;

  var datetime = new Date();
  let date = datetime.toISOString().slice(0, 10);

  event = new Event({
    name: req.body.name,
    date: req.body.date,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    createdAt: date,
  });

  event.save();

  return res.status(200).send(event);
};

exports.update = (req, res) => {
  if (typeof req.body.eventId == "undefined") {
    return res.status(422).send({
      message: "event id is required",
    });
  }

  Event.findById(req.body.eventId).exec((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    if (typeof req.body.name != "undefined") {
      data.name = req.body.name;
    }

    if (typeof req.body.date != "undefined") {
      data.date = req.body.date;
    }

    if (typeof req.body.startDate != "undefined") {
      data.startDate = req.body.startDate;
    }

    if (typeof req.body.endDate != "undefined") {
      data.endDate = req.body.endDate;
    }

    if (typeof req.body.description != "undefined") {
      data.description = req.body.description;
    }

    data.save((err, data) => {
      if (err) {
        return res.status(500).send({
          message: err,
        });
      }

      return res.status(200).send(data);
    });
  });
};

exports.delete = (req, res) => {
  if (typeof req.body.eventId == "undefined") {
    return res.status(422).send({
      message: "event id is required",
    });
  }

  Event.findByIdAndDelete(req.body.eventId).exec((err, data) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    }

    res.status(200).send(data);
  });
};