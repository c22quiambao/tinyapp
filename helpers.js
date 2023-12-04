////////////////////////////////////////////////////////////////////////////////// Helper functions
////////////////////////////////////////////////////////////////////////////////

/*************
* Function to look up the emails owned by a specific user
*************/
const getUserByEmail = function(email, database) {
  const usersArray = Object.values(database);
  for  (const user of usersArray) {
    if (user.email === email) {
      return user;
    }
  }
};

module.exports = getUserByEmail;
