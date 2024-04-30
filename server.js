const express = require("express");
const app = express();
const path = require("path");
const logEvents = require("./middleware/logEvents");
const PORT = process.env.PORT || 3500;

//custom middleware
app.use((req, _, next) => {
  logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "./public")));

app.get("^/$|/index(.html)?", (_, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (_, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (_, res) => {
  res.redirect(301, "/new-page.html"); // 302 default
});

app.get(
  "/hello(.html)?",
  (_req, _res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (_, res) => {
    res.send("Hello world");
  }
);

const one = (_req, _res, next) => {
  console.log("one");
  next();
};
const two = (_req, _res, next) => {
  console.log("two");
  next();
};
const three = (_req, res) => {
  console.log("three");
  res.send("finished");
};

app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (_, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
