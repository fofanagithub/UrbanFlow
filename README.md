# UrbanFlow — Smart City (Hedera)

## Getting Started
```bash
# 1. Prepare the environment
cp .env .env.local  # or verify existing values
# Fill in HEDERA_ACCOUNT_ID / PRIVATE_KEY and URBANFLOW_API_KEY if needed

# 2. (Optional) create additional Hedera topics
bash scripts/create_hedera_topic.sh

# 3. Build and start services (Postgres, backend, orchestrator, agent)
docker compose up --build

# 4. Health checks
curl http://localhost:8000/health
curl http://localhost:3005/status

# 5. Simulate traffic (locally, outside the container)
python3 simulator/simulator.py --rate 2 --scenario spike --sensor sensor_a

# 6. Observe decisions created by the agent
curl -H "x-api-key: ${URBANFLOW_API_KEY}" \
     -X POST http://localhost:8000/decisions \
     -H 'Content-Type: application/json' \
     -d '{"intersection_id":"RIVIERA-12","set_green_duration_s":45}'

# 7. List decisions (structure { "items": [...] })
curl http://localhost:8000/decisions

# 8. (Optional) Launch the frontend
cd frontend/urbanflow-frontend && npm install && npm run dev

```

---

## Pro notes & next steps
- **Hedera HCS** : the orchestrator hashes each decision in the database and then publishes to HCS_TOPIC_DECISIONS_ID; tx_id is written via /decisions.
- **Agents** : the Node regulator (LangChain + hedera-agent-kit) submits via /decisions with URBANFLOW_API_KEY and publishes telemetry to HCS_TOPIC_TELEMETRY_ID.
- **Frontend** : the React dashboard polls /decisions every 5s and displays the justification (reason) and green-light duration.
- **Sécurity** : store secrets (Hedera keys, API keys) via Docker secrets/K8s before production; restrict URBANFLOW_API_KEY to agents.
- **Tests** : add a backend pytest suite + Vitest or Playwright for the frontend; centralize Hedera logs (Prometheus/Grafana + Winston).
- **Évolutions** : consider a smart contract to aggregate stats (D3/D4) and enrich simulator scenarios (rush_hour, incident, rain).
