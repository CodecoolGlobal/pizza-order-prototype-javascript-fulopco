const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("frontend"));

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.get("/beers/list", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

let port = 9000;
app.listen(port, (_) => console.log(`http://127.0.0.1:${port}`));
//b
