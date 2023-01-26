const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI || 4000, {})
    .then((con) => {
      console.log(`Mongoose connected with host `, con.connection.host);
    })
    .catch((err) => console.log(err));
};

module.exports = connectDb;
