# UrbanFlow — Smart City (Hedera)

## Lancer
```bash
# 1. Préparer l'environnement
cp .env .env.local  # ou vérifiez les valeurs existantes
# Compléter HEDERA_ACCOUNT_ID / PRIVATE_KEY et URBANFLOW_API_KEY si besoin

# 2. (Option) créer des topics Hedera supplémentaires
bash scripts/create_hedera_topic.sh

# 3. Construire et lancer les services (Postgres, backend, orchestrator, agent)
docker compose up --build

# 4. Vérifier la santé
curl http://localhost:8000/health
curl http://localhost:3005/status

# 5. Simuler du trafic (en local hors conteneur)
python3 simulator/simulator.py --rate 2 --scenario spike --sensor sensor_a

# 6. Observer les décisions créées par l'agent
curl -H "x-api-key: ${URBANFLOW_API_KEY}" \
     -X POST http://localhost:8000/decisions \
     -H 'Content-Type: application/json' \
     -d '{"intersection_id":"RIVIERA-12","set_green_duration_s":45}'

# 7. Lister les décisions (structure { "items": [...] })
curl http://localhost:8000/decisions

# 8. (Option) Visualiser côté frontend
cd frontend/urbanflow-frontend && npm install && npm run dev
```

---

## Notes pro & next
- **Hedera HCS** : l'orchestrator hache chaque décision en base puis publie sur `HCS_TOPIC_DECISIONS_ID`; `tx_id` est écrit via `/decisions`.
- **Agents** : le régulateur Node (LangChain + hedera-agent-kit) soumet via `/decisions` avec `URBANFLOW_API_KEY` et publie la télémétrie sur `HCS_TOPIC_TELEMETRY_ID`.
- **Frontend** : le dashboard React interroge `/decisions` toutes les 5s et affiche la justification (`reason`) et la durée feu vert.
- **Sécurité** : stocker les secrets (clés Hedera, API) via Docker secrets/K8s avant une mise en prod; limiter `URBANFLOW_API_KEY` aux agents.
- **Tests** : ajouter une suite `pytest` backend + Vitest ou Playwright côté frontend; centraliser les logs Hedera (Prometheus/Grafana + Winston).
- **Évolutions** : envisager un smart contract pour agréger les stats (J3/J4) et enrichir les scénarios simulateur (`rush_hour`, `incident`, `rain`).
