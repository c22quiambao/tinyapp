////////////////////////////////////////////////////////////////////////////////// Requires / Packages
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bcrypt = require("bcryptjs");

////////////////////////////////////////////////////////////////////////////////// Set-up / Config
////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////////////////// Middleware - to translate body info received from the browser
////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan());

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

const getUserByEmail = function(email) {
  const usersArray = Object.values(users);
  console.log("usersArray --->", usersArray);
  for  (const user of usersArray) {
    if (user.email === email) {
      console.log("user --->", user);
      return user;
    }
  }
  return null;
};

const urlsForUser = function(userID) {
  let newObj = {};
  const keysOfObj = Object.keys(urlDatabase);

  for (let element of keysOfObj) {
    if (userID === urlDatabase[element].userID) {
      const longURL = urlDatabase[element].longURL;
      newObj[element] = {longURL};
    }
  }
  return newObj;
};
////////////////////////////////////////////////////////////////////////////////// Database Objects
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": {
    longURL : "http://www.lighthouselabs.ca",
    userID : "userRandomID"
  },
  "9sm5xK": {
    longURL : "http://www.google.com",
    userID : "userRandomID"
  },
  "8sm1xk": {
    longURL : "http://www.instagram.com",
    userID : "kikx01"
  },
  "7jmvQk": {
    longURL : "https://en.wikipedia.org/wiki/Main_Page",
    userID : "kikx01"
  }
};


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$M5BOaEBkb0Xdyre4jobtruLNKQZl2SAQdfetlYsRWvovb4Nts8f.6",               //test01
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$btlimy8GOtYAZCZcB0A1luLL7eMuoJzt.dBgnJbG13iKOSDAfWrBK",               //123qwe
  },
  kikx01: {
    id: "kikx01",
    email: "test@test.com",
    password: "$2a$10$lApJr9zllsXIHxJ2en65S.ZKC0T/mTAm6BFFMEUCnwSek6fG0fh9e",               //abc123
  }
};


////////////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////////////

/*************
* GET /       Main redirection of app initial visit
*************/
app.get("/", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in or not then redirect or render page
  if (user_id) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/login`);
  }
});

/*************
* GET /urls      Shows the list of urls in the urlDatabase on a web browser
*************/
app.get("/urls", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in or not then redirect or render page
  if (!user_id) {
    res.status(400).send('<h3>You have to be logged in to see this page.</h3>');
    return;
  }

  // retrieve id of logged in user from users db using cookie stored
  const foundUser = users[user_id];

  // call function to create new url db containing only the urls of the signed in user
  const newUrlDatabase = urlsForUser(user_id);

  // pass needed variables to render template
  const templateVars = {
    urls: newUrlDatabase,
    user_id: user_id,
    foundUser: foundUser
  };

  // render page
  res.render("urls_index", templateVars);
});

/*************
* GET /urls/new      Shows the form for adding a new url to shorten on a web browser
*************/
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in or not then redirect or render page
  if (!user_id) {
    res.redirect(`/login`);
  }

  // render page
  const foundUser = users[user_id];
  const templateVars = {foundUser};
  res.render("urls_new", templateVars);
});

/******
 * GET /urls/:id      Shows the shortURL and longURL of a specific url on a web browser
 ******/
app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies["user_id"];
  const id = req.params.id;

  // check if user is logged in
  if (!user_id) {
    res.status(400).send('<h3>You have to be logged in to see this page.</h3>');
    return;
  }

  // check if short URL exists in db
  if (!urlDatabase.hasOwnProperty(id)) {
    res.status(404).send('<h3>URL data does not exist.</h3>');
    return;
  }

  // get owner of url
  const newUrlDatabase = urlsForUser(user_id);

  // check if user logged in does not own the URL
  if (!newUrlDatabase.hasOwnProperty(id)) {
    res.status(400).send('<h3>You have no permission to access this page.</h3>');
    return;
  }
  const urls = newUrlDatabase;
  const foundUser = users[user_id];
  const templateVars = {id, urls, foundUser};

  // render page
  res.render("urls_show", templateVars);
});

/******
 * GET /u/:id     Redirects the user to the longURL of the ShortURL selected
 ******/
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURl = urlDatabase[id].longURL;

  // check if long URL exists in db
  if (!longURl) {
    res.status(404).send('<h3>URL data does not exist.</h3>');
    return;
  }

  // render page
  res.redirect(longURl);
});

/******
 * POST /urls     Handles submission/saving of new url form
 ******/
app.post("/urls", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in or not then redirect or render page
  if (!user_id) {
    res.status(400).send('<h3>You have no permission to access this page.</h3>');
    return;
  }

  //check if the longURL has http:// included
  let longURL = req.body.longURL;
  const search1 = longURL.search("http://");
  const search2 = longURL.search("https://");

  if (search1 === -1 && search2 === -1) {
    longURL = `https://${longURL}`;
  }
  // generates a random string to be used as the id in the db
  const shortURL = generateRandomString();

  // store data in db
  urlDatabase[shortURL] = {longURL, userID : user_id};

  // redirect to 'urls/$(id) ----> for the new url added
  res.redirect(`/urls/${shortURL}`);
});

