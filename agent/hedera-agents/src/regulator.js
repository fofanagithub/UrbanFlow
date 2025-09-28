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
`Tu es "UrbanFlow Traffic Regulator".
Règle: résume les données (queue_len, wait_time, emergency), puis ajuste green.
Publie sur HCS et pousse la décision au backend.`],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = createToolCallingAgent({ llm, tools, prompt });
  const executor = new AgentExecutor({ agent, tools });

  const input = `intersection_id=RIVIERA-12; queue_len=23; wait_time_s=95; emergency=false; propose la décision`;
  const res = await executor.invoke({ input });
  console.log(res);
}

main().catch((e) => { console.error(e); process.exit(1); });
