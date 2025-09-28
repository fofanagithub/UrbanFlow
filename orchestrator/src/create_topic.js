import { Client, TopicCreateTransaction } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();


const client = Client.forName(process.env.HEDERA_NETWORK || "testnet");
client.setOperator(process.env.HEDERA_OPERATOR_ID, process.env.HEDERA_OPERATOR_KEY);


const receipt = await (await new TopicCreateTransaction().execute(client)).getReceipt(client);
console.log("NEW_TOPIC_ID=", receipt.topicId.toString());