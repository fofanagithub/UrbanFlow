# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: FastAPI service; SQLAlchemy logic in `models/`, Pydantic schemas in `schemas.py`.
- `frontend/urbanflow-frontend/`: Vite + React dashboard; assets in `public/`, components in `src/`.
- `orchestrator/`: Node worker hashing decisions to Hedera from `src/index.js`.
- `agent/hedera-agents/`: LangChain regulator/advisor scripts under `src/` with shared helpers in `src/common/`.
- `simulator/`: Python load generator for ingest scenarios; sample payloads in `data/`.
- `db/init.sql` + `backend/alembic/`: database bootstrap and migrations; Dockerfiles sit in `infra/docker/` with orchestration in `docker-compose.yml`.
- `scripts/`: setup helpers (`create_hedera_topic.sh`, `demo.sh`); environment secrets stay in `.env`.

## Build, Test, and Development Commands
- `cp .env.example .env` then add Hedera operator keys before booting services.
- `docker compose up --build`: compile all images and start Postgres, backend, orchestrator, and agents.
- `pip install -r backend/requirements.txt && uvicorn app:app --reload --app-dir backend`: local API dev server.
- `cd frontend/urbanflow-frontend && npm install && npm run dev`: Vite dev server; use `npm run build` for production bundles.
- `cd orchestrator && npm install && npm start`: bridge decisions to Hedera; verify `/status` at `http://localhost:3005/status`.
- `cd agent/hedera-agents && npm install && npm run dev:regulator`: watch-mode loop for the regulator; swap scripts for other agents.
- `python simulator/simulator.py --rate 2 --scenario spike --sensor sensor_a`: drive sample traffic to validate the ingest path.

## Coding Style & Naming Conventions
- Python: 4-space indents, snake_case identifiers, typed FastAPI endpoints; keep persistence code inside `models/crud.py`.
- JavaScript: run `npm run lint` in the frontend; prefer camelCase helpers and early `dotenv.config()` in Node services.
- Agents stay in CommonJS with 2-space indents; export tool builders with verb-first names (e.g., `buildUrbanflowTools`).

## Testing Guidelines
- Add backend tests under `backend/tests/` with `pytest`; run `python -m pytest backend/tests` when suites are available.
- Extend the dashboard with Vitest or Playwright inside `src/__tests__/`; enforce linting before merge.
- After Hedera changes, rerun the simulator command above and confirm orchestrator logs include transaction IDs.

## Commit & Pull Request Guidelines
- Use present-tense, imperative subject lines such as `feat: hash decisions before publish`; keep summaries ≤72 characters.
- Scope commits per component (backend/orchestrator/frontend/agents) and call it out when it clarifies impact.
- PRs must outline changes, link related topics or issues, and document validation steps (lint output, simulator run, UI screenshots).
