const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (_, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (_, res) => {
  res.redirect(301, "/new-page.html"); // 302 default
});

module.exports = router;
