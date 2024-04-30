// Cross Origin Resource Sharing
const whiteList = [
  "https://www.google.com",
  "http://localhost:3500",
  "http://127.0.0.1:3500",
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

module.exports = corsOptions;
