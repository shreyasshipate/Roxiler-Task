// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//Return all transactions
app.get("/transaction", async (req, res) => {
  Transaction.find()
    .then((items) => res.json(items))
    .catch((err) => res.json(err));
});

//Return transaction for selected month
app.get("/transactions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = !isNaN(parseInt(req.query.limit))
      ? parseInt(req.query.limit)
      : 10;
    const skip = page * limit;
    const search = req.query.search || "";
    const month = !isNaN(parseInt(req.query.month))
      ? parseInt(req.query.month)
      : 3;

    const searchConfig = {
      $and: [
        month == 0
          ? {}
          : {
              $expr: {
                $eq: [{ $month: "$dateOfSale" }, month],
              },
            },
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    const data = await Transaction.find(searchConfig).skip(skip).limit(limit);
    const totalCount = await Transaction.countDocuments(searchConfig);

    const responseData = {
      success: true,
      totalCount,
      page: page + 1,
      limit,
      month,
      transactions: data,
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Return with all Statistics for particular month
app.get("/statistics", async (req, res) => {
  const month = !isNaN(parseInt(req.query.month))
    ? parseInt(req.query.month)
    : 3;
  const monthQuery =
    month === 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };
  const projectQuery = {
    _id: 0,
    price: 1,
    sold: 1,
    dateOfSale: 1,
  };

  try {
    const items = await Transaction.find(monthQuery, projectQuery).exec();

    // Log the items fetched
    console.log("Fetched items:", items);

    // Calculate the statistics
    const total = items.length;
    const soldItems = items.filter((item) => item.sold === true);
    const sold = soldItems.length;
    const unsold = total - sold;

    // Log the sold items
    console.log("Sold items:", soldItems);

    // Calculate totalSaleAmount using reduce
    const totalSaleAmount = soldItems.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

    // Log the totalSaleAmount
    console.log("Total Sale Amount:", totalSaleAmount);

    res.json({
      totalTransactions: total,
      totalSoldItems: sold,
      totalUnsoldItems: unsold,
      totalSaleAmount: totalSaleAmount.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching statistics", error: err });
  }
});

//Return with categories wise count for plottin bar chart
app.get("/bar-chart", async (req, res) => {
  const month = !isNaN(parseInt(req.query.month))
    ? parseInt(req.query.month)
    : 3;
  const monthQuery =
    month == 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };
  const projectQuery = {
    _id: 0,
    price: 1,
  };

  try {
    const transactions = await Transaction.find(monthQuery, projectQuery);
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.price <= 100) priceRanges["0-100"]++;
      else if (transaction.price <= 200) priceRanges["101-200"]++;
      else if (transaction.price <= 300) priceRanges["201-300"]++;
      else if (transaction.price <= 400) priceRanges["301-400"]++;
      else if (transaction.price <= 500) priceRanges["401-500"]++;
      else if (transaction.price <= 600) priceRanges["501-600"]++;
      else if (transaction.price <= 700) priceRanges["601-700"]++;
      else if (transaction.price <= 800) priceRanges["701-800"]++;
      else if (transaction.price <= 900) priceRanges["801-900"]++;
      else priceRanges["901-above"]++;
    });

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bar chart data", error });
  }
});

//Returns with categories wise distribution for plotting pie chart
app.get("/pie-chart", async (req, res) => {
  const month = !isNaN(parseInt(req.query.month))
    ? parseInt(req.query.month)
    : 3;
  const monthQuery =
    month == 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };
  const projectQuery = {
    _id: 0,
    category: 1,
  };
  try {
    const transactions = await Transaction.find(monthQuery, projectQuery);
    const categoryRange = {
      "mens clothing": 0,
      "womens clothing": 0,
      jewelery: 0,
      electronics: 0,
    };
    transactions.forEach((transaction) => {
      if (transaction.category === "men's clothing")
        categoryRange["mens clothing"]++;
      else if (transaction.category === "women's clothing")
        categoryRange["womens clothing"]++;
      else if (transaction.category === "jewelery") categoryRange["jewelery"]++;
      else if (transaction.category === "electronics")
        categoryRange["electronics"]++;
    });
    res.status(200).json(categoryRange);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pie chart data", error });
  }
});

//Return all the combined data to show total sale, sold and unsold items
app.get("/combined-data", async (req, res) => {
  try {
    const baseURL = req.protocol + "://" + req.get("host");
    const [stats, barChart, pieChart] = await Promise.all([
      axios.get(`${baseURL}/statistics?month=${req.query.month}`),
      axios.get(`${baseURL}/bar-chart?month=${req.query.month}`),
      axios.get(`${baseURL}/pie-chart?month=${req.query.month}`),
    ]);

    const response = {
      statsData: stats.data,
      barChartData: barChart.data,
      pieChartData: pieChart.data,
    };
    // console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
