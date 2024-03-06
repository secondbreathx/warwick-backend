const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler.js");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const usersRoutes = require("./routes/users");
const teamRoutes = require("./routes/teams");
const kpiRoutes = require("./routes/kpi");
const uploadRoutes = require("./routes/upload");

const api = process.env.API_URL;
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/teams`, teamRoutes);
app.use(`${api}/kpi`, kpiRoutes);
app.use(`${api}/upload`, uploadRoutes);


//Database
mongoose
  .connect(process.env.CONNECTION_STRING_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3003, () => {
  console.log("server is running http://localhost:3003");
});