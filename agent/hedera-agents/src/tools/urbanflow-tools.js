require('dotenv').config();
// node-fetch v2 pour require() en CommonJS
const fetch = require('node-fetch');
const { z } = require('zod');
const { tool } = require('langchain/tools');
const { ConsensusSubmitMessageTransaction, TopicId, Client, PrivateKey } = require('@hashgraph/sdk');

function buildUrbanflowTools() {
  const backendUrl = process.env.URBANFLOW_BACKEND_URL;
  const apiKey = process.env.URBANFLOW_API_KEY;

  if (!backendUrl) {
    throw new Error('URBANFLOW_BACKEND_URL doit être défini pour utiliser les outils UrbanFlow.');
  }

  const submitDecision = tool({
    name: 'submit_decision_to_urbanflow',
    description: 'Soumettre une décision de feux (durées, priorités) au backend UrbanFlow.',
    schema: z.object({
      intersection_id: z.string(),
      set_green_duration_s: z.number(),
      reason: z.string().optional()
    }),
    func: async ({ intersection_id, set_green_duration_s, reason }) => {
      const res = await fetch(`${backendUrl}/decisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
        body: JSON.stringify({ intersection_id, set_green_duration_s, reason })
      });
      const data = await res.json().catch(() => ({}));
      return JSON.stringify({ status: res.status, data });
    }
  });

  const publishTelemetry = tool({
    name: 'publish_telemetry_hcs',
    description: 'Publier un message JSON (télémétrie/justification) sur le topic HCS telemetry.',
    schema: z.object({
      payload: z.record(z.any())
    }),
    func: async ({ payload }) => {
      const client = (process.env.HEDERA_NETWORK === 'mainnet')
        ? Client.forMainnet()
        : Client.forTestnet();
      client.setOperator(
        process.env.HEDERA_ACCOUNT_ID,
        PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
      );
      const topicId = TopicId.fromString(process.env.HCS_TOPIC_TELEMETRY_ID);
      const tx = new ConsensusSubmitMessageTransaction({
        topicId,
        message: Buffer.from(JSON.stringify(payload))
      });
      const resp = await tx.execute(client);
      const receipt = await resp.getReceipt(client);
      return JSON.stringify({ status: 'OK', sequence: receipt.topicSequenceNumber?.toString() });
    }
  });

  return [submitDecision, publishTelemetry];
}

module.exports = { buildUrbanflowTools };
