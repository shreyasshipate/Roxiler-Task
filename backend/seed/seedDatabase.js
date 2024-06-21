// seed/seedDatabase.js
const axios = require("axios");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    //To get data from the provided api
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const info = await Transaction.insertMany(data);
    if (info) console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
    mongoose.disconnect();
  }
};

seedDatabase();
