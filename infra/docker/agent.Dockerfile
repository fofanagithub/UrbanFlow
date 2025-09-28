FROM node:20-alpine
WORKDIR /agent/hedera-agents
COPY agent/hedera-agents/package*.json ./
RUN npm install --omit=dev || npm install
COPY agent/hedera-agents ./
CMD ["node", "src/regulator.js"]
