import { initDb } from './db.js';
export default async function handler(req,res){try{await initDb();res.json({ok:true,service:'FreshCart API'})}catch(e){res.status(500).json({ok:false,error:'Database not configured'})}}
