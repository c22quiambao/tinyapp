const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Set ejs as the view engine
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  console.log (urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  // extract the id from the url
  const id = req.params.id
  // extract the longURL based on the id extracted
  const longUrl = urlDatabase[id]

  const templateVars = { id: id, longURL: longUrl /* What goes here? */ };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});