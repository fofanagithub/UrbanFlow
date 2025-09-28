import crypto from "crypto";
import { Client, TopicId, TopicMessageSubmitTransaction } from "@hashgraph/sdk";

export function hederaClient() {
  const network = process.env.HEDERA_NETWORK || "testnet";
  const client = Client.forName(network);
  const operatorId = process.env.HEDERA_OPERATOR_ID || process.env.HEDERA_ACCOUNT_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY || process.env.HEDERA_PRIVATE_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error("Hedera operator credentials are missing. Set HEDERA_ACCOUNT_ID/HEDERA_PRIVATE_KEY.");
  }

  client.setOperator(operatorId, operatorKey);
  return client;
}

export function sha256(obj) {
  const str = JSON.stringify(obj);
  return crypto.createHash("sha256").update(str).digest("hex");
}

// export async function submitToTopic(client, topicId, messageObj) {
//   const topic = TopicId.fromString(topicId);
//   const hash = sha256(messageObj);

//   const tx = await new TopicMessageSubmitTransaction({
//     topicId: topic,
//     message: Buffer.from(hash),
//   }).execute(client);

//   const receipt = await tx.getReceipt(client);

//   return { status: receipt.status.toString(), txId: tx.transactionId.toString(), hash };
// }

export async function submitHashToTopic(client, topicId, hashHex) {
    const topic = TopicId.fromString(topicId);
    const tx = await new TopicMessageSubmitTransaction({ 
        topicId: topic, message: Buffer.from(hashHex, 'utf8') 
    }).execute(client);
    const receipt = await tx.getReceipt(client);
    return { status: receipt.status.toString(), txId: tx.transactionId.toString() };
}
