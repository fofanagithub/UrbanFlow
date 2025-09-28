const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { AgentExecutor, createToolCallingAgent } = require('langchain/agents');
const { createLLM, createHederaToolkit } = require('./common/hedera');
const { buildUrbanflowTools } = require('./tools/urbanflow-tools');

async function main() {
  const llm = createLLM();
  const { hederaAgentToolkit } = createHederaToolkit();
  const hederaTools = hederaAgentToolkit.getTools();
  const urbanflowTools = buildUrbanflowTools();
  const tools = [...hederaTools, ...urbanflowTools];

  const prompt = ChatPromptTemplate.fromMessages([
    ['system',
`Tu es "UrbanFlow Traffic Advisor".
Analyse des 30 dernières minutes et conseille des stratégies; journalise sur HCS.`],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = createToolCallingAgent({ llm, tools, prompt });
  const executor = new AgentExecutor({ agent, tools });

  const input = `Analyse les flux des 30 dernières minutes pour RIVIERA-12 et propose une stratégie.`;
  const res = await executor.invoke({ input });
  console.log(res);
}

main().catch((e) => { console.error(e); process.exit(1); });
