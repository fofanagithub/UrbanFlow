// Common Hedera + LLM bootstrap (CommonJS)
require('dotenv').config();

const { Client, PrivateKey } = require('@hashgraph/sdk');
const { HederaLangchainToolkit,
        coreQueriesPlugin,
        coreConsensusPlugin,
        coreAccountPlugin,
        coreTokenPlugin } = require('hedera-agent-kit');

function createLLM() {
  // Choisis le premier provider dispo
  try {
    const { ChatOllama } = require('@langchain/ollama');
    return new ChatOllama({
      model: 'llama3.2',
      baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434'
    });
  } catch (e) {
    console.error('Aucun provider IA configuré. Ajoute OPENAI_API_KEY/ANTHROPIC_API_KEY/GROQ_API_KEY ou lance Ollama.');
    process.exit(1);
  }
}

function createHederaToolkit() {
  const client = (process.env.HEDERA_NETWORK === 'mainnet')
    ? Client.forMainnet()
    : Client.forTestnet();

  const accountId = process.env.HEDERA_ACCOUNT_ID || process.env.HEDERA_OPERATOR_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY || process.env.HEDERA_OPERATOR_KEY;

  if (!accountId || !privateKey) {
    throw new Error('HEDERA_ACCOUNT_ID/HEDERA_PRIVATE_KEY (ou HEDERA_OPERATOR_*) doivent être définis dans l\'environnement.');
  }

  // ⚠️ Auto-détection ED25519/ECDSA + pas de "0x" devant
  const priv = PrivateKey.fromString(privateKey);
  client.setOperator(accountId, priv);

  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      plugins: [
        coreQueriesPlugin,
        coreConsensusPlugin,
        coreAccountPlugin,
        coreTokenPlugin
      ]
    }
  });

  return { client, hederaAgentToolkit };
}

module.exports = { createLLM, createHederaToolkit };
