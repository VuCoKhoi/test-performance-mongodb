const mongoose = require("mongoose");

async function connectMongo() {
  await mongoose.connect("mongodb://localhost/test-performance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

module.exports = connectMongo;
