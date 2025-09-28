import dotenv from "dotenv";
import express from "express";
import pkg from "pg";
import { hederaClient, sha256, submitHashToTopic } from "./hcs_client.js";


dotenv.config();
const { Pool } = pkg;


const rawConnectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_PG || '';
const normalizedConnectionString = rawConnectionString.replace('postgresql+psycopg2', 'postgres');

if (!normalizedConnectionString) {
    throw new Error('DATABASE_URL (ou DATABASE_URL_PG) doit être défini pour l\'orchestrator.');
}

const pool = new Pool({ connectionString: normalizedConnectionString });
const client = hederaClient();
const topicId = process.env.HEDERA_TOPIC_ID || process.env.HCS_TOPIC_DECISIONS_ID;


const app = express();
app.use(express.json());



app.get('/status', async (_, res) => {
    const { rows } = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, topicId, db_now: rows[0].now });
});


async function fetchUnpublished(limit = 100) {
    const q = `SELECT id, sensor_id, decision, timestamp FROM decisions WHERE tx_id IS NULL ORDER BY timestamp DESC LIMIT $1`;
    const { rows } = await pool.query(q, [limit]);
    return rows;
}

async function markTx(decisionId, txId) {
    await pool.query("UPDATE decisions SET tx_id = $1 WHERE id = $2", [txId, decisionId]);
}


async function pump() {
    if (!topicId) { console.warn('[HCS] No HEDERA_TOPIC_ID set, skipping'); return; }
    const rows = await fetchUnpublished(100);
    for (const r of rows) {
        const payload = { sensor_id: r.sensor_id, decision: r.decision, ts: r.timestamp };
        const hashHex = sha256(payload);
        try {
            const { txId, status } = await submitHashToTopic(client, topicId, hashHex);
            await markTx(r.id, txId);
            console.log(`[HCS] decision#${r.id} → tx=${txId} status=${status} hash=${hashHex.slice(0,8)}…`);
        } catch (e) {
        console.error('[HCS] publish error', e?.message || e);
        }
    }
}


setInterval(pump, 4000);


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`orchestrator listening on :${PORT}`));
