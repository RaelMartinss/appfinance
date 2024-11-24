import { Database } from "sqlite3";
import { promisify } from "util";

// Tipagem explícita para os resultados da consulta
interface Favorite {
  id: number;
  symbol: string;
  shortName: string;
}

const db = new Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conexão com SQLite estabelecida!");
  }
});

// Convertendo os métodos do SQLite para Promises
// Modificando a forma como dbGet é tipado
const dbGet = (query: string, params: any[]): Promise<Favorite | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        // Verifica se 'row' tem as propriedades esperadas de um 'Favorite'
        if (row && typeof row.id === "number" && typeof row.symbol === "string" && typeof row.shortName === "string") {
          resolve(row as Favorite); // Tipo explicitamente convertido para 'Favorite'
        } else {
          resolve(undefined); // Caso não seja um 'Favorite', resolve como 'undefined'
        }
      }
    });
  });
};

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

// Exportando dbGet e dbAll com a tipagem de Favorite
export { db, dbGet, dbAll };
