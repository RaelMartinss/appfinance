import { sql } from "drizzle-orm";
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  type: text('type'), // buy or sell
  assetType: text('asset_type'),
  quantity: real('quantity'),
  price: real('price'),
  total: real('total'),
  date: integer('date', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const portfolio = sqliteTable('portfolio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  assetType: text('asset_type').notNull(),
  quantity: real('quantity').notNull(),
  averagePrice: real('average_price').notNull(),
  currentPrice: real('current_price').notNull(),
  lastUpdate: integer('last_update', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const watchlist = sqliteTable('watchlist', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  addedAt: integer('added_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});