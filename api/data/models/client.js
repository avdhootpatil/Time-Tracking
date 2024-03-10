/**
 * Constructor function to create a client
 * @param {Number} id client id
 * @param {string} name client name
 * @param {string} description client description
 */

function Client(id, name, description) {
  if (id) {
    this.id = id;
  }
  this.name = name;
  this.description = description;
}

export default Client;
