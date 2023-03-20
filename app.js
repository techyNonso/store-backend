require("dotenv").config();
//stands in for catch async
require("express-async-errors");

const express = require("express");
const app = express();

const notFoundMiddleWare = require("./middleware/not-found");
const errorMiddleWare = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("<h1>Store Api</h1> <a href='/api/v1/products'>Products</a>");
});

app.use("/api/v1/products", productsRouter);

//error handler middlewares
app.use(notFoundMiddleWare);
app.use(errorMiddleWare);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connect db
    connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening at port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
