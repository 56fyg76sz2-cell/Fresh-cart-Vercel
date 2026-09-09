import { sql } from '@vercel/postgres';
import { initDb } from './db.js';
export default async function handler(req,res){
  try { await initDb(); const q=(req.query?.q||'').trim(); const category=(req.query?.category||'').trim(); let result;
    if(q&&category) result=await sql`SELECT * FROM products WHERE category=${category} AND name ILIKE ${'%'+q+'%'} ORDER BY id DESC`;
    else if(q) result=await sql`SELECT * FROM products WHERE name ILIKE ${'%'+q+'%'} ORDER BY id DESC`;
    else if(category) result=await sql`SELECT * FROM products WHERE category=${category} ORDER BY id DESC`;
    else result=await sql`SELECT * FROM products ORDER BY id DESC`;
    res.status(200).json(result.rows);
  } catch(e){res.status(500).json({error:'Database error'});}
}
