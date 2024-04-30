const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger);

// Cross Origin Resource Sharing
const whiteList = [
  "https://www.google.com",
  // "http://localhost:3500",
  // "http://127.0.0.1:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    // remove "|| !origin" after dev
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Request from bad origin"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// serve static files
app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/subdir", express.static(path.join(__dirname, "./public")));

// routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// app.get(
//   "/hello(.html)?",
//   (_req, _res, next) => {
//     console.log("attempted to load hello.html");
//     next();
//   },
//   (_, res) => {
//     res.send("Hello world");
//   }
// );

// const one = (_req, _res, next) => {
//   console.log("one");
//   next();
// };
// const two = (_req, _res, next) => {
//   console.log("two");
//   next();
// };
// const three = (_req, res) => {
//   console.log("three");
//   res.send("finished");
// };

// app.get("/chain(.html)?", [one, two, three]);

// app.all() will apply to all http methods
// because this is the catch-all it can just take a "*"
// to catch all routes.

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
