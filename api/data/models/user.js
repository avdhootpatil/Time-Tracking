/**
 * Constructor function to create user
 * @param {Number} id
 * @param {string} userName
 * @param {string} userEmail
 * @param {string} password
 */

function User(id, userName, userEmail, password) {
  if (id) {
    this.id = id;
  }
  this.userName = userName;
  this.userEmail = userEmail;
  this.password = password;
}

export default User;
