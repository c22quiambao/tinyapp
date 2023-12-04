const assert= require('chai').assert;
const getUserByEmail= require('../helpers');

const testUsers = {
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

describe('getUserByEmail', function() {
  //Write a unit test that confirms our getUserByEmail function returns a user object when it's provided with an email that exists in the database.

  it('should return an object when the user email supplied has been registered', function() {
    const foundUser = getUserByEmail("test@test.com", testUsers)
    console.log(foundUser);
    assert.isOk(foundUser);
  });

  it('should return a user with valid email', function() {
    const user = getUserByEmail("test@test.com", testUsers)
    const expectedEmail = user.email;
    assert.strictEqual(expectedEmail, "test@test.com");
  });

  it('should return undefined when a non registered email is supplied', function() {
    const foundUser = getUserByEmail("tata@test.com", testUsers)
    console.log(foundUser);
    //const expectedEmail = user.email;
    //console.log(email);
    //const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.notExists(foundUser);
  });  
});