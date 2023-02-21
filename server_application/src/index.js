import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
const app = express();
const dbURL = "mongodb://localhost:27017/password";
const port = 5003;
mongoose.connect(dbURL, { useNewUrlParser: true });
app.use(cors());
app.use(helmet());
app.set("trust-proxy", 1);
const db = mongoose.connection;
mongoose.set("strictQuery", false);
db.on("error", () =>
  console.log("Something went error while connecting database")
);
process.setMaxListeners(0);
db.once("open", () => {
  console.log("Database connected successfully");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.json());
app.disable("etag"); //Disables caching
morgan.token("remote-addr", (req) => {
  return req.header("X-Real-IP") || req.ip;
});

app.post("/save", (req, res, next) => {
  const password = req.body.password;
  const errorCount = req.body.errorCount;

  const newPass = {
    enteredPassword: password,
    errorCount: errorCount,
  };
  db.collection("password_entry").insertOne(newPass, (err, res) => {
    if (err) throw err;
    console.log("values stored successfully in the database");
  });

  console.log(password, errorCount);
});

app.listen(port, () => {
  console.log(`server is running on this port ${port}`);
});
