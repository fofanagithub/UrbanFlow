require('dotenv').config();
const { Client, PrivateKey, TopicCreateTransaction } = require('@hashgraph/sdk');

async function ensureTopics() {
  const client = (process.env.HEDERA_NETWORK === 'mainnet')
    ? Client.forMainnet()
    : Client.forTestnet();

  // ⚠️ Utiliser fromString(...) (auto)
  client.setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
  );

  async function createIfEmpty(current, label) {
    if (current && current.trim() !== '') return current;
    const txResponse = await (await new TopicCreateTransaction().freezeWith(client)).execute(client);
    const receipt = await txResponse.getReceipt(client);
    const topicId = receipt.topicId.toString();
    console.log(`${label} créé: ${topicId}`);
    return topicId;
  }

  const telemetry = await createIfEmpty(process.env.HCS_TOPIC_TELEMETRY_ID, 'HCS_TOPIC_TELEMETRY_ID');
  const decisions = await createIfEmpty(process.env.HCS_TOPIC_DECISIONS_ID, 'HCS_TOPIC_DECISIONS_ID');

  console.log('--- A ajouter dans .env ---');
  console.log(`HCS_TOPIC_TELEMETRY_ID=${telemetry}`);
  console.log(`HCS_TOPIC_DECISIONS_ID=${decisions}`);
}

if (require.main === module) {
  ensureTopics().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { ensureTopics };
