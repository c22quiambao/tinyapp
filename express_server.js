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
  const body = req.body; //stores info from the form
  let longURL = body.longURL; //TO DO!!! add http:// as prefix if there isnt
  console.log("longURL : ", longURL);
  const shorturl = generateRandomString();  // generates a random string to be used as the id in the db
  console.log("random generated string : ", shorturl);
  console.log("type of shorturl: ",typeof shorturl);
  console.log("existing DB : ", urlDatabase);
  urlDatabase[shorturl] = longURL;

  // Build a new url object!
  //const newUrl = {
  // [`${shorturl}`]: longURL
  //};
  console.log("UPDATED DB : ", urlDatabase);



  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  
  
  res.redirect(`/urls/${shorturl}`);// redirect to 'urls/$(id) ----> this is the shorturl/random string
  // generate shortURL 
  // add it to the database
  // server responds by doing a redirect using the shortversion - > 302 will be found
  //browser receieves 302 response from server
  // browser requests url provided in the location response header
  // gets /urls/shorturl
  // server app gets ('urls/:id).. res.render (urls_show,templatevars)
  //server looks up the longurl from db passes the id and longurl to the template, generates htm to send to browser
  //browsers renders html form received from the server
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