/******
 * POST /urls/:id      Handles submission of edited url data
 ******/
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const user_id = req.cookies.user_id;
  const longURL = req.body.longURL;

  // check if user is logged in
  if (!user_id) {
    res.status(400).send('<h3>You have to be logged in to see this page.</h3>');
    return;
  }

  // check if user logged in does not own the URL
  const newUrlDatabase = urlsForUser(user_id);

  if (!newUrlDatabase.hasOwnProperty(id)) {
    res.status(400).send('<h3>You have no permission to access this page.</h3>');
    return;
  }

  // update longURL
  urlDatabase[id].longURL = longURL;

  // redirect
  res.redirect(`/urls`);
});

/******
 * POST /urls/:id/delete      Handles submission of deleted url data
 ******/
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const user_id = req.cookies.user_id;

  // check if user is logged in
  if (!user_id) {
    res.status(400).send("You should login to perform this action.");
    return;
  }

  // check if user logged in does not own the URL
  const newUrlDatabase = urlsForUser(user_id);

  if (!newUrlDatabase.hasOwnProperty(id)) {
    res.status(400).send('<h3>You have no permission to access this page.</h3>');
    return;
  }

  // delete data from db
  delete urlDatabase[id];

  // redirect
  res.redirect('/urls');
});

/*************
** GET /login      Shows login page
*************/
app.get("/login", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in for redirection
  if (user_id) {
    res.redirect(`/urls`);
    return;
  }

  // render page
  res.render("login",{user: null});
});

/*************
* GET /register      Shows registration page
*************/
app.get("/register", (req, res) => {
  const user_id = req.cookies.user_id;

  // check if user is logged in for redirection
  if (user_id) {
    res.redirect(`/urls`);
    return;
  }

  // render page
  res.render("register", {user: null});
});

/*************
* POST /login      Performs POST login functionality for validity
*************/
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUser = getUserByEmail(email);
  console.log("found user------>", foundUser);

  // check for existings users
  if (!foundUser) {
    res.status(403).send('<h3>User is not yet registered. Please register.</h3>');
    return;
  }

  // check password is invalid

  if (!bcrypt.compareSync(password,foundUser.password,)) {
    res.status(403).send('<h3>Password or Email is incorrect. Please try again.</h3>');
    return;
  }

  // proceed with login, set cookie and then redirect
  const user_id = foundUser.id;
  res.cookie("user_id", user_id);
  res.redirect(`/urls`);
});

/*************
* POST /register     Handles the submission of the registration form data
*************/
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  // check if email and password field is empty
  if (!email || !password) {
    res.status(400).send('<h3>Email and Password cannot be empty.</h3');
    return;
  }

  const foundUser = getUserByEmail(email);

  // check for existing email
  if (foundUser) {
    res.status(400).send('<h3>Email is already registered. Please try again</h3>');
    return;
  }

  // generates a random string to be used as the id in the users db
  const id = generateRandomString();

  // create new user object and add to users database
  users[id] = {
    id: id,
    email: email,
    password : hashedPassword
  };
  console.log("new users object created --- > ",users[id]);
  console.log("new users object created --- > ",users);

  // TO DO ENCRYPT NEW PASSWORD

  // set generated id as session cookie
  res.cookie("user_id", id);

  // redirect
  res.redirect(`/urls`);
});

/*************
* POST /logout     Handles Signing out of app and clearing cookies
*************/
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/login');
});