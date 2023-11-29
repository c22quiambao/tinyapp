const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Set ejs as the view engine
app.set("view engine", "ejs");

//middleware to translate body info received from the browser
app.use(express.urlencoded({ extended: true }));

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < charactersLength; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return randomString.substring(2,8);
};

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

//app.get("/set", (req, res) => {
//  const a = 1;
//  res.send(`a = ${a}`);
//});

//app.get("/fetch", (req, res) => {
//  res.send(`a = ${a}`);
//});

// route to show the list of urls in the database
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// route to create a new url. This will show the form to be filled out.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// route to create a new url. This will show the form to be filled out.
app.get("/urls/:id", (req, res) => {
  // extract the id from the url
  const id = req.params.id;
  // extract the longURL based on the id extracted
  const longUrl = urlDatabase[id];

  const templateVars = { id: id, longURL: longUrl /* What goes here? */ };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log("info recieved from browser : ",req.body); // Log the POST request body to the console
  let shorturl = generateRandomString();
  console.log("random generated string : ", shorturl);

  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});