require("dotenv").config();
const port = process.env.HOST_PORT;
const domain = process.env.HOST_DOMAIN;
const express = require("express");
const app = express();

// JSON parser
app.use(express.json());

const postsRouter = require("./routers/posts");

// Asset statici
app.use(express.static("public"));

// Rotta Homepage
app.get("/", (req, res) => {
  console.log("homepage request received");
  res.send("Server del mio Blog");
});

// POSTS ROUTER
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`server listening on ${domain}:${port}`);
});
