/**
 * Constructor function to create holiday
 * @param {number} id
 * @param {string} date
 * @param {string} description
 */
function Holiday(id, date, description) {
  if (id) {
    this.id = id;
  }
  this.date = date;
  this.description = description;
}

export default Holiday;
