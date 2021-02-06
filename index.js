const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const userrouter = require("./routes/user");
const postsrouter = require("./routes/posts");
const home = require("./controllers/home");

const app = express();
dotenv.config();
app.use(bodyparser.json());
app.use(cors());

//Routes
app.use("/user", userrouter);
app.use("/posts", postsrouter);
app.get("/", home);

const CONNECTION_URL = process.env.MONGOURL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Database connected"))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
