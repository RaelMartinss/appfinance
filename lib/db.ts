import { Database } from "sqlite3";
import { promisify } from "util";

// Inicializando o banco de dados SQLite
const db = new Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conexão com SQLite estabelecida!");
  }
});

// Criando uma função `dbGet` personalizada que suporta parâmetros
const dbGet = (query: string, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Convertendo `db.all` para Promises
const dbAll = promisify(db.all).bind(db);

// Criação das tabelas (se não existirem)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      shortName TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      shortName TEXT NOT NULL
    )
  `);
});

export { db, dbGet, dbAll };
