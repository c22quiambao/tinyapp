////////////////////////////////////////////////////////////////////////////////// Requires / Packages
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const e = require("express");

////////////////////////////////////////////////////////////////////////////////// Set-up / Config
////////////////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////////////////// Middleware - to translate body info received from the browser
////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

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

const getUserByEmail = function(email){
  console.log("function getUserByEmail CALLED!!!!!!");
  const usersArray = Object.values(users);
  console.log("usersArray -----> ", usersArray);

  for  (const user of usersArray){
    if (user.email === email){
      console.log("user to be returned------>", user)
      return user;
    }
  }
  return null;
};
  
////////////////////////////////////////////////////////////////////////////////// Database Objects
////////////////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey!",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher$funk",
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "test@test.com",
    password: "abc123",
  }
};


////////////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////////////
// GET /hello       Shows a hello test output.
app.get("/", (req, res) => {
  res.send("Hello!");
});


/*************
 *** GET  & POST for new user registration
 ************/

/******
 * GET /register      Shows registration page
 ******/
app.get("/register", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;
  const templateVars = {email,password};
  res.render("registration", templateVars)
});

/******
 * POST /register     Handles the submission of the registration form data
 ******/
app.post("/register", (req, res) => {
  const body = req.body;
//        console.log("body : ", body);
  const email = body.email;
  const password = body.password;
//        console.log("email : ", email);
//        console.log("Type of email",typeof email);
//        console.log("password : ", password);
//        console.log("Type of password",typeof password);

   // check if email and password field is empty
  if(email === '' || password === '' ){
 //   console.log("inside if checking for null!!!!!!");
 console.log("empty username or pw");
    res.status(400).end('<p>Email and Password cannot be empty.</p>');
  } else {
      const foundUser = getUserByEmail(email);

      // check return value of function existingEmail
      if (foundUser){
        res.status(400).end('User is already registered!');
        console.log("user exists");
        res.redirect(`/register`)
        return;
      } else {
      const user_id = generateRandomString();  // generates a random string to be used as the userid in the db
                  console.log("random generated string : ", user_id);
                  console.log("type of user_id: ",typeof user_id);
                  console.log("existing DB : ", users);
      res.cookie("user_id", user_id);

      // create new user object and add to users database
      users[user_id] = {
        id:user_id,
        email:email,
        password:password
      }
      console.log("UPDATED users DB : ", users);
      // redirect to urls page
      res.redirect(`/urls`);// redirect to 'urls
      }
  }
});

/******
 * GET /login      Shows login page
 ******/
app.get("/login", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;
  const templateVars = {email,password};
  res.render("login",templateVars);
});



/******
 * POST /login      Performs POST login functionality for validity
 ******/
app.post("/login", (req, res) => {
  console.log("INSIDE POST LOGIN");
  const body = req.body;
  console.log("body!!!!---->>>> ", body);
  const email = body.email;
  const password = body.password
  console.log("email : ", email);
  console.log("password : ", password);
  const foundUser = getUserByEmail(email);

  if (!foundUser){
    res.status(403).end('User is not yet registered.');
    console.log("user does not exists");
    res.redirect(`/register`)
    return;
  }

  console.log("founduser in memory ----->", foundUser)
  console.log("typeof founduser in memory ----->", typeof foundUser)

  if (password === foundUser["password"] ){
    const user_id = foundUser["id"]
    console.log("user_id in memory ----->", user_id)
    //const email = foundUser[email];
        //console.log("founduser in memory ----->", foundUser[email])
    res.cookie("user_id", user_id);
    res.redirect(`/urls`);
  }else{
    res.status(403).end('Username or Password is incorrect!');
    console.log("wrong pw or un");
    res.redirect(`/login`)
    return;
  }
});

/******
 * POST /sign-out     Handles Signing out of app and clearing cookies
 ******/

app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/login');
});



/******
 * GET /urls      Shows the list of urls in the urlDatabase on a web browser
 ******/
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"]
  const foundUser = users[user_id];
  console.log("user id in memory", user_id);
  console.log("foundUser---->", foundUser);

  const templateVars = { urls: urlDatabase,
        user_id: user_id, foundUser: foundUser};
      res.render("urls_index", templateVars);
});

/*************
 *** GET  & POST for new urls 
 ************/

/******
 * GET /urls/new      Shows the form for adding a new url to shorten on a web browser
 ******/
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  const foundUser = users[user_id];
  const templateVars = {foundUser: foundUser};
  res.render("urls_new", templateVars);
});

/******
 * POST /urls     Handles submission/saving of new url form
 ******/
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

/******
 * GET /urls/:id      Shows the shortUrl and longUrl of a specific url on a web browser
 ******/
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted
  const user_id = req.cookies["user_id"];
  const foundUser = users[user_id];
  const templateVars = { id: id, longURL: longUrl,
    foundUser: foundUser};
  res.render("urls_show", templateVars);

});

/******
 * GET /u/:id     Redirects the user to the longURL of the ShortURL selected
 ******/

app.get("/u/:id", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id
  res.redirect(longUrl);
});

/******
 * POST /urls/:id/edit      Handles submission of edited url data
 ******/
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted
  const user_id = req.cookies["user_id"];
  const foundUser = users[user_id];
  const templateVars = { id: id, longURL: longUrl,
    foundUser: foundUser};
  res.render("urls_show", templateVars);

});

/******
 * POST /urls/:id/save      Handles submission of saved edited url data
 ******/

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

/******
 * POST /urls/:id/delete      Handles submission of deleted url data
 ******/
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;  // extract the id from the url
  const longUrl = urlDatabase[id];  // extract the longURL based on the id extracted

  console.log("existing DB : ", urlDatabase);
  delete urlDatabase[id];
  console.log("updated DB : ", urlDatabase);
  res.redirect('/urls');

});


/*
// Initial routes used to test application is working
// based on the assignments in compass

app.get("/set", (req, res) => {
 const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET /hello       Shows a hello test output.
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

*/


