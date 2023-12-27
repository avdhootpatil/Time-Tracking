/**
 * Constructor function to create user
 * @param {string} userName
 * @param {string} userEmail
 * @param {string} password
 */

function User(userName, userEmail, password) {
  this.userName = userName;
  this.userEmail = userEmail;
  this.password = password;
}

export default User;
