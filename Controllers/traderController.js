const Trader = require("../models/trader");

exports.getTraders = async (req, res) => {
  try {
    const traders = await Trader.find({});

    if (!traders) {
      return res.status(404).json({ error: "No traders found" });
    }

    if(res){
      res.status(200).json({ traders: traders});
    }else{
      return (traders);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching traders" });
  }
};

exports.searchTrader = async (req, res) => {
  try {
    // Get the search query from the request body
    const searchQuery = req.body.searchQuery;

    // Implement logic to search for traders based on the search query
    const traders = await Trader.find({
      $or: [{ username: { $regex: searchQuery, $options: "i" } }],
    });

    res.status(200).json({ traders });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for traders" });
  }
};
