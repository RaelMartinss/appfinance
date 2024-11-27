// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
// import * as schema from './schema';

// const sqlite = new Database('local.db');
// export const db = drizzle(sqlite, { schema });

// // Initialize database tables
// const initDb = () => {
//   sqlite.exec(`
//     CREATE TABLE IF NOT EXISTS transactions (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       symbol TEXT NOT NULL,
//       name TEXT NOT NULL,
//       type TEXT NOT NULL,
//       asset_type TEXT NOT NULL,
//       quantity REAL NOT NULL,
//       price REAL NOT NULL,
//       total REAL NOT NULL,
//       date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS portfolio (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       symbol TEXT NOT NULL,
//       name TEXT NOT NULL,
//       asset_type TEXT NOT NULL,
//       quantity REAL NOT NULL,
//       average_price REAL NOT NULL,
//       current_price REAL NOT NULL,
//       last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS watchlist (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       symbol TEXT NOT NULL,
//       name TEXT NOT NULL,
//       added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `);
// };

// initDb();