FROM node:20-alpine
WORKDIR /usr/src/app
COPY orchestrator/package.json orchestrator/package-lock.json* ./
RUN npm install --omit=dev || npm install
COPY orchestrator ./
EXPOSE 3005
CMD ["node", "src/index.js"]