const express = require("express");
const favicon = require("serve-favicon");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const compression = require("compression");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();

const apiProxy = createProxyMiddleware(
  [`${config.CONTEXT}/member`, `${config.CONTEXT}/content`],
  {
    pathRewrite: { [`^${config.CONTEXT}`]: "" },
    target: config.API_HOST,
    changeOrigin: true,
  }
);

app.use(compression());

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: 'index.html',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set("x-timestamp", Date.now());
  },
};

// http代理
app.use(apiProxy);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(`${config.CONTEXT}/`, express.static(path.join(__dirname), options));

app.listen(config.PORT, config.HOST, (err) => {
  if (!err) {
    console.log(
      `listening on http://${config.HOST}:${config.PORT}${config.CONTEXT}`
    );
  } else {
    throw err;
  }
});