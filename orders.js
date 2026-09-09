import { sql } from '@vercel/postgres';
import { initDb } from './db.js';
export default async function handler(req,res){
  try { await initDb();
    if(req.method==='GET'){ const id=req.query?.id; if(id){const o=await sql`SELECT * FROM orders WHERE id=${id}`; const items=await sql`SELECT * FROM order_items WHERE order_id=${id}`; if(!o.rows[0]) return res.status(404).json({error:'Order not found'}); return res.json({...o.rows[0],items:items.rows});} const r=await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`; return res.json(r.rows); }
    if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
    const {customer,items}=req.body||{}; if(!customer?.name||!customer?.phone||!customer?.address||!Array.isArray(items)||!items.length) return res.status(400).json({error:'Missing order details'});
    let total=0; const checked=[]; for(const item of items){const r=await sql`SELECT * FROM products WHERE id=${item.productId}`; const p=r.rows[0]; const qty=Number(item.quantity); if(!p||!Number.isInteger(qty)||qty<1||qty>p.stock) return res.status(400).json({error:`Insufficient stock for ${p?.name||'product'}`}); total+=Number(p.price)*qty; checked.push({p,qty});}
    const order=await sql`INSERT INTO orders (customer_name,phone,address,total) VALUES (${customer.name},${customer.phone},${customer.address},${total.toFixed(2)}) RETURNING *`;
    for(const x of checked){await sql`INSERT INTO order_items (order_id,product_id,name,quantity,price) VALUES (${order.rows[0].id},${x.p.id},${x.p.name},${x.qty},${x.p.price})`; await sql`UPDATE products SET stock=stock-${x.qty} WHERE id=${x.p.id}`;}
    res.status(201).json(order.rows[0]);
  } catch(e){res.status(500).json({error:'Could not process order'});}
}
