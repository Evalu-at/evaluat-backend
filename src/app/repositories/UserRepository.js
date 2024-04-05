const db = require('../../database');

class UserRepository {
  async findEmail(email) {
    const query = {
      name: 'fetch-email',
      text: 'SELECT * FROM usuario WHERE email = $1',
      values: [email],
    };

    const rows = await db.query(query);

    return rows;
  }

  async findPassword(email) {
    const query = {
      name: 'fetch-email',
      text: 'SELECT senha FROM usuario WHERE email = $1',
      values: [email],
    };

    const password = await db.query(query);

    return password;
  }

  async createUser({
    id, email, nome, senha,
  }) {
    const query = {
      name: 'create-user',
      text: 'INSERT INTO usuario(id, email, nome, senha) VALUES($1, $2, $3, $4)',
      values: [id, email, nome, senha],
    };

    const rows = await db.query(query);

    return rows;
  }
}

module.exports = new UserRepository();
