const Trader = require("../models/trader");

const TraderController = {
  getTraders: (req, res) => {
    Trader.find({})
      .then(function (traders) {
        res.json(traders);
      })
      .catch(function (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching users." });
      });
  },
};

module.exports = TraderController;
