/**
 * Constructor function to create project
 * @param {Number} id project id
 * @param {string} name project name
 * @param {string} description project description
 * @param {number} clientId client id for the project
 */

function Project(id, name, description, clientId) {
  if (id) {
    this.id = id;
  }
  this.name = name;
  this.description = description || "";
  this.clientId = clientId;
}

export default Project;
