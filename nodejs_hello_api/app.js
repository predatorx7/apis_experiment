const express = require("express");
const app = express();
const port = 8004;

app.get("/", (req, res) => {
  res.send("Hello, Docker!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
