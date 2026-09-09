import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, unit TEXT DEFAULT '1 pc', emoji TEXT DEFAULT '🛒', stock INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, total NUMERIC(10,2) NOT NULL, status TEXT DEFAULT 'Placed', created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, product_id INTEGER, name TEXT NOT NULL, quantity INTEGER NOT NULL, price NUMERIC(10,2) NOT NULL)`;
  const { rows } = await sql`SELECT COUNT(*)::int AS count FROM products`;
  if (rows[0].count === 0) {
    const products = [
      ['Fresh Apples','Fruits',129,'1 kg','🍎',40],['Bananas','Fruits',59,'1 dozen','🍌',50],['Tomatoes','Vegetables',49,'1 kg','🍅',60],['Potatoes','Vegetables',39,'1 kg','🥔',70],['Milk','Dairy',65,'1 litre','🥛',40],['Paneer','Dairy',110,'200 g','🧀',25],['Brown Bread','Bakery',45,'1 pack','🍞',30],['Eggs','Dairy',84,'12 pcs','🥚',35],['Basmati Rice','Staples',399,'5 kg','🍚',20],['Wheat Atta','Staples',275,'5 kg','🌾',25],['Orange Juice','Beverages',120,'1 litre','🧃',30],['Potato Chips','Snacks',40,'1 pack','🥔',50]
    ];
    for (const p of products) await sql`INSERT INTO products (name,category,price,unit,emoji,stock) VALUES (${p[0]},${p[1]},${p[2]},${p[3]},${p[4]},${p[5]})`;
  }
}
