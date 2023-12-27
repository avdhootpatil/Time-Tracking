/**
 * Constructor function to create project
 * @param {string} name project name
 * @param {string} description project description
 * @param {number} clientId client id for the project
 */

function Project(name, description, clientId) {
  this.name = name;
  this.description = description || "";
  this.clientId = clientId;
}

export default Project;
