////////////////////////////////////////////////////////////////////////////////// Requires / Packages
////////////////////////////////////////////////////////////////////////////////

const express = require("express");

////////////////////////////////////////////////////////////////////////////////// Set-up / Config
////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////////////////// Middleware - to translate body info received from the browser
////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));

////////////////////////////////////////////////////////////////////////////////// Listener
////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


////////////////////////////////////////////////////////////////////////////////// Functions
////////////////////////////////////////////////////////////////////////////////

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < charactersLength; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomString.substring(2,8);
};

////////////////////////////////////////////////////////////////////////////////// Database
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

////////////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////////////
/**
 * GET /hello       Shows a hello test output.
 */
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

/**
 * POST /login   Sets cookie username and redirects to  /urls page
 */
app.get('/login', (req, res) => {
  const cookies = req.cookies;
  const username = cookies.username;
});

app.post("/login", (req, res) => {
  const body = req.body;
  const username = body.username;
  console.log("username : ", username);
    res.cookie("username", username);
  res.redirect(`/urls`);
});

//app.get("/set", (req, res) => {
//  const a = 1;
//  res.send(`a = ${a}`);
//});

//app.get("/fetch", (req, res) => {
//  res.send(`a = ${a}`);
//});

/**
 * GET /urls.json   Shows json of urlDatabase
 */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/**
 * GET /urls   Shows the list of urls in the urlDatabase on a web browser
 */
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

/**
 * GET /urls/new    Shows the form for adding a new url to shorten on a web browser
 * POST /urls/new   Handles submission of new url form
 */

/**
 * GET /urls/new    Shows the form for adding a new url to shorten on a web browser
 */
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/**
 * POST /urls/new   Handles submission of new url form
 */
app.post("/urls", (req, res) => {
  console.log("info recieved from browser : ",req.body); // Log the POST request body to the console. The body sends back i.e: { longURL: 'google.com' }
  const body = req.body; //stores request body response from the form

  //check if the longURL has http:// included
  let search1 = body.longURL.search("http://");
  let search2 = body.longURL.search("https://");
  console.log(search1);
  console.log(search2);

  let longURL = body.longURL;

  if (search1 === -1 && search2 ===-1 ){
    longURL = `https://${body.longURL}`; //TO DO!!! add http:// as prefix if there isnt
  }

  console.log("longURL : ", longURL);

  const shorturl = generateRandomString();  // generates a random string to be used as the id in the db
  console.log("random generated string : ", shorturl);
  console.log("type of shorturl: ",typeof shorturl);
  console.log("existing DB : ", urlDatabase);

  urlDatabase[shorturl] = longURL;

  console.log("UPDATED DB : ", urlDatabase);

  res.redirect(`/urls/${shorturl}`);// redirect to 'urls/$(id) ----> for the new url added
});




/**
 * GET /urls/:id  Shows the shortUrl and longUrl of a specific url on a web browser
 */
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted

  const templateVars = { id: id, longURL: longUrl};
  res.render("urls_show", templateVars);

});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id
  res.redirect(longUrl);
});

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted

  const templateVars = { id: id, longURL: longUrl};
  res.render("urls_show", templateVars);

});

app.post("/urls/:id/save", (req, res) => {
  const id = req.params.id;  // extract the id from the url

  console.log("info recieved from browser : ",req.body);
  const body = req.body; //stores request body response from the form

  //check if the longURL has http:// included
  let search1 = body.longURL.search("http://");
  let search2 = body.longURL.search("https://");
  console.log(search1);
  console.log(search2);

  let longURL = body.longURL;

  if (search1 === -1 && search2 ===-1 ){
    longURL = `https://${body.longURL}`; //TO DO!!! add http:// as prefix if there isnt
  }

  console.log("longURL : ", longURL);
  console.log("existing DB : ", urlDatabase);

  urlDatabase[id] = longURL;

  console.log("updated DB : ", urlDatabase);
  res.redirect('/urls');

});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted

  console.log("existing DB : ", urlDatabase);
  delete urlDatabase[id];
  console.log("updated DB : ", urlDatabase);
  res.redirect('/urls');

});


