import { Database } from "sqlite3";
import { promisify } from "util";

// Tipagem explícita para os resultados da consulta
interface Favorite {
  id: number;
  symbol: string;
  shortName: string;
}

const isFavorite = (row: any): row is Favorite => {
  return (
    row &&
    typeof row.id === "number" &&
    typeof row.symbol === "string" &&
    typeof row.shortName === "string"
  );
};

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
      } else if (isFavorite(row)) {
        resolve(row);
      } else {
        resolve(undefined); // Retorna undefined se o formato for inválido
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
