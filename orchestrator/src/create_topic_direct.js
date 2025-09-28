import { Client, TopicCreateTransaction } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config(); // charge ton .env

async function main() {
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY;
  const network = process.env.HEDERA_NETWORK || "testnet";

  if (!operatorId || !operatorKey) {
    console.error("❌ HEDERA_OPERATOR_ID ou HEDERA_OPERATOR_KEY manquant dans .env");
    process.exit(1);
  }

  try {
    // Client Hedera (testnet/mainnet)
    const client = Client.forName(network);
    client.setOperator(operatorId, operatorKey);

    // Créer le Topic
    const tx = new TopicCreateTransaction();
    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);

    console.log("✅ NEW_TOPIC_ID =", receipt.topicId.toString());
  } catch (err) {
    console.error("❌ Erreur lors de la création du topic:", err.message || err);
  }
}

main();
