// Users.js
class User {
    static async findByUsername(username) {
      const { rows } = await global.pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return rows[0];
    }
  
    static async create(userData) {
      // Destructure and set a default role if not provided.
      const { username, password, email, role = 'user' } = userData;
      const { rows } = await global.pool.query(
        'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, password, email, role]
      );
      return rows[0].id;
    }
  }
  
  module.exports = User;  