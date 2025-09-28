#!/usr/bin/env bash
set -e
cp -n .env.example .env || true
docker compose up --build -d
sleep 3
curl -s http://localhost:8000/health || true
